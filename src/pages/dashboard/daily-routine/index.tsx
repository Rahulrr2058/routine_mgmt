// src/pages/DailyClassPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import {
    MantineProvider,
    createTheme,
    Title,
    Button,
    Group,
    Stack,
    Paper,
    Badge,
    Text,
    Table,
    Loader,
    Switch,
    Alert,
    Select,
    Grid,
} from '@mantine/core';
import { IconCheck, IconX, IconCalendarEvent, IconFilter } from '@tabler/icons-react';
import { AdminDashboardLayout } from "@/layouts/AdminDashboardLayout";
import { GetRequest, PatchRequest, PostRequest } from "@/plugins/https";
import { format } from 'date-fns';

const theme = createTheme({ primaryColor: 'indigo' });

interface Faculty { id: string; name: string; isActive: boolean; }
interface Batch   { id: string; name: string; year: string; isActive: boolean; faculty?: Faculty; }
interface Semester{ id: string; name: string; isActive: boolean; batch?: Batch; }
interface Section { id: string; name: string; semester?: Semester; }

interface DailyClass {
    id: string;
    classDate: string;
    hasAttended: boolean;
    classRoutine: {
        id: string;
        day: string;
        index: number;
        startTime: string;
        endTime: string;
        roomNo?: string;
        teacher?: { id: string; name: string; isActive: boolean };
        subject?: { id: string; name: string; code: string; isActive: boolean };
        classSection: {
            id: string;
            name: string;
            semester: {
                id: string;
                name: string;
                batch: {
                    id: string;
                    name: string;
                    year: string;
                    faculty: {
                        id: string;
                        name: string;
                    };
                };
            };
        };
    };
}

export default function DailyClassPage() {
    const [dailyClasses, setDailyClasses] = useState<DailyClass[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
    const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);

    // Fetch today's classes
    const fetchTodaysClasses = async () => {
        try {
            setLoading(true);
            setError(null);

            const today = format(new Date(), 'yyyy-MM-dd');
            const res = await GetRequest(`/daily-class/date/${today}`);

            const data = res.data?.data || res.data || [];
            setDailyClasses(data);
        } catch (err: any) {
            console.error("Failed to fetch today's classes", err);
            setError(err.response?.data?.message || "Failed to load today's classes");
            setDailyClasses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateClass = async () => {
        try{
            await PostRequest("/daily-class/generate-daily-class",{});
            fetchTodaysClasses();
        }
        catch(err: any)
        {
            console.error("Failed to generate class", err);
            alert("Failed to generate class");
        }
    }

    useEffect(() => {
        fetchTodaysClasses();
    }, []);

    const toggleAttendance = async (dailyClass: DailyClass) => {
        try {
            setUpdatingId(dailyClass.id);
            await PatchRequest(`/daily-class/${dailyClass.id}`, {
                hasAttended: !dailyClass.hasAttended,
            });

            setDailyClasses(prev =>
                prev.map(dc =>
                    dc.id === dailyClass.id
                        ? { ...dc, hasAttended: !dc.hasAttended }
                        : dc
                )
            );
        } catch (err: any) {
            console.error("Failed to update attendance", err);
            alert("Failed to update attendance");
        } finally {
            setUpdatingId(null);
        }
    };

    const todayFormatted = format(new Date(), 'EEEE, MMMM d, yyyy');

    // Extract unique filter options from the loaded classes
    const filterOptions = useMemo(() => {
        const faculties = new Map<string, string>();
        const batches = new Map<string, string>();
        const semesters = new Map<string, string>();
        const sections = new Map<string, string>();

        dailyClasses.forEach(dc => {
            const sec = dc.classRoutine?.classSection;
            if (!sec) return;
            const sem = sec.semester;
            const bat = sem?.batch;
            const fac = bat?.faculty;

            if (fac) faculties.set(fac.id, fac.name);
            if (bat) {
                if (!selectedFaculty || fac?.id === selectedFaculty) {
                    batches.set(bat.id, `${bat.name} (${bat.year})`);
                }
            }
            if (sem) {
                if (!selectedBatch || bat?.id === selectedBatch) {
                    semesters.set(sem.id, sem.name);
                }
            }
            if (sec) {
                if (!selectedSemester || sem?.id === selectedSemester) {
                    sections.set(sec.id, sec.name);
                }
            }
        });

        return {
            faculties: Array.from(faculties.entries()).map(([value, label]) => ({ value, label })),
            batches: Array.from(batches.entries()).map(([value, label]) => ({ value, label })),
            semesters: Array.from(semesters.entries()).map(([value, label]) => ({ value, label })),
            sections: Array.from(sections.entries()).map(([value, label]) => ({ value, label })),
        };
    }, [dailyClasses, selectedFaculty, selectedBatch, selectedSemester]);

    // Group filtered classes by section
    const groupedClasses = useMemo(() => {
        let filtered = dailyClasses;

        if (selectedFaculty) {
            filtered = filtered.filter(dc => dc.classRoutine?.classSection?.semester?.batch?.faculty?.id === selectedFaculty);
        }
        if (selectedBatch) {
            filtered = filtered.filter(dc => dc.classRoutine?.classSection?.semester?.batch?.id === selectedBatch);
        }
        if (selectedSemester) {
            filtered = filtered.filter(dc => dc.classRoutine?.classSection?.semester?.id === selectedSemester);
        }
        if (selectedSection) {
            filtered = filtered.filter(dc => dc.classRoutine?.classSection?.id === selectedSection);
        }

        const groups = new Map<string, { sectionInfo: any, classes: DailyClass[] }>();

        filtered.forEach(dc => {
            const sec = dc.classRoutine?.classSection;
            if (!sec) return;
            const key = sec.id;
            
            if (!groups.has(key)) {
                groups.set(key, { sectionInfo: sec, classes: [] });
            }
            groups.get(key)!.classes.push(dc);
        });

        // Sort classes within each group by index
        Array.from(groups.values()).forEach(group => {
            group.classes.sort((a, b) => a.classRoutine.index - b.classRoutine.index);
        });

        return Array.from(groups.values());
    }, [dailyClasses, selectedFaculty, selectedBatch, selectedSemester, selectedSection]);

    return (
        <MantineProvider theme={theme} defaultColorScheme="light">
            <div className="p-8 max-w-[1400px] mx-auto">
                <Group justify="space-between" mb="xl">
                    <Stack gap={4}>
                        <Title order={1}>Today's Classes</Title>
                        <Group gap="xs" align="center">
                            <IconCalendarEvent size={20} />
                            <Text size="lg" c="dimmed">{todayFormatted}</Text>
                        </Group>
                    </Stack>
                    <Group>
                        <Button variant="outline" color="teal" onClick={handleGenerateClass}>
                            Generate Daily Routine
                        </Button>
                        <Button onClick={fetchTodaysClasses} loading={loading} variant="light">
                            Refresh
                        </Button>
                    </Group>
                </Group>

                {error && (
                    <Alert color="red" mb="lg">
                        {error}
                    </Alert>
                )}

                {/* Filters */}
                <Paper p="md" withBorder mb="xl" radius="md" shadow="sm">
                    <Group mb="xs" align="center">
                        <IconFilter size={18} color="gray" />
                        <Text fw={600} size="sm" c="dimmed">Filter Classes</Text>
                    </Group>
                    <Grid>
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Select
                                placeholder="All Faculties"
                                data={filterOptions.faculties}
                                value={selectedFaculty}
                                onChange={(val) => {
                                    setSelectedFaculty(val);
                                    setSelectedBatch(null);
                                    setSelectedSemester(null);
                                    setSelectedSection(null);
                                }}
                                clearable
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Select
                                placeholder="All Batches"
                                data={filterOptions.batches}
                                value={selectedBatch}
                                onChange={(val) => {
                                    setSelectedBatch(val);
                                    setSelectedSemester(null);
                                    setSelectedSection(null);
                                }}
                                clearable
                                disabled={!selectedFaculty && filterOptions.batches.length === 0}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Select
                                placeholder="All Semesters"
                                data={filterOptions.semesters}
                                value={selectedSemester}
                                onChange={(val) => {
                                    setSelectedSemester(val);
                                    setSelectedSection(null);
                                }}
                                clearable
                                disabled={!selectedBatch && filterOptions.semesters.length === 0}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Select
                                placeholder="All Sections"
                                data={filterOptions.sections}
                                value={selectedSection}
                                onChange={setSelectedSection}
                                clearable
                                disabled={!selectedSemester && filterOptions.sections.length === 0}
                            />
                        </Grid.Col>
                    </Grid>
                </Paper>

                {loading ? (
                    <Paper p="xl" withBorder ta="center">
                        <Loader size="lg" />
                        <Text mt="md">Loading today's classes...</Text>
                    </Paper>
                ) : dailyClasses.length === 0 ? (
                    <Paper p="xl" withBorder>
                        <Text c="dimmed" ta="center" size="lg">
                            No classes scheduled for today.
                        </Text>
                    </Paper>
                ) : groupedClasses.length === 0 ? (
                    <Paper p="xl" withBorder>
                        <Text c="dimmed" ta="center" size="lg">
                            No classes match the selected filters.
                        </Text>
                    </Paper>
                ) : (
                    <Stack gap="xl">
                        {groupedClasses.map((group) => {
                            const sec = group.sectionInfo;
                            const sem = sec.semester;
                            const bat = sem?.batch;
                            const fac = bat?.faculty;

                            // Table Header Data (Periods)
                            const uniqueIndices = [...new Set(group.classes.map(dc => dc.classRoutine.index))].sort((a, b) => a - b);
                            const indexToTimeLabel = new Map<number, string>();
                            group.classes.forEach(dc => {
                                if (!indexToTimeLabel.has(dc.classRoutine.index)) {
                                    indexToTimeLabel.set(dc.classRoutine.index, `${dc.classRoutine.startTime} – ${dc.classRoutine.endTime}`);
                                }
                            });

                            const dayName = group.classes[0]?.classRoutine.day || format(new Date(), 'EEEE');

                            return (
                                <Paper key={sec.id} p="md" withBorder shadow="sm" radius="md">
                                    <Group justify="space-between" align="center" mb="md">
                                        <div>
                                            <Title order={3} c="indigo.7">{sec.name} Daily Routine</Title>
                                            <Text size="sm" c="dimmed" mt={4}>
                                                Faculty: <Text component="span" fw={600} c="dark">{fac?.name || '—'}</Text> &bull;{' '}
                                                Batch: <Text component="span" fw={600} c="dark">{bat?.name || '—'} ({bat?.year || '—'})</Text> &bull;{' '}
                                                Semester: <Text component="span" fw={600} c="dark">{sem?.name || '—'}</Text> &bull;{' '}
                                                Section: <Text component="span" fw={600} c="dark">{sec.name}</Text>
                                            </Text>
                                        </div>
                                    </Group>

                                    <div style={{ overflowX: 'auto' }}>
                                        <Table 
                                            withTableBorder 
                                            withColumnBorders 
                                            striped 
                                            highlightOnHover 
                                            verticalSpacing="sm" 
                                            horizontalSpacing="md"
                                        >
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Table.Th ta="center" fw={700} style={{ minWidth: 100, background: '#eef2ff' }}>
                                                        Day
                                                    </Table.Th>
                                                    {uniqueIndices.map(idx => (
                                                        <Table.Th
                                                            key={idx}
                                                            ta="center"
                                                            fw={500}
                                                            style={{ minWidth: 180, background: '#f8f9fa' }}
                                                        >
                                                            Period {idx}
                                                            <br />
                                                            <Text size="xs" c="dimmed" fw={400}>
                                                                {indexToTimeLabel.get(idx) || '—'}
                                                            </Text>
                                                        </Table.Th>
                                                    ))}
                                                </Table.Tr>
                                            </Table.Thead>

                                            <Table.Tbody>
                                                <Table.Tr>
                                                    <Table.Td fw={700} ta="center" c="indigo.7" style={{ background: '#eef2ff' }}>
                                                        {dayName}
                                                    </Table.Td>

                                                    {uniqueIndices.map(idx => {
                                                        const dc = group.classes.find(c => c.classRoutine.index === idx);
                                                        return (
                                                            <Table.Td
                                                                key={idx}
                                                                ta="center"
                                                                style={{ padding: '12px 8px' }}
                                                            >
                                                                {dc ? (
                                                                    <Stack gap={6} align="center">
                                                                        <Text fw={600} size="sm" lh={1.2}>
                                                                            {dc.classRoutine.subject?.name || 'Unknown Subject'}
                                                                        </Text>
                                                                        <Text size="xs" c="gray.7" fw={500}>
                                                                            {dc.classRoutine.teacher?.name || 'Unknown Teacher'}
                                                                        </Text>
                                                                        {dc.classRoutine.roomNo && (
                                                                            <Badge size="xs" color="violet" variant="light" radius="sm">
                                                                                {dc.classRoutine.roomNo}
                                                                            </Badge>
                                                                        )}
                                                                        
                                                                        <Group gap={6} mt={4}>
                                                                            <Switch
                                                                                checked={dc.hasAttended}
                                                                                onChange={() => toggleAttendance(dc)}
                                                                                disabled={updatingId === dc.id}
                                                                                color="teal"
                                                                                size="sm"
                                                                                thumbIcon={
                                                                                    dc.hasAttended ? (
                                                                                        <IconCheck size={10} />
                                                                                    ) : (
                                                                                        <IconX size={10} />
                                                                                    )
                                                                                }
                                                                            />
                                                                            <Text size="xs" fw={500} c={dc.hasAttended ? "teal" : "dimmed"}>
                                                                                {dc.hasAttended ? "Attended" : "Not Attended"}
                                                                            </Text>
                                                                        </Group>
                                                                    </Stack>
                                                                ) : (
                                                                    <Text size="xs" c="gray.5" fs="italic">—</Text>
                                                                )}
                                                            </Table.Td>
                                                        );
                                                    })}
                                                </Table.Tr>
                                            </Table.Tbody>
                                        </Table>
                                    </div>
                                </Paper>
                            );
                        })}
                    </Stack>
                )}
            </div>
        </MantineProvider>
    );
}

DailyClassPage.getLayout = (page: any) => (
    <AdminDashboardLayout>{page}</AdminDashboardLayout>
);