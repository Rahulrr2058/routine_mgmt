// src/pages/ClassRoutinePage.tsx
import React, { useEffect, useState } from 'react';
import {
    MantineProvider,
    createTheme,
    Title,
    Button,
    Modal,
    Select,
    Group,
    Stack,
    Paper,
    Badge,
    ActionIcon,
    Text,
    Grid,
    Table,
    Loader, TextInput,
} from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { IconPlus, IconEdit } from '@tabler/icons-react';
import { AdminDashboardLayout } from "@/layouts/AdminDashboardLayout";
import { GetRequest, PostRequest, PatchRequest } from "@/plugins/https";

const theme = createTheme({ primaryColor: 'indigo' });

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface ClassEntry {
    day: string;
    index: number;
    startTime: string;
    endTime: string;
    subject: string;
    teacher: string;
    roomNo?: string;
}

interface Semester {
    id: string;
    name: string;
    isActive: boolean;
    batch?: {
        id: string;
        name: string;
        year: string | number;
    };
}

type FormData = {
    semesterId: string;
    class: ClassEntry;
};

export default function ClassRoutinePage() {
    const [routines, setRoutines] = useState<any[]>([]);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [loadingSemesters, setLoadingSemesters] = useState(true);
    const [modalOpened, setModalOpened] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const { control, handleSubmit, reset } = useForm<FormData>({
        defaultValues: {
            semesterId: '',
            class: {
                day: 'Monday',
                index: 1,
                startTime: '09:00',
                endTime: '10:30',
                subject: '',
                teacher: '',
                roomNo: '',
            },
        },
    });

    const fetchRoutines = async () => {
        try {
            const res = await GetRequest("/class-routine");
            const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
            setRoutines(data);
        } catch (error) {
            console.error("Failed to fetch routines", error);
            setRoutines([]);
        }
    };

    const fetchSemesters = async () => {
        try {
            setLoadingSemesters(true);
            const res = await GetRequest("/semester");
            const data = Array.isArray(res.data) ? res.data : res.data?.data || [];

            // Optional: filter only active semesters
            const activeSemesters = data.filter((s: Semester) => s.isActive);
            setSemesters(activeSemesters.length > 0 ? activeSemesters : data);
        } catch (error) {
            console.error("Failed to fetch semesters", error);
            setSemesters([]);
        } finally {
            setLoadingSemesters(false);
        }
    };

    useEffect(() => {
        fetchRoutines();
        fetchSemesters();
    }, []);

    const openCreateModal = () => {
        reset({
            semesterId: '',
            class: {
                day: 'Monday',
                index: 1,
                startTime: '09:00',
                endTime: '10:30',
                subject: '',
                teacher: '',
                roomNo: '',
            },
        });
        setIsEditMode(false);
        setEditingId(null);
        setModalOpened(true);
    };

    const openEditModal = async (routine: any) => {
        try {
            const res = await GetRequest(`/class-routine/${routine.id}`);
            const data = res.data?.data || res.data || routine;

            reset({
                semesterId: data.semesterId || data.semester?.id || '',
                class: {
                    day: data.day,
                    index: data.index || 1,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    subject: data.subject || '',
                    teacher: data.teacher || '',
                    roomNo: data.roomNo || '',
                },
            });

            setIsEditMode(true);
            setEditingId(data.id);
            setModalOpened(true);
        } catch (error) {
            console.error("Failed to load routine", error);
            alert("Could not load routine for editing");
        }
    };

    const onSubmit = async (formData: FormData) => {
        try {
            const classPayload = {
                day: formData.class.day,
                index: Number(formData.class.index),
                startTime: formData.class.startTime,
                endTime: formData.class.endTime,
                subject: formData.class.subject,
                teacher: formData.class.teacher,
                roomNo: formData.class.roomNo?.trim() || undefined,
            };

            const payload = {
                semesterId: formData.semesterId,
                ...classPayload,
            };

            if (isEditMode && editingId) {
                await PatchRequest(`/class-routine/${editingId}`, payload);
            } else {
                await PostRequest("/class-routine", {
                    semesterId: formData.semesterId,
                    classes: [classPayload],
                });
            }

            await fetchRoutines();
            setModalOpened(false);
        } catch (error: any) {
            console.error("Save failed:", error);
            alert(error.response?.data?.message || "Failed to save routine");
        }
    };

    // Prepare semester options for Select
    const semesterOptions = semesters.map((sem) => ({
        value: sem.id,
        label: `${sem.name} `,
    }));

    return (
        <MantineProvider theme={theme} defaultColorScheme="light">
            <div className="p-8 max-w-7xl mx-auto">
                <Group justify="space-between" mb="xl">
                    <Title order={1}>Class Routines Management</Title>
                    <Button leftSection={<IconPlus size={18} />} onClick={openCreateModal} color="teal">
                        Add New Class
                    </Button>
                </Group>

                {routines.length === 0 ? (
                    <Paper p="xl" withBorder>
                        <Text c="dimmed" ta="center">No class routines added yet.</Text>
                    </Paper>
                ) : (
                    <Table withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Day</Table.Th>
                                <Table.Th>Time</Table.Th>
                                <Table.Th>Subject</Table.Th>
                                <Table.Th>Teacher</Table.Th>
                                <Table.Th>Room</Table.Th>
                                <Table.Th>Semester</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {routines.map((r) => (
                                <Table.Tr key={r.id}>
                                    <Table.Td>{r.day}</Table.Td>
                                    <Table.Td>{r.startTime} - {r.endTime}</Table.Td>
                                    <Table.Td fw={600}>{r.subject}</Table.Td>
                                    <Table.Td>{r.teacher}</Table.Td>
                                    <Table.Td>{r.roomNo || '-'}</Table.Td>
                                    <Table.Td>
                                        <Badge size="sm" color="indigo">
                                            {r.semester?.name || r.semesterId?.slice(0, 8) || 'N/A'}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <ActionIcon color="blue" variant="subtle" onClick={() => openEditModal(r)}>
                                            <IconEdit size={18} />
                                        </ActionIcon>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                )}

                <Modal
                    opened={modalOpened}
                    onClose={() => setModalOpened(false)}
                    title={<Title order={3}>{isEditMode ? 'Edit Class Routine' : 'Add New Class Routine'}</Title>}
                    size="lg"
                    centered
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack gap="md">
                            <Controller
                                name="semesterId"
                                control={control}
                                rules={{ required: "Please select a semester" }}
                                render={({ field, fieldState }) => (
                                    <Select
                                        label="Semester"
                                        placeholder="Select semester"
                                        data={semesterOptions}
                                        searchable
                                        nothingFoundMessage="No semesters found"
                                        disabled={loadingSemesters}
                                        rightSection={loadingSemesters ? <Loader size="xs" /> : null}
                                        required
                                        error={fieldState.error?.message}
                                        {...field}
                                    />
                                )}
                            />

                            <Grid gutter="md">
                                <Grid.Col span={6}>
                                    <Controller
                                        name="class.day"
                                        control={control}
                                        render={({ field }) => (
                                            <Select label="Day" data={WEEK_DAYS} required {...field} />
                                        )}
                                    />
                                </Grid.Col>

                                <Grid.Col span={3}>
                                    <Controller
                                        name="class.startTime"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextInput label="Start Time" placeholder="09:00" required {...field} />
                                        )}
                                    />
                                </Grid.Col>

                                <Grid.Col span={3}>
                                    <Controller
                                        name="class.endTime"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextInput label="End Time" placeholder="10:30" required {...field} />
                                        )}
                                    />
                                </Grid.Col>

                                <Grid.Col span={4}>
                                    <Controller
                                        name="class.subject"
                                        control={control}
                                        rules={{ required: "Subject is required" }}
                                        render={({ field, fieldState }) => (
                                            <TextInput
                                                label="Subject"
                                                placeholder="Mathematics"
                                                required
                                                error={fieldState.error?.message}
                                                {...field}
                                            />
                                        )}
                                    />
                                </Grid.Col>

                                <Grid.Col span={4}>
                                    <Controller
                                        name="class.teacher"
                                        control={control}
                                        rules={{ required: "Teacher is required" }}
                                        render={({ field, fieldState }) => (
                                            <TextInput
                                                label="Teacher"
                                                placeholder="Dr. Mahesh"
                                                required
                                                error={fieldState.error?.message}
                                                {...field}
                                            />
                                        )}
                                    />
                                </Grid.Col>

                                <Grid.Col span={2}>
                                    <Controller
                                        name="class.index"
                                        control={control}
                                        render={({ field }) => (
                                            <TextInput
                                                label="Period Index"
                                                type="number"
                                                min={1}
                                                placeholder="1"
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                            />
                                        )}
                                    />
                                </Grid.Col>

                                <Grid.Col span={2}>
                                    <Controller
                                        name="class.roomNo"
                                        control={control}
                                        render={({ field }) => (
                                            <TextInput label="Room No" placeholder="A102" {...field} />
                                        )}
                                    />
                                </Grid.Col>
                            </Grid>

                            <Group justify="flex-end" mt="lg">
                                <Button variant="light" color="gray" onClick={() => setModalOpened(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" color="teal">
                                    {isEditMode ? 'Update' : 'Create'} Class
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Modal>
            </div>
        </MantineProvider>
    );
}

ClassRoutinePage.getLayout = (page: any) => (
    <AdminDashboardLayout>{page}</AdminDashboardLayout>
);