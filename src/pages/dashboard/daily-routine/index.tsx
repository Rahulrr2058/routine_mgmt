// src/pages/DailyClassPage.tsx
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
    ActionIcon,
    Text,
    Table,
    Loader,
    Switch,
    Alert,
} from '@mantine/core';
import { IconCheck, IconX, IconCalendarEvent } from '@tabler/icons-react';
import { AdminDashboardLayout } from "@/layouts/AdminDashboardLayout";
import {GetRequest, PatchRequest, PostRequest} from "@/plugins/https";
import { format } from 'date-fns';

const theme = createTheme({ primaryColor: 'indigo' });

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
        subject: string;
        teacher: string;
        roomNo?: string;
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
            const res = await PostRequest("/daily-class/generate-daily-class",{});
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

    return (
        <MantineProvider theme={theme} defaultColorScheme="light">
            <div className="p-8 max-w-7xl mx-auto">
                <Group justify="space-between" mb="xl">
                    <Stack gap={4}>
                        <Title order={1}>Today's Classes</Title>
                        <Group gap="xs" align="center">
                            <IconCalendarEvent size={20} />
                            <Text size="lg" c="dimmed">{todayFormatted}</Text>
                        </Group>
                    </Stack>
                    <Button variant="outline" color="teal" onClick={()=> handleGenerateClass()}>
                        Show Daily Routine
                    </Button>

                    <Button
                        onClick={fetchTodaysClasses}
                        loading={loading}
                        variant="light"
                    >
                        Refresh
                    </Button>
                </Group>

                {error && (
                    <Alert color="red" mb="lg">
                        {error}
                    </Alert>
                )}

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
                ) : (
                    <Table withTableBorder withColumnBorders verticalSpacing="md">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Time</Table.Th>
                                <Table.Th>Period</Table.Th>
                                <Table.Th>Subject</Table.Th>
                                <Table.Th>Teacher</Table.Th>
                                <Table.Th>Room</Table.Th>
                                <Table.Th>Class</Table.Th>
                                <Table.Th ta="center">Attendance</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {dailyClasses.map((dc) => {
                                const routine = dc.classRoutine;
                                const section = routine.classSection;
                                const semester = section?.semester;
                                const batch = semester?.batch;
                                const faculty = batch?.faculty;

                                return (
                                    <Table.Tr key={dc.id}>
                                        <Table.Td fw={600}>
                                            {routine.startTime} - {routine.endTime}
                                        </Table.Td>
                                        <Table.Td>{routine.index}</Table.Td>
                                        <Table.Td fw={600} c="blue">
                                            {routine.subject}
                                        </Table.Td>
                                        <Table.Td>{routine.teacher}</Table.Td>
                                        <Table.Td>{routine.roomNo || '-'}</Table.Td>
                                        <Table.Td>
                                            <Stack gap={4}>
                                                <Badge size="sm" color="violet" variant="light">
                                                    {faculty?.name}
                                                </Badge>
                                                <Badge size="sm" color="blue" variant="light">
                                                    {batch?.name.replace("'", "")} ({batch?.year})
                                                </Badge>
                                                <Badge size="sm" color="teal" variant="light">
                                                    {semester?.name}
                                                </Badge>
                                                <Badge size="sm" color="orange">
                                                    {section?.name}
                                                </Badge>
                                            </Stack>
                                        </Table.Td>
                                        <Table.Td ta="center">
                                            <Switch
                                                checked={dc.hasAttended}
                                                onChange={() => toggleAttendance(dc)}
                                                disabled={updatingId === dc.id}
                                                color="teal"
                                                size="md"
                                                thumbIcon={
                                                    dc.hasAttended ? (
                                                        <IconCheck size={12} />
                                                    ) : (
                                                        <IconX size={12} />
                                                    )
                                                }
                                            />
                                        </Table.Td>
                                    </Table.Tr>
                                );
                            })}
                        </Table.Tbody>
                    </Table>
                )}
            </div>
        </MantineProvider>
    );
}

DailyClassPage.getLayout = (page: any) => (
    <AdminDashboardLayout>{page}</AdminDashboardLayout>
);