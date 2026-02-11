// src/pages/ClassRoutinePage.tsx
import React, { useEffect, useState } from 'react';
import {
    MantineProvider,
    createTheme,
    Title,
    Button,
    Group,
    Stack,
    Paper,
    Badge,
    Card,
    Grid,
    Text,
    ActionIcon,
    Table,
    Loader,
    Breadcrumbs,
    Anchor,
    Modal,
    Select,
    TextInput,
    NumberInput,
} from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { IconPlus, IconArrowLeft, IconChevronRight } from '@tabler/icons-react';
import { AdminDashboardLayout } from "@/layouts/AdminDashboardLayout";
import { GetRequest, PostRequest, PatchRequest } from "@/plugins/https";

const theme = createTheme({ primaryColor: 'indigo' });

const WEEK_DAYS_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface Faculty { id: string; name: string; isActive: boolean; }
interface Batch   { id: string; name: string; year: string; isActive: boolean; faculty?: Faculty; }
interface Semester{ id: string; name: string; isActive: boolean; batch?: Batch; }
interface Section { id: string; name: string; semester?: Semester; }

interface Teacher { id: string; name: string; isActive: boolean; subject: TeacherSubject[]; }
interface TeacherSubject { id: string; name: string; code: string; isActive: boolean; }

interface Routine {
    id: string;
    day: string;
    index: number;
    startTime: string;
    endTime: string;
    roomNo?: string;
    teacher: { id: string; name: string; isActive: boolean };
    subject: { id: string; name: string; code: string; isActive: boolean };
    classSection: { id: string; name: string; semester?: Semester };
}

type FormData = {
    day: string;
    index: number;
    startTime: string;
    endTime: string;
    teacher: string;       // teacher id
    subject: string;       // subject name
    subjectCode: string;
    roomNo: string;
};

export default function ClassRoutinePage() {
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [teacherSubjects, setTeacherSubjects] = useState<TeacherSubject[]>([]);

    const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
    const [selectedSection, setSelectedSection] = useState<Section | null>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);

    const [loading, setLoading] = useState({ fac: true, tea: true });

    const form = useForm<FormData>({
        defaultValues: {
            day: 'Sunday',
            index: 1,
            startTime: '',
            endTime: '',
            teacher: '',
            subject: '',
            subjectCode: '',
            roomNo: '',
        }
    });

    const watchedTeacher = form.watch('teacher');

    // ─── Fetch initial data ────────────────────────────────────────
    useEffect(() => {
        const init = async () => {
            try {
                const [facRes, teaRes] = await Promise.all([
                    GetRequest("/faculty"),
                    GetRequest("/teachers")
                ]);
                setFaculties((facRes.data?.data || facRes.data || []).filter((f: Faculty) => f.isActive));
                setTeachers((teaRes.data?.data || teaRes.data || []).filter((t: Teacher) => t.isActive));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(l => ({ ...l, fac: false, tea: false }));
            }
        };
        init();
    }, []);

    useEffect(() => {
        if (!selectedFaculty?.id) return;
        GetRequest(`/batch/faculties/${selectedFaculty.id}`)
            .then((r:any) => setBatches(r.data?.data || r.data || []))
            .catch(() => {});
    }, [selectedFaculty]);

    useEffect(() => {
        if (!selectedBatch?.id) return;
        GetRequest(`/semester/batches/${selectedBatch.id}`)
            .then((r:any) => setSemesters(r.data?.data || r.data || []))
            .catch(() => {});
    }, [selectedBatch]);

    useEffect(() => {
        if (!selectedSemester?.id) return;
        GetRequest(`/class-sections/semester/${selectedSemester.id}`)
            .then((r:any) => setSections(r.data?.data || r.data || []))
            .catch(() => {});
    }, [selectedSemester]);

    // Fetch routines when section is selected
    useEffect(() => {
        if (!selectedSection?.id) {
            setRoutines([]);
            return;
        }
        (async () => {
            try {
                const res = await GetRequest(`/class-routine?sectionId=${selectedSection.id}`);
                const raw = res.data?.data?.data || res.data?.data || res.data || [];
                setRoutines(raw);
            } catch (err) {
                console.error("Failed to load routines", err);
                setRoutines([]);
            }
        })();
    }, [selectedSection]);

    // Teacher subjects when teacher selected
    useEffect(() => {
        if (!watchedTeacher) {
            setTeacherSubjects([]);
            form.setValue('subject', '');
            form.setValue('subjectCode', '');
            return;
        }
        (async () => {
            try {
                const res = await GetRequest(`/teachers/${watchedTeacher}`);
                const subs = res.data?.data?.subject || res.data?.subject || [];
                setTeacherSubjects(subs);
                form.setValue('subject', '');
                form.setValue('subjectCode', '');
            } catch {}
        })();
    }, [watchedTeacher]);

    useEffect(() => {
        if (!form.watch('subject') || !teacherSubjects.length) {
            form.setValue('subjectCode', '');
            return;
        }
        const sub = teacherSubjects.find(s => s.name === form.watch('subject'));
        form.setValue('subjectCode', sub?.code || '');
    }, [form.watch('subject'), teacherSubjects]);

    // ─── Modal Handlers ────────────────────────────────────────────
    const openAddModal = () => {
        form.reset();
        setEditingRoutine(null);
        setModalOpen(true);
    };

    const openEditModal = (routine: Routine) => {
        form.reset({
            day: routine.day,
            index: routine.index,
            startTime: routine.startTime,
            endTime: routine.endTime,
            teacher: routine.teacher.id,
            subject: routine.subject.name,
            subjectCode: routine.subject.code,
            roomNo: routine.roomNo || '',
        });
        setEditingRoutine(routine);
        setModalOpen(true);
    };

    const onSubmit = async (values: FormData) => {
        try {
            if (editingRoutine?.id) {
                // PATCH
                const payload = {
                    day: values.day,
                    index: values.index,
                    startTime: values.startTime,
                    endTime: values.endTime,
                    roomNo: values.roomNo?.trim() || undefined,
                    teacher: values.teacher,
                    subject: values.subject,
                };
                await PatchRequest(`/class-routine/${editingRoutine.id}`, payload);
            } else {
                // POST
                const payload = {
                    classSectionId: selectedSection?.id,
                    teacher: values.teacher,
                    subject: values.subject,
                    classes: [{
                        day: values.day,
                        index: values.index,
                        startTime: values.startTime,
                        endTime: values.endTime,
                        roomNo: values.roomNo?.trim() || undefined,
                    }],
                };
                await PostRequest("/class-routine", payload);
            }

            // Refresh routines
            if (selectedSection?.id) {
                const res = await GetRequest(`/class-routine?sectionId=${selectedSection.id}`);
                const raw = res.data?.data?.data || res.data?.data || res.data || [];
                setRoutines(raw);
            }

            setModalOpen(false);
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to save routine");
        }
    };

    // ─── Breadcrumbs ───────────────────────────────────────────────
    const breadcrumbItems = [
        <Anchor key="faculties" onClick={() => { setSelectedFaculty(null); setSelectedBatch(null); setSelectedSemester(null); setSelectedSection(null); }}>Faculties</Anchor>,
        selectedFaculty && <Anchor key="faculty" onClick={() => { setSelectedBatch(null); setSelectedSemester(null); setSelectedSection(null); }}>{selectedFaculty.name}</Anchor>,
        selectedBatch && <Anchor key="batch" onClick={() => { setSelectedSemester(null); setSelectedSection(null); }}>{selectedBatch.name} ({selectedBatch.year})</Anchor>,
        selectedSemester && <Anchor key="semester" onClick={() => setSelectedSection(null)}>{selectedSemester.name}</Anchor>,
        selectedSection && <Text key="section">{selectedSection.name}</Text>,
    ].filter(Boolean) as React.ReactNode[];

    // ─── Render Content ────────────────────────────────────────────
    let content: React.ReactNode = null;

    if (!selectedFaculty) {
        content = (
            <Grid>
                {faculties.map(f => (
                    <Grid.Col key={f.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ cursor: 'pointer' }} onClick={() => setSelectedFaculty(f)}>
                            <Stack align="center" gap="xs">
                                <Text fw={600} size="lg">{f.name}</Text>
                                <Badge color="indigo">Faculty</Badge>
                            </Stack>
                            <Group mt="md" justify="center">
                                <Text c="dimmed">View Batches →</Text>
                                <IconChevronRight size={16} />
                            </Group>
                        </Card>
                    </Grid.Col>
                ))}
                {faculties.length === 0 && <Text c="dimmed" ta="center">No faculties found</Text>}
            </Grid>
        );
    } else if (!selectedBatch) {
        content = (
            <>
                <Button variant="subtle" leftSection={<IconArrowLeft />} onClick={() => setSelectedFaculty(null)} mb="md">
                    Back to Faculties
                </Button>
                <Grid>
                    {batches.map(b => (
                        <Grid.Col key={b.id} span={{ base: 12, sm: 6, md: 4 }}>
                            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ cursor: 'pointer' }} onClick={() => setSelectedBatch(b)}>
                                <Text fw={600}>{b.name}</Text>
                                <Text size="sm" c="dimmed">Year: {b.year}</Text>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            </>
        );
    } else if (!selectedSemester) {
        content = (
            <>
                <Button variant="subtle" leftSection={<IconArrowLeft />} onClick={() => setSelectedBatch(null)} mb="md">
                    Back to Batches
                </Button>
                <Grid>
                    {semesters.map(s => (
                        <Grid.Col key={s.id} span={{ base: 12, sm: 6, md: 4 }}>
                            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ cursor: 'pointer' }} onClick={() => setSelectedSemester(s)}>
                                <Text fw={600}>{s.name}</Text>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            </>
        );
    } else if (!selectedSection) {
        content = (
            <>
                <Button variant="subtle" leftSection={<IconArrowLeft />} onClick={() => setSelectedSemester(null)} mb="md">
                    Back to Semesters
                </Button>
                <Grid>
                    {sections.map(sec => (
                        <Grid.Col key={sec.id} span={{ base: 12, sm: 6, md: 4 }}>
                            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ cursor: 'pointer' }} onClick={() => setSelectedSection(sec)}>
                                <Text fw={600} size="lg">{sec.name}</Text>
                                <Text c="dimmed" mt="xs">Click to view timetable</Text>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            </>
        );
    } else {
        // ─── Timetable sorted by index (period) ───────────────────────
        const uniqueIndices = [...new Set(routines.map(r => r.index))].sort((a, b) => a - b);

        const indexToTimeLabel = new Map<number, string>();
        routines.forEach(r => {
            if (!indexToTimeLabel.has(r.index)) {
                indexToTimeLabel.set(r.index, `${r.startTime} – ${r.endTime}`);
            }
        });

        const presentDays = [...new Set(routines.map(r => r.day))]
            .sort((a, b) => WEEK_DAYS_ORDER.indexOf(a) - WEEK_DAYS_ORDER.indexOf(b));

        const routinesByDay: Record<string, Routine[]> = {};
        presentDays.forEach(d => {
            routinesByDay[d] = routines.filter(r => r.day === d);
        });

        content = (
            <>
                <Group mb="xl" justify="apart" align="center">
                    <Group>
                        <Button variant="subtle" leftSection={<IconArrowLeft size={18} />} onClick={() => setSelectedSection(null)}>
                            Back to Sections
                        </Button>
                        <div>
                            <Title order={2}>{selectedSection?.name} Timetable</Title>
                            <Text c="dimmed" size="sm">
                                {selectedSemester?.name?.trim() || '—'} • {selectedBatch?.name || '—'} ({selectedBatch?.year || '—'})
                            </Text>
                        </div>
                    </Group>

                    <Button leftSection={<IconPlus size={18} />} color="teal" onClick={openAddModal}>
                        Add Slot
                    </Button>
                </Group>

                {routines.length === 0 ? (
                    <Paper p="xl" withBorder radius="md" ta="center" c="dimmed">
                        No classes scheduled yet for this section.
                    </Paper>
                ) : (
                    <Paper withBorder radius="md" shadow="xs" p="md" style={{ overflowX: 'auto' }}>
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
                                            style={{ minWidth: 160, background: '#f8f9fa' }}
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
                                {presentDays.map(day => (
                                    <Table.Tr key={day}>
                                        <Table.Td fw={700} ta="center" c="indigo.7" style={{ background: '#eef2ff' }}>
                                            {day}
                                        </Table.Td>

                                        {uniqueIndices.map(idx => {
                                            const entry = routinesByDay[day]?.find(r => r.index === idx);
                                            return (
                                                <Table.Td
                                                    key={idx}
                                                    ta="center"
                                                    style={{ cursor: entry ? 'pointer' : 'default', padding: '8px' }}
                                                    onClick={() => entry && openEditModal(entry)}
                                                >
                                                    {entry ? (
                                                        <Stack gap={4} align="center">
                                                            <Text fw={600} size="sm" lh={1.2}>
                                                                {entry.subject.name}
                                                            </Text>
                                                            <Text size="xs" c="gray.7" fw={500}>
                                                                {entry.teacher.name}
                                                            </Text>
                                                            {entry.roomNo && (
                                                                <Badge size="xs" color="violet" variant="light" radius="sm">
                                                                    {entry.roomNo}
                                                                </Badge>
                                                            )}
                                                        </Stack>
                                                    ) : (
                                                        <Text size="xs" c="gray.5" fs="italic">—</Text>
                                                    )}
                                                </Table.Td>
                                            );
                                        })}
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Paper>
                )}
            </>
        );
    }

    return (
        <MantineProvider theme={theme} defaultColorScheme="light">
            <div className="p-6 max-w-[1400px] mx-auto">
                <Group justify="apart" mb="xl">
                    <Title order={1}>Class Routine Management</Title>
                </Group>

                {breadcrumbItems.length > 0 && (
                    <Paper p="xs" withBorder mb="lg">
                        <Breadcrumbs separator="→">{breadcrumbItems}</Breadcrumbs>
                    </Paper>
                )}

                {loading.fac ? <Loader /> : content}

                {/* ─── Modal ────────────────────────────────────────────────── */}
                <Modal
                    opened={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={editingRoutine ? "Edit Entry" : "Add New Entry"}
                    size="lg"
                    centered
                >
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Stack gap="md">
                            <Controller
                                name="day"
                                control={form.control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select label="Day" data={WEEK_DAYS_ORDER} {...field} />
                                )}
                            />

                            <Group grow>
                                <Controller name="startTime" control={form.control} rules={{ required: true }} render={({ field }) => (
                                    <TextInput label="Start Time" placeholder="11 or 03:30" {...field} />
                                )} />
                                <Controller name="endTime" control={form.control} rules={{ required: true }} render={({ field }) => (
                                    <TextInput label="End Time" placeholder="12 or 04:30" {...field} />
                                )} />
                            </Group>

                            <Controller name="index" control={form.control} rules={{ required: true }} render={({ field }) => (
                                <NumberInput label="Period Index" min={1} {...field} />
                            )} />

                            <Controller
                                name="teacher"
                                control={form.control}
                                rules={{ required: "Required" }}
                                render={({ field }) => (
                                    <Select
                                        label="Teacher"
                                        data={teachers.map(t => ({ value: t.id, label: t.name }))}
                                        searchable
                                        {...field}
                                    />
                                )}
                            />

                            <Controller
                                name="subject"
                                control={form.control}
                                rules={{ required: "Required" }}
                                render={({ field }) => (
                                    <Select
                                        label="Subject"
                                        data={teacherSubjects.map(s => ({ value: s.id, label: `${s.name} (${s.code})` }))}
                                        disabled={!watchedTeacher}
                                        searchable
                                        {...field}
                                    />
                                )}
                            />

                            <TextInput label="Subject Code" value={form.watch('subjectCode')} disabled readOnly />

                            <TextInput label="Room No" {...form.register('roomNo')} />

                            <Group justify="flex-end" mt="md">
                                <Button variant="light" onClick={() => setModalOpen(false)}>Cancel</Button>
                                <Button type="submit" color="teal">
                                    {editingRoutine ? 'Update' : 'Create'}
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Modal>
            </div>
        </MantineProvider>
    );
}

ClassRoutinePage.getLayout = (page: any) => <AdminDashboardLayout>{page}</AdminDashboardLayout>;