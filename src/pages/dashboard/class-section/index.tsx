// src/pages/ClassSectionsPage.tsx
import React, { useEffect, useState } from 'react';
import {
    MantineProvider,
    createTheme,
    Title,
    Button,
    Table,
    Modal,
    TextInput,
    Group,
    Stack,
    Paper,
    Badge,
    Alert,
    ActionIcon,
    Select,
    Loader,
    NumberInput,
} from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import {
    IconPlus,
    IconSection,
    IconCopyPlus,
    IconInfoCircle,
    IconEdit,
    IconCalendarEvent,
} from '@tabler/icons-react';
import { AdminDashboardLayout } from "@/layouts/AdminDashboardLayout";
import { GetRequest, PostRequest, PatchRequest } from "@/plugins/https";

const theme = createTheme({
    primaryColor: 'indigo',
});

interface ClassSection {
    id: string;
    name: string;
    semester: {
        id: string;
        name: string;
        batch: {
            id: string;
            name: string;
            year: string | number;
        };
    } | null;
}

interface Semester {
    id: string;
    name: string;
    batch: {
        id: string;
        name: string;
        year: string | number;
    };
}

type SectionFormData = {
    name: string;
    semesterId: string;
};

type BulkSectionFormData = {
    semesterId: string;
    numberOfSections: number;
    prefix?: string; // e.g., "Section" → Section A, B, ...
};

export default function ClassSectionsPage() {
    const [sections, setSections] = useState<ClassSection[]>([]);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [loadingSemesters, setLoadingSemesters] = useState(true);
    const [singleOpened, setSingleOpened] = useState(false);
    const [bulkOpened, setBulkOpened] = useState(false);
    const [lastBulkCreated, setLastBulkCreated] = useState<{ semesterId: string; count: number } | null>(null);
    const [editingSection, setEditingSection] = useState<ClassSection | null>(null);

    const singleForm = useForm<SectionFormData>({
        defaultValues: {
            name: '',
            semesterId: '',
        },
    });

    const bulkForm = useForm<BulkSectionFormData>({
        defaultValues: {
            semesterId: '',
            numberOfSections: 3,
            prefix: 'Section',
        },
    });

    const fetchSections = async () => {
        try {
            const res = await GetRequest("/class-sections");
            setSections(res.data || []);
        } catch (e) {
            console.error("Failed to fetch class sections", e);
        }
    };

    const fetchSemesters = async () => {
        try {
            setLoadingSemesters(true);
            const res = await GetRequest("/semester");
            setSemesters(res.data || []);
        } catch (e) {
            console.error("Failed to fetch semesters", e);
        } finally {
            setLoadingSemesters(false);
        }
    };

    useEffect(() => {
        fetchSections();
        fetchSemesters();
    }, []);

    const openEditModal = async (section: ClassSection) => {
        try {
            const res = await GetRequest(`/class-sections/${section.id}`);
            const data = res.data;

            singleForm.reset({
                name: data.name,
                semesterId: data.semester?.id || '',
            });

            setEditingSection(section);
            setSingleOpened(true);
        } catch (e) {
            console.error("Failed to fetch section details", e);
        }
    };

    const openCreateModal = () => {
        singleForm.reset({
            name: '',
            semesterId: '',
        });
        setEditingSection(null);
        setSingleOpened(true);
    };

    const onSingleSubmit = async (data: SectionFormData) => {
        const payload = {
            name: data.name,
            semesterId: data.semesterId || null,
        };

        try {
            if (editingSection) {
                await PatchRequest(`/class-sections/${editingSection.id}`, payload);
            } else {
                await PostRequest("/class-sections", payload);
            }

            await fetchSections();
            setSingleOpened(false);
            singleForm.reset();
        } catch (e) {
            console.error("Failed to save class section", e);
        }
    };

    const onBulkSubmit = async (data: BulkSectionFormData) => {
        try {
            await PostRequest("/class-sections/bulk", {
                semesterId: data.semesterId,
                numberOfSections: data.numberOfSections,
                prefix: data.prefix || 'Section',
            });

            setLastBulkCreated({ semesterId: data.semesterId, count: data.numberOfSections });
            setBulkOpened(false);
            bulkForm.reset();
            await fetchSections();
        } catch (e) {
            console.error("Failed to bulk create sections", e);
        }
    };

    // Prepare Select options: "Semester Name - Batch Name (Year)"
    const semesterOptions = semesters.map((sem) => ({
        value: sem.id,
        label: `${sem.name} - ${sem.batch.name} (${sem.batch.year})`,
    }));

    const rows = sections.map((section:any) => (
        <Table.Tr key={section.id}>
            <Table.Td>
                <Group gap="sm">
                    <IconSection size={18} />
                    {section.name}
                </Group>
            </Table.Td>
            <Table.Td>
                {section.semester ? (
                    <Group gap="xs">
                        <IconCalendarEvent size={16} />
                        {section.semester.name}
                    </Group>
                ) : (
                    <Badge color="gray" variant="light">No Semester</Badge>
                )}
            </Table.Td>
            <Table.Td>
                {section.semester?.batch ? section.semester.batch.name : '-'}
            </Table.Td>
            <Table.Td>
                {section.semester?.batch ? section.semester.batch.year : '-'}
            </Table.Td>
            <Table.Td>
                {section.semester?.batch?.faculty ? section.semester.batch.faculty.name : '-'}

            </Table.Td>
            <Table.Td>
                <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={() => openEditModal(section)}
                    title="Edit section"
                >
                    <IconEdit size={18} />
                </ActionIcon>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <MantineProvider theme={theme} defaultColorScheme="light">
            <div className="p-8 max-w-6xl mx-auto">
                <Group justify="space-between" mb="xl">
                    <Title order={1}>Class Sections Management</Title>
                    <Group>
                        <Button
                            leftSection={<IconPlus size={18} />}
                            onClick={openCreateModal}
                            color="indigo"
                        >
                            Add Single Section
                        </Button>
                        <Button
                            leftSection={<IconCopyPlus size={18} />}
                            onClick={() => setBulkOpened(true)}
                            color="teal"
                        >
                            Bulk Create Sections
                        </Button>
                    </Group>
                </Group>

                {lastBulkCreated && (
                    <Alert icon={<IconInfoCircle size={16} />} title="Bulk Creation Success" color="teal" mb="xl">
                        Successfully created <strong>{lastBulkCreated.count}</strong> section(s) for semester:{' '}
                        <strong>
                            {semesters.find(s => s.id === lastBulkCreated.semesterId)?.name || 'Unknown'}
                        </strong>
                    </Alert>
                )}

                <Paper shadow="sm" radius="md" withBorder>
                    <Table highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Section Name</Table.Th>
                                <Table.Th>Semester</Table.Th>
                                <Table.Th>Batch</Table.Th>
                                <Table.Th>Year</Table.Th>
                                <Table.Th>Faculty</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {rows.length > 0 ? rows : (
                                <Table.Tr>
                                    <Table.Td colSpan={5} align="center" py="xl" c="dimmed">
                                        No class sections found. Create one to get started!
                                    </Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>
                </Paper>

                {/* Single Section Modal */}
                <Modal
                    opened={singleOpened}
                    onClose={() => {
                        setSingleOpened(false);
                        singleForm.reset();
                    }}
                    title={<Title order={3}>{editingSection ? 'Edit Section' : 'Add Single Section'}</Title>}
                    centered
                >
                    <form onSubmit={singleForm.handleSubmit(onSingleSubmit)}>
                        <Stack gap="md">
                            <Controller
                                name="name"
                                control={singleForm.control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextInput
                                        label="Section Name"
                                        placeholder="e.g., Section A, Morning Batch"
                                        leftSection={<IconSection size={16} />}
                                        required
                                        {...field}
                                    />
                                )}
                            />

                            <Controller
                                name="semesterId"
                                control={singleForm.control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select
                                        label="Semester"
                                        placeholder="Select a semester"
                                        data={semesterOptions}
                                        searchable
                                        nothingFoundMessage="No semesters found"
                                        disabled={loadingSemesters}
                                        rightSection={loadingSemesters ? <Loader size="xs" /> : null}
                                        required
                                        {...field}
                                        value={field.value || null}
                                    />
                                )}
                            />

                            <Group justify="flex-end" mt="lg">
                                <Button variant="light" color="gray" onClick={() => setSingleOpened(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" color="indigo">
                                    {editingSection ? 'Update' : 'Add'} Section
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Modal>

                {/* Bulk Creation Modal */}
                <Modal
                    opened={bulkOpened}
                    onClose={() => {
                        setBulkOpened(false);
                        bulkForm.reset();
                    }}
                    title={<Title order={3}>Bulk Create Class Sections</Title>}
                    centered
                >
                    <form onSubmit={bulkForm.handleSubmit(onBulkSubmit)}>
                        <Stack gap="md">
                            <Controller
                                name="semesterId"
                                control={bulkForm.control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select
                                        label="Semester"
                                        placeholder="Select a semester"
                                        data={semesterOptions}
                                        searchable
                                        nothingFoundMessage="No semesters found"
                                        disabled={loadingSemesters}
                                        rightSection={loadingSemesters ? <Loader size="xs" /> : null}
                                        required
                                        {...field}
                                    />
                                )}
                            />

                            <Controller
                                name="numberOfSections"
                                control={bulkForm.control}
                                render={({ field }) => (
                                    <NumberInput
                                        label="Number of Sections"
                                        description="How many sections to create (e.g., 3 → A, B, C)"
                                        min={1}
                                        max={26}
                                        {...field}
                                        onChange={(value) => field.onChange(value ?? 1)}
                                    />
                                )}
                            />

                            <Controller
                                name="prefix"
                                control={bulkForm.control}
                                render={({ field }) => (
                                    <TextInput
                                        label="Section Prefix (Optional)"
                                        placeholder="e.g., Section, Group, Division"
                                        description="Sections will be named: {Prefix} A, {Prefix} B, ..."
                                        {...field}
                                    />
                                )}
                            />

                            <Group justify="flex-end" mt="lg">
                                <Button variant="light" color="gray" onClick={() => setBulkOpened(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" color="teal">
                                    Create Sections
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Modal>
            </div>
        </MantineProvider>
    );
}

ClassSectionsPage.getLayout = (page: any) => (
    <AdminDashboardLayout>{page}</AdminDashboardLayout>
);