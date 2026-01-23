// src/pages/BatchesPage.tsx
import React, { useEffect, useState } from 'react';
import {
    MantineProvider,
    createTheme,
    Title,
    Button,
    Table,
    Modal,
    TextInput,
    NumberInput,
    Group,
    ActionIcon,
    Stack,
    Paper,
    Select,
    Loader,
} from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { IconPlus } from '@tabler/icons-react';
import { AdminDashboardLayout } from "@/layouts/AdminDashboardLayout";
import { GetRequest, PostRequest } from "@/plugins/https";

const theme = createTheme({
    primaryColor: 'indigo',
});

interface Batch {
    id: string;
    name: string;
    year: number;
    facultyId: string;
}

interface Faculty {
    id: string;
    name: string;
    isActive: boolean;
}

type BatchFormData = {
    name?: string;          // optional if backend generates it
    year: number;
    facultyId: string;
};

export default function BatchesPage() {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [loadingFaculties, setLoadingFaculties] = useState(true);
    const [addOpened, setAddOpened] = useState(false);

    const { control, handleSubmit, reset, setValue } = useForm<BatchFormData>({
        defaultValues: {
            name: '',
            year: new Date().getFullYear(),
            facultyId: '',
        },
    });

    const onSubmit = async (data: BatchFormData) => {
        try {
            const formattedData = {
                year: data.year,
                facultyId: data.facultyId,
                // name: data.name, // include only if your backend expects it
            };
            await PostRequest("/batch", formattedData);
            reset();
            setAddOpened(false);
            await getBatches(); // refresh list
        } catch (e) {
            console.error(e);
        }
    };

    const getBatches = async () => {
        try {
            const res = await GetRequest("/batch");
            setBatches(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const getFaculties = async () => {
        try {
            setLoadingFaculties(true);
            const res = await GetRequest("/faculty");
            // Filter only active faculties (remove filter if you want all)
            const activeFaculties = res.data.filter((f: any) => f.isActive);
            setFaculties(activeFaculties);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingFaculties(false);
        }
    };

    useEffect(() => {
        getBatches();
        getFaculties();
    }, []);

    const rows = batches.map((batch:any) => (
        <Table.Tr key={batch.id}>
            <Table.Td>{batch.name}</Table.Td>
            <Table.Td>{batch.year}</Table.Td>
            <Table.Td>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                    {batch.faculty.name}
                </code>
            </Table.Td>
        </Table.Tr>
    ));

    // Prepare data for Mantine Select: label = faculty name, value = faculty id
    const facultyOptions = faculties.map((faculty) => ({
        value: faculty.id,
        label: faculty.name,
    }));

    return (
        <MantineProvider theme={theme} defaultColorScheme="light">
            <div className="p-8 max-w-6xl mx-auto">
                <Group justify="space-between" mb="xl">
                    <Title order={1}>Batches</Title>
                    <Button
                        leftSection={<IconPlus size={18} />}
                        onClick={() => setAddOpened(true)}
                        color="green"
                    >
                        Add New Batch
                    </Button>
                </Group>

                {/* Table */}
                <Paper shadow="sm" radius="md" withBorder>
                    <Table highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Year</Table.Th>
                                <Table.Th>Faculty </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Paper>

                {/* Add Modal */}
                <Modal
                    opened={addOpened}
                    onClose={() => {
                        setAddOpened(false);
                        reset();
                    }}
                    title={<Title order={3}>Add New Batch</Title>}
                    centered
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack gap="md">
                            <Controller
                                name="year"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <NumberInput
                                        label="Year"
                                        placeholder="2026"
                                        min={1900}
                                        max={2100}
                                        {...field}
                                        onChange={(value) => field.onChange(value ?? 0)}
                                    />
                                )}
                            />

                            <Controller
                                name="facultyId"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select
                                        label="Faculty"
                                        placeholder="Select faculty"
                                        data={facultyOptions}
                                        searchable
                                        nothingFoundMessage="No faculties found"
                                        disabled={loadingFaculties}
                                        rightSection={loadingFaculties ? <Loader size="xs" /> : null}
                                        {...field}
                                    />
                                )}
                            />

                            <Group justify="flex-end" mt="lg">
                                <Button
                                    variant="light"
                                    color="gray"
                                    onClick={() => {
                                        setAddOpened(false);
                                        reset();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" color="green">
                                    Add Batch
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Modal>
            </div>
        </MantineProvider>
    );
}

BatchesPage.getLayout = (page: any) => (
    <AdminDashboardLayout>{page}</AdminDashboardLayout>
);