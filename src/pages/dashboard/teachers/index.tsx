// src/pages/TeachersPage.tsx
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
    ActionIcon,
} from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { IconPlus, IconUser, IconToggleLeft, IconToggleRight, IconEdit } from '@tabler/icons-react';
import { AdminDashboardLayout } from "@/layouts/AdminDashboardLayout";
import { GetRequest, PostRequest, PatchRequest } from "@/plugins/https"; // ← add PatchRequest

const theme = createTheme({
    primaryColor: 'indigo',
});

interface Teacher {
    id: string;
    name: string;
    isActive: boolean;
}

type TeacherFormData = {
    name: string;
    isActive: boolean;
};

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [modalOpened, setModalOpened] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, reset, setValue, formState: { errors } } =
        useForm<TeacherFormData>({
            defaultValues: {
                name: '',
                isActive: true,
            },
        });

    const getTeachers = async () => {
        try {
            const res = await GetRequest("/teachers");
            setTeachers(res.data || []);
        } catch (e) {
            console.error("Failed to load teachers:", e);
        }
    };

    useEffect(() => {
        getTeachers();
    }, []);

    // Open modal for ADD
    const openAddModal = () => {
        setIsEditMode(false);
        setSelectedTeacher(null);
        reset({ name: '', isActive: true });
        setModalOpened(true);
    };

    // Open modal for EDIT
    const openEditModal = (teacher: Teacher) => {
        setIsEditMode(true);
        setSelectedTeacher(teacher);
        setValue("name", teacher.name);
        setValue("isActive", teacher.isActive);
        setModalOpened(true);
    };

    const onSubmit = async (data: TeacherFormData) => {
        setLoading(true);
        try {
            if (isEditMode && selectedTeacher) {
                // EDIT → PATCH
                await PatchRequest(`/teachers/${selectedTeacher.id}`, data);
            } else {
                // ADD → POST
                await PostRequest("/teachers", data);
            }

            setModalOpened(false);
            reset();
            await getTeachers();
        } catch (e) {
            console.error(`Failed to ${isEditMode ? 'update' : 'create'} teacher:`, e);
        } finally {
            setLoading(false);
        }
    };

    const rows = teachers.map((teacher) => (
        <Table.Tr key={teacher.id}>
            <Table.Td>
                <Group gap="sm">
                    <IconUser size={18} />
                    {teacher.name}
                </Group>
            </Table.Td>
            <Table.Td>
                <Badge
                    color={teacher.isActive ? 'green' : 'red'}
                    variant="light"
                    leftSection={teacher.isActive ? <IconToggleRight size={14} /> : <IconToggleLeft size={14} />}
                >
                    {teacher.isActive ? 'Active' : 'Inactive'}
                </Badge>
            </Table.Td>
            <Table.Td>
                <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={() => openEditModal(teacher)}
                    aria-label="Edit teacher"
                >
                    <IconEdit size={18} />
                </ActionIcon>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <MantineProvider theme={theme} defaultColorScheme="light">
            <div className="p-8 max-w-5xl mx-auto">
                <Group justify="space-between" mb="xl">
                    <Title order={1}>Teachers</Title>
                    <Button
                        leftSection={<IconPlus size={18} />}
                        onClick={openAddModal}
                        color="cyan"
                    >
                        Add New Teacher
                    </Button>
                </Group>

                <Paper shadow="sm" radius="md" withBorder p="md">
                    <Table highlightOnHover verticalSpacing="md">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Teacher Name</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th style={{ width: 80 }}>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {teachers.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={3} ta="center" c="dimmed">
                                        No teachers found
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
                    title={<Title order={3}>{isEditMode ? 'Edit Teacher' : 'Add New Teacher'}</Title>}
                    centered
                    size="md"
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack gap="md">
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: "Teacher name is required" }}
                                render={({ field }) => (
                                    <TextInput
                                        label="Full Name"
                                        placeholder="e.g., Ram Prasad Sharma"
                                        leftSection={<IconUser size={16} />}
                                        error={errors.name?.message}
                                        {...field}
                                    />
                                )}
                            />

                            <Controller
                                name="isActive"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        label="Account is active"
                                        description="Active teachers can be assigned subjects and appear in reports"
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
                                    {isEditMode ? 'Save Changes' : 'Add Teacher'}
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Modal>
            </div>
        </MantineProvider>
    );
}

TeachersPage.getLayout = (page: any) => (
    <AdminDashboardLayout>{page}</AdminDashboardLayout>
);