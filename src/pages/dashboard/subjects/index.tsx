// src/pages/SubjectsPage.tsx
import React, { useEffect, useState } from 'react';
import {
    MantineProvider,
    createTheme,
    Title,
    Button,
    Table,
    Modal,
    TextInput,
    Switch,
    Group,
    Stack,
    Paper,
    Badge,
    Select,
    MultiSelect,
    ActionIcon,
} from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { IconPlus, IconBook, IconSchool, IconEdit, IconToggleLeft, IconToggleRight } from '@tabler/icons-react';
import { AdminDashboardLayout } from "@/layouts/AdminDashboardLayout";
import { GetRequest, PostRequest, PatchRequest } from "@/plugins/https";

const theme = createTheme({
    primaryColor: 'indigo',
});

interface Faculty {
    id: string;
    name: string;
    isActive: boolean;
}

interface Teacher {
    id: string;
    name: string;
    isActive: boolean;
}

interface Subject {
    id: string;
    name: string;
    code: string;
    isActive: boolean | null;
    faculty: Faculty;
    teacher: Teacher[];   // note: backend returns "teacher" (singular), but array
}

type SubjectFormData = {
    name: string;
    code: string;
    facultyId: string;
    teacherIds: string[];
    isActive: boolean;
};

export default function SubjectsPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [modalOpened, setModalOpened] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<SubjectFormData>({
        defaultValues: {
            name: '',
            code: '',
            facultyId: '',
            teacherIds: [],
            isActive: true,
        },
    });

    // Fetch all subjects
    const getSubjects = async () => {
        try {
            const res = await GetRequest("/subjects");
            setSubjects(res.data || []);
        } catch (e) {
            console.error("Failed to load subjects:", e);
        }
    };

    // Fetch faculties for dropdown
    const getFaculties = async () => {
        try {
            const res = await GetRequest("/faculty");
            setFaculties(res.data || []);
        } catch (e) {
            console.error("Failed to load faculties:", e);
        }
    };

    // Fetch teachers for multi-select
    const getTeachers = async () => {
        try {
            const res = await GetRequest("/teachers");
            setTeachers(res.data || []);
        } catch (e) {
            console.error("Failed to load teachers:", e);
        }
    };

    // Fetch single subject for edit (to be sure we have latest data)
    const getSubjectById = async (id: string) => {
        try {
            const res = await GetRequest(`/subjects/${id}`);
            const subj = res.data;

            setValue("name", subj.name);
            setValue("code", subj.code);
            setValue("facultyId", subj.faculty?.id || '');
            setValue("teacherIds", subj.teacher?.map((t: Teacher) => t.id) || []);
            setValue("isActive", subj.isActive ?? true);
        } catch (e) {
            console.error("Failed to load subject:", e);
        }
    };

    useEffect(() => {
        getSubjects();
        getFaculties();
        getTeachers();
    }, []);

    // Open modal for ADD
    const openAddModal = () => {
        setIsEditMode(false);
        setSelectedSubjectId(null);
        reset({
            name: '',
            code: '',
            facultyId: '',
            teacherIds: [],
            isActive: true,
        });
        setModalOpened(true);
    };

    // Open modal for EDIT
    const openEditModal = (id: string) => {
        setIsEditMode(true);
        setSelectedSubjectId(id);
        getSubjectById(id);           // fetch fresh data
        setModalOpened(true);
    };

    const onSubmit = async (data: SubjectFormData) => {
        setLoading(true);
        try {
            const payload = {
                name: data.name,
                code: data.code,
                facultyId: data.facultyId,
                teacherIds: data.teacherIds,
                isActive: data.isActive,
            };

            if (isEditMode && selectedSubjectId) {
                await PatchRequest(`/subjects/${selectedSubjectId}`, payload);
            } else {
                await PostRequest("/subjects", payload);
            }

            setModalOpened(false);
            reset();
            await getSubjects();
        } catch (e) {
            console.error(`Failed to ${isEditMode ? 'update' : 'create'} subject:`, e);
        } finally {
            setLoading(false);
        }
    };

    const rows = subjects.map((subject) => (
        <Table.Tr key={subject.id}>
            <Table.Td>
                <Group gap="sm">
                    <IconBook size={18} />
                    {subject.name}
                </Group>
            </Table.Td>
            <Table.Td>{subject.code}</Table.Td>
            <Table.Td>
                <Badge
                    color={subject.isActive ? 'green' : 'red'}
                    variant="light"
                    leftSection={subject.isActive ? <IconToggleRight size={14} /> : <IconToggleLeft size={14} />}
                >
                    {subject.isActive ? 'Active' : 'Inactive'}
                </Badge>
            </Table.Td>
            <Table.Td>{subject.faculty?.name || '—'}</Table.Td>
            <Table.Td>
                {subject.teacher?.length > 0
                    ? subject.teacher.map(t => t.name).join(', ')
                    : '—'}
            </Table.Td>
            <Table.Td>
                <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={() => openEditModal(subject.id)}
                >
                    <IconEdit size={18} />
                </ActionIcon>
            </Table.Td>
        </Table.Tr>
    ));

    const facultyOptions = faculties.map(f => ({ value: f.id, label: f.name }));
    const teacherOptions = teachers.map(t => ({ value: t.id, label: t.name }));

    return (
        <MantineProvider theme={theme} defaultColorScheme="light">
            <div className="p-8 max-w-7xl mx-auto">
                <Group justify="space-between" mb="xl">
                    <Title order={1}>Subjects</Title>
                    <Button
                        leftSection={<IconPlus size={18} />}
                        onClick={openAddModal}
                        color="cyan"
                    >
                        Add New Subject
                    </Button>
                </Group>

                <Paper shadow="sm" radius="md" withBorder p="md">
                    <Table highlightOnHover verticalSpacing="md">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Subject Name</Table.Th>
                                <Table.Th>Code</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Faculty</Table.Th>
                                <Table.Th>Teachers</Table.Th>
                                <Table.Th style={{ width: 80 }}>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {subjects.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={6} ta="center" c="dimmed">
                                        No subjects found
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                rows
                            )}
                        </Table.Tbody>
                    </Table>
                </Paper>

                {/* Add / Edit Modal */}
                <Modal
                    opened={modalOpened}
                    onClose={() => {
                        setModalOpened(false);
                        reset();
                    }}
                    title={<Title order={3}>{isEditMode ? 'Edit Subject' : 'Add New Subject'}</Title>}
                    centered
                    size="lg"
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack gap="md">
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: "Subject name is required" }}
                                render={({ field }) => (
                                    <TextInput
                                        label="Subject Name"
                                        placeholder="e.g., Mathematics"
                                        leftSection={<IconBook size={16} />}
                                        error={errors.name?.message}
                                        {...field}
                                    />
                                )}
                            />

                            <Controller
                                name="code"
                                control={control}
                                rules={{
                                    required: "Code is required",
                                    pattern: {
                                        value: /^[A-Z0-9-]+$/,
                                        message: "Only uppercase, numbers, hyphen allowed",
                                    },
                                }}
                                render={({ field }) => (
                                    <TextInput
                                        label="Subject Code"
                                        placeholder="e.g., MAT101"
                                        error={errors.code?.message}
                                        {...field}
                                    />
                                )}
                            />

                            <Controller
                                name="facultyId"
                                control={control}
                                rules={{ required: "Faculty is required" }}
                                render={({ field }) => (
                                    <Select
                                        label="Faculty"
                                        placeholder="Select faculty"
                                        leftSection={<IconSchool size={16} />}
                                        data={facultyOptions}
                                        searchable
                                        error={errors.facultyId?.message}
                                        {...field}
                                    />
                                )}
                            />

                            <Controller
                                name="teacherIds"
                                control={control}
                                render={({ field }) => (
                                    <MultiSelect
                                        label="Assigned Teachers"
                                        placeholder="Select one or more teachers"
                                        data={teacherOptions}
                                        searchable
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />

                            <Controller
                                name="isActive"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        label="Subject is active"
                                        checked={field.value}
                                        onChange={(event) => field.onChange(event.currentTarget.checked)}
                                        thumbIcon={
                                            field.value ? <IconToggleRight size={12} /> : <IconToggleLeft size={12} />
                                        }
                                    />
                                )}
                            />

                            <Group justify="flex-end" mt="lg">
                                <Button variant="light" color="gray" onClick={() => setModalOpened(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" color="cyan" loading={loading}>
                                    {isEditMode ? 'Save Changes' : 'Add Subject'}
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Modal>
            </div>
        </MantineProvider>
    );
}

SubjectsPage.getLayout = (page: any) => (
    <AdminDashboardLayout>{page}</AdminDashboardLayout>
);