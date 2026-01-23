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
    Loader,
    TextInput,
} from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { IconPlus, IconEdit } from '@tabler/icons-react';
import { AdminDashboardLayout } from "@/layouts/AdminDashboardLayout";
import { GetRequest, PostRequest, PatchRequest } from "@/plugins/https";

const theme = createTheme({ primaryColor: 'indigo' });

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface Faculty {
    id: string;
    name: string;
    isActive: boolean;
}

interface Batch {
    id: string;
    name: string;
    year: string;
    isActive: boolean;
    faculty: Faculty;
}

interface Semester {
    id: string;
    name: string;
    isActive: boolean;
    isCurrent?: boolean;
    batch: Batch;
}

interface Section {
    id: string;
    name: string;
    semester: Semester;
}

interface ClassEntry {
    day: string;
    index: number;
    startTime: string;
    endTime: string;
    subject: string;
    teacher: string;
    roomNo?: string;
}

type FormData = {
    facultyId: string;
    batchId: string;
    semesterId: string;
    sectionId: string;
    class: ClassEntry;
};

export default function ClassRoutinePage() {
    const [routines, setRoutines] = useState<any[]>([]);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [sections, setSections] = useState<Section[]>([]);

    const [loadingFaculties, setLoadingFaculties] = useState(true);
    const [loadingBatches, setLoadingBatches] = useState(false);
    const [loadingSemesters, setLoadingSemesters] = useState(false);
    const [loadingSections, setLoadingSections] = useState(false);

    const [modalOpened, setModalOpened] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const { control, handleSubmit, reset, watch, setValue } = useForm<FormData>({
        defaultValues: {
            facultyId: '',
            batchId: '',
            semesterId: '',
            sectionId: '',
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

    const watchedFaculty = watch('facultyId');
    const watchedBatch = watch('batchId');
    const watchedSemester = watch('semesterId');

    const fetchFaculties = async () => {
        try {
            setLoadingFaculties(true);
            const res = await GetRequest("/faculty");
            const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
            setFaculties(data.filter((f: Faculty) => f.isActive));
        } catch (error) {
            console.error("Failed to fetch faculties", error);
            setFaculties([]);
        } finally {
            setLoadingFaculties(false);
        }
    };

    const fetchBatches = async (facultyId: string) => {
        if (!facultyId) {
            setBatches([]);
            return;
        }
        try {
            setLoadingBatches(true);
            const res = await GetRequest(`/batch/faculties/${facultyId}`);
            const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
            setBatches(data);
        } catch (error) {
            console.error("Failed to fetch batches", error);
            setBatches([]);
        } finally {
            setLoadingBatches(false);
        }
    };

    const fetchSemesters = async (batchId: string) => {
        if (!batchId) {
            setSemesters([]);
            return;
        }
        try {
            setLoadingSemesters(true);
            const res = await GetRequest(`/semester/batches/${batchId}`);
            const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
            setSemesters(data);
        } catch (error) {
            console.error("Failed to fetch semesters", error);
            setSemesters([]);
        } finally {
            setLoadingSemesters(false);
        }
    };

    const fetchSections = async (semesterId: string) => {
        if (!semesterId) {
            setSections([]);
            return;
        }
        try {
            setLoadingSections(true);
            const res = await GetRequest(`/class-sections/semester/${semesterId}`);
            const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
            setSections(data);
        } catch (error) {
            console.error("Failed to fetch sections", error);
            setSections([]);
        } finally {
            setLoadingSections(false);
        }
    };

    const fetchRoutines = async () => {
        try {
            const res = await GetRequest("/class-routine");
            // Handle nested { data: { data: [...] } } structure
            const rawData = res.data?.data || res.data || [];
            const data = Array.isArray(rawData) ? rawData : rawData.data || [];
            setRoutines(data);
        } catch (error) {
            console.error("Failed to fetch routines", error);
            setRoutines([]);
        }
    };

    useEffect(() => {
        fetchFaculties();
        fetchRoutines();
    }, []);

    useEffect(() => {
        fetchBatches(watchedFaculty);
        setValue('batchId', '');
        setValue('semesterId', '');
        setValue('sectionId', '');
    }, [watchedFaculty]);

    useEffect(() => {
        fetchSemesters(watchedBatch);
        setValue('semesterId', '');
        setValue('sectionId', '');
    }, [watchedBatch]);

    useEffect(() => {
        fetchSections(watchedSemester);
        setValue('sectionId', '');
    }, [watchedSemester]);

    const openCreateModal = () => {
        reset({
            facultyId: '',
            batchId: '',
            semesterId: '',
            sectionId: '',
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

            const classSection = data.classSection || {};
            const semester = classSection.semester || {};
            const batch = semester.batch || {};
            const faculty = batch.faculty || {};

            reset({
                facultyId: faculty.id || '',
                batchId: batch.id || '',
                semesterId: semester.id || '',
                sectionId: classSection.id || '',
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

            // Pre-load cascading options
            if (faculty.id) await fetchBatches(faculty.id);
            if (batch.id) await fetchSemesters(batch.id);
            if (semester.id) await fetchSections(semester.id);

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
                classSectionId: formData.sectionId,
                ...classPayload,
            };

            if (isEditMode && editingId) {
                await PatchRequest(`/class-routine/${editingId}`, payload);
            } else {
                await PostRequest("/class-routine", {
                    classSectionId: formData.sectionId,
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

    const facultyOptions = faculties.map((f) => ({ value: f.id, label: f.name }));
    const batchOptions = batches.map((b) => ({ value: b.id, label: `${b.name} (${b.year})` }));
    const semesterOptions = semesters.map((s) => ({ value: s.id, label: s.name }));
    const sectionOptions = sections.map((s) => ({ value: s.id, label: s.name }));

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
                                <Table.Th>Period</Table.Th>
                                <Table.Th>Time</Table.Th>
                                <Table.Th>Subject</Table.Th>
                                <Table.Th>Teacher</Table.Th>
                                <Table.Th>Room</Table.Th>
                                <Table.Th>Class Details</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {routines.map((r) => {
                                const section = r.classSection || {};
                                const semester = section.semester || {};
                                const batch = semester.batch || {};
                                const faculty = batch.faculty || {};

                                return (
                                    <Table.Tr key={r.id}>
                                        <Table.Td>{r.day}</Table.Td>
                                        <Table.Td>{r.index}</Table.Td>
                                        <Table.Td>{r.startTime} - {r.endTime}</Table.Td>
                                        <Table.Td fw={600}>{r.subject}</Table.Td>
                                        <Table.Td>{r.teacher}</Table.Td>
                                        <Table.Td>{r.roomNo || '-'}</Table.Td>
                                        <Table.Td>
                                            <Stack gap={4}>
                                                <Badge size="sm" color="violet" variant="light">
                                                    {faculty.name || 'N/A'}
                                                </Badge>
                                                <Badge size="sm" color="blue" variant="light">
                                                    {batch.name?.replace("'", "")} ({batch.year})
                                                </Badge>
                                                <Badge size="sm" color="teal" variant="light">
                                                    {semester.name}
                                                </Badge>
                                                <Badge size="sm" color="orange">
                                                    {section.name}
                                                </Badge>
                                            </Stack>
                                        </Table.Td>
                                        <Table.Td>
                                            <ActionIcon color="blue" variant="subtle" onClick={() => openEditModal(r)}>
                                                <IconEdit size={18} />
                                            </ActionIcon>
                                        </Table.Td>
                                    </Table.Tr>
                                );
                            })}
                        </Table.Tbody>
                    </Table>
                )}

                {/* Modal remains the same */}
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
                                name="facultyId"
                                control={control}
                                rules={{ required: "Please select a faculty" }}
                                render={({ field, fieldState }) => (
                                    <Select
                                        label="Faculty"
                                        placeholder="Select faculty"
                                        data={facultyOptions}
                                        searchable
                                        disabled={loadingFaculties}
                                        rightSection={loadingFaculties ? <Loader size="xs" /> : null}
                                        error={fieldState.error?.message}
                                        {...field}
                                    />
                                )}
                            />

                            <Controller
                                name="batchId"
                                control={control}
                                rules={{ required: "Please select a batch" }}
                                render={({ field, fieldState }) => (
                                    <Select
                                        label="Batch"
                                        placeholder="Select batch"
                                        data={batchOptions}
                                        searchable
                                        disabled={!watchedFaculty || loadingBatches}
                                        rightSection={loadingBatches ? <Loader size="xs" /> : null}
                                        error={fieldState.error?.message}
                                        {...field}
                                    />
                                )}
                            />

                            <Controller
                                name="semesterId"
                                control={control}
                                rules={{ required: "Please select a semester" }}
                                render={({ field, fieldState }) => (
                                    <Select
                                        label="Semester"
                                        placeholder="Select semester"
                                        data={semesterOptions}
                                        disabled={!watchedBatch || loadingSemesters}
                                        rightSection={loadingSemesters ? <Loader size="xs" /> : null}
                                        error={fieldState.error?.message}
                                        {...field}
                                    />
                                )}
                            />

                            <Controller
                                name="sectionId"
                                control={control}
                                rules={{ required: "Please select a section" }}
                                render={({ field, fieldState }) => (
                                    <Select
                                        label="Section"
                                        placeholder="Select section"
                                        data={sectionOptions}
                                        disabled={!watchedSemester || loadingSections}
                                        rightSection={loadingSections ? <Loader size="xs" /> : null}
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