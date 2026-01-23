// src/pages/SemestersPage.tsx
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
    NumberInput,
    Group,
    Stack,
    Paper,
    Badge,
    Alert,
    ActionIcon,
    Select,
    Loader,
} from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import {
    IconPlus,
    IconCalendarEvent,
    IconToggleLeft,
    IconToggleRight,
    IconSchool,
    IconCopyPlus,
    IconInfoCircle,
    IconEdit,
} from '@tabler/icons-react';
import { AdminDashboardLayout } from "@/layouts/AdminDashboardLayout";
import { GetRequest, PostRequest, PatchRequest } from "@/plugins/https";

const theme = createTheme({
    primaryColor: 'indigo',
});

interface Semester {
    id: string;
    name: string;
    isActive: boolean;
    isCurrent: boolean;
    batchId: string;
}

interface Batch {
    id: string;
    name: string;
    year: string | number;
    isActive: boolean;
}

type SemesterFormData = {
    name: string;
    isActive: boolean;
    isCurrent: boolean;
    batchId: string;
};

type BulkSemesterFormData = {
    batchId: string;
    numberOfSemesters: number;
};

export default function SemestersPage() {
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [loadingBatches, setLoadingBatches] = useState(true);
    const [singleOpened, setSingleOpened] = useState(false);
    const [bulkOpened, setBulkOpened] = useState(false);
    const [lastBulkCreated, setLastBulkCreated] = useState<{ batchId: string; count: number } | null>(null);
    const [editingSemester, setEditingSemester] = useState<Semester | null>(null);

    const singleForm = useForm<SemesterFormData>({
        defaultValues: {
            name: '',
            isActive: true,
            isCurrent: false,
            batchId: '',
        },
    });

    const bulkForm = useForm<BulkSemesterFormData>({
        defaultValues: {
            batchId: '',
            numberOfSemesters: 8, // common default: 8 semesters
        },
    });

    const fetchSemesters = async () => {
        try {
            const res = await GetRequest("/semester");
            setSemesters(res.data || []);
        } catch (e) {
            console.error("Failed to fetch semesters", e);
        }
    };

    const fetchBatches = async () => {
        try {
            setLoadingBatches(true);
            const res = await GetRequest("/batch");
            // Optional: filter only active batches
            const activeBatches = res.data.filter((b: Batch) => b.isActive);
            setBatches(activeBatches.length > 0 ? activeBatches : res.data);
        } catch (e) {
            console.error("Failed to fetch batches", e);
        } finally {
            setLoadingBatches(false);
        }
    };

    useEffect(() => {
        fetchSemesters();
        fetchBatches();
    }, []);

    const openEditModal = async (semester: Semester) => {
        try {
            const res = await GetRequest(`/semester/${semester.id}`);
            const data = res.data;

            singleForm.reset({
                name: data.name,
                isActive: data.isActive,
                isCurrent: data.isCurrent,
                batchId: data?.batch?.id || data.batchId,
            });

            setEditingSemester(semester);
            setSingleOpened(true);
        } catch (e) {
            console.error("Failed to fetch semester details", e);
        }
    };

    const openCreateModal = () => {
        singleForm.reset({
            name: '',
            isActive: true,
            isCurrent: false,
            batchId: '',
        });
        setEditingSemester(null);
        setSingleOpened(true);
    };

    const onSingleSubmit = async (data: SemesterFormData) => {
        const formattedData = {
            name: data.name,
            isActive: data.isActive,
            isCurrent: data.isCurrent,
            batchId: data.batchId,
        };

        try {
            if (editingSemester) {
                await PatchRequest(`/semester/${editingSemester.id}`, formattedData);
            } else {
                await PostRequest("/semester/add", formattedData);
            }

            await fetchSemesters();
            setSingleOpened(false);
            singleForm.reset();
        } catch (e) {
            console.error("Failed to save semester", e);
        }
    };

    const onBulkSubmit = async (data: BulkSemesterFormData) => {
        try {
            await PostRequest("/semester/bulk", data);
            setLastBulkCreated({ batchId: data.batchId, count: data.numberOfSemesters });
            setBulkOpened(false);
            bulkForm.reset();
            await fetchSemesters();
        } catch (e) {
            console.error("Failed to bulk create semesters", e);
        }
    };

    // Prepare Select options: show name + year
    const batchOptions = batches.map((batch) => ({
        value: batch.id,
        label: `${batch.name} - ${batch.year}`,
    }));

    const rows = semesters.map((sem:any) => (
        <Table.Tr key={sem.id}>
            <Table.Td>
                <Group gap="sm">
                    <IconCalendarEvent size={18} />
                    {sem.name}
                </Group>
            </Table.Td>
            <Table.Td>
                <Badge color={sem.isActive ? 'green' : 'gray'} variant="light">
                    {sem.isActive ? 'Active' : 'Inactive'}
                </Badge>
            </Table.Td>
            <Table.Td>{sem?.batch.name}</Table.Td>
            <Table.Td>{sem?.batch.year}</Table.Td>
            <Table.Td>
                {sem.isCurrent ? (
                    <Badge color="teal" leftSection={<IconSchool size={14} />}>
                        Current
                    </Badge>
                ) : (
                    '-'
                )}
            </Table.Td>
            <Table.Td>
                <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={() => openEditModal(sem)}
                    title="Edit semester"
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
                    <Title order={1}>Semesters Management</Title>
                    <Group>
                        <Button
                            leftSection={<IconPlus size={18} />}
                            onClick={openCreateModal}
                            color="violet"
                        >
                            Add Single Semester
                        </Button>
                        <Button
                            leftSection={<IconCopyPlus size={18} />}
                            onClick={() => setBulkOpened(true)}
                            color="orange"
                        >
                            Bulk Create Semesters
                        </Button>
                    </Group>
                </Group>

                {lastBulkCreated && (
                    <Alert icon={<IconInfoCircle size={16} />} title="Bulk Creation Success" color="orange" mb="xl">
                        Successfully created <strong>{lastBulkCreated.count}</strong> semester(s) for batch:{' '}
                        <strong>{batches.find(b => b.id === lastBulkCreated.batchId)?.name || lastBulkCreated.batchId}</strong>
                    </Alert>
                )}

                <Paper shadow="sm" radius="md" withBorder>
                    <Table highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Semester Name</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Batch</Table.Th>
                                <Table.Th>Batch Year</Table.Th>
                                <Table.Th>Current</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Paper>

                {/* Single Semester Modal */}
                <Modal
                    opened={singleOpened}
                    onClose={() => {
                        setSingleOpened(false);
                        singleForm.reset();
                    }}
                    title={<Title order={3}>{editingSemester ? 'Edit Semester' : 'Add Single Semester'}</Title>}
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
                                        label="Semester Name"
                                        placeholder="e.g., First Semester"
                                        leftSection={<IconCalendarEvent size={16} />}
                                        required
                                        {...field}
                                    />
                                )}
                            />

                            <Controller
                                name="batchId"
                                control={singleForm.control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select
                                        label="Batch"
                                        placeholder="Select a batch"
                                        data={batchOptions}
                                        searchable
                                        nothingFoundMessage="No batches found"
                                        disabled={loadingBatches}
                                        rightSection={loadingBatches ? <Loader size="xs" /> : null}
                                        required
                                        {...field}
                                    />
                                )}
                            />

                            <Controller
                                name="isActive"
                                control={singleForm.control}
                                render={({ field }) => (
                                    <Switch
                                        label="Is Active"
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.currentTarget.checked)}
                                        thumbIcon={field.value ? <IconToggleRight size={12} /> : <IconToggleLeft size={12} />}
                                    />
                                )}
                            />

                            <Controller
                                name="isCurrent"
                                control={singleForm.control}
                                render={({ field }) => (
                                    <Switch
                                        label="Is Current Semester"
                                        description="Mark as the ongoing semester"
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.currentTarget.checked)}
                                        thumbIcon={field.value ? <IconSchool size={12} /> : undefined}
                                    />
                                )}
                            />

                            <Group justify="flex-end" mt="lg">
                                <Button variant="light" color="gray" onClick={() => setSingleOpened(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" color="violet">
                                    {editingSemester ? 'Update' : 'Add'} Semester
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
                    title={<Title order={3}>Bulk Create Semesters</Title>}
                    centered
                >
                    <form onSubmit={bulkForm.handleSubmit(onBulkSubmit)}>
                        <Stack gap="md">
                            <Controller
                                name="batchId"
                                control={bulkForm.control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select
                                        label="Batch"
                                        placeholder="Select a batch"
                                        data={batchOptions}
                                        searchable
                                        nothingFoundMessage="No batches found"
                                        disabled={loadingBatches}
                                        rightSection={loadingBatches ? <Loader size="xs" /> : null}
                                        required
                                        {...field}
                                    />
                                )}
                            />

                            <Controller
                                name="numberOfSemesters"
                                control={bulkForm.control}
                                render={({ field }) => (
                                    <NumberInput
                                        label="Number of Semesters"
                                        description="How many semesters to generate (e.g., 8 for BSc.CSIT)"
                                        min={1}
                                        max={20}
                                        {...field}
                                        onChange={(value) => field.onChange(value ?? 1)}
                                    />
                                )}
                            />

                            <Group justify="flex-end" mt="lg">
                                <Button variant="light" color="gray" onClick={() => setBulkOpened(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" color="orange">
                                    Create Semesters
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Modal>
            </div>
        </MantineProvider>
    );
}

SemestersPage.getLayout = (page: any) => (
    <AdminDashboardLayout>{page}</AdminDashboardLayout>
);