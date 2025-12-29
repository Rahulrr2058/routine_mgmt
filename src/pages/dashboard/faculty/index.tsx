// src/pages/FacultyPage.tsx
import React, {useEffect, useState} from 'react';
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
} from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { IconPlus, IconBuilding, IconToggleLeft, IconToggleRight } from '@tabler/icons-react';
import {AdminDashboardLayout} from "@/layouts/AdminDashboardLayout";
import {GetRequest, PostRequest} from "@/plugins/https";

const theme = createTheme({
    primaryColor: 'indigo',
});

interface Faculty {
    id: string;
    name: string;
    isActive: boolean;
}

type FacultyFormData = {
    name: string;
    isActive: boolean;
};

// Mock initial data


export default function FacultyPage() {
    const [faculties, setFaculties] = useState<any[]>([]);
    const [addOpened, setAddOpened] = useState(false);

    const { control, handleSubmit, reset } = useForm<FacultyFormData>({
        defaultValues: {
            name: '',
            isActive: true,
        },
    });

    const onSubmit = async (data: FacultyFormData) => {
       try {
           const res = await PostRequest("/faculty", data);

       }
       catch (e)
       {
           console.log(e);
       }
    };

    const getFaculties = async () => {
        try {


            const res = await GetRequest("/faculty");
            setFaculties(res.data);
        }
        catch (e)
        {
            console.log(e);
        }
    }
    useEffect( () => {
        getFaculties();
    },[]
     )

    const rows = faculties.map((faculty) => (
        <Table.Tr key={faculty.id}>
            <Table.Td>
                <Group gap="sm">
                    <IconBuilding size={18} />
                    {faculty.name}
                </Group>
            </Table.Td>
            <Table.Td>
                <Badge
                    color={faculty.isActive ? 'green' : 'red'}
                    variant="light"
                    leftSection={faculty.isActive ? <IconToggleRight size={14} /> : <IconToggleLeft size={14} />}
                >
                    {faculty.isActive ? 'Active' : 'Inactive'}
                </Badge>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <MantineProvider theme={theme} defaultColorScheme="light">
            <div className="p-8 max-w-4xl mx-auto">
                <Group justify="space-between" mb="xl">
                    <Title order={1}>Faculties</Title>
                    <Button
                        leftSection={<IconPlus size={18} />}
                        onClick={() => setAddOpened(true)}
                        color="cyan"
                    >
                        Add New Faculty
                    </Button>
                </Group>

                {/* Table */}
                <Paper shadow="sm" radius="md" withBorder>
                    <Table highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Faculty Name</Table.Th>
                                <Table.Th>Status</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Paper>

                {/* Add Modal */}
                <Modal
                    opened={addOpened}
                    onClose={() => setAddOpened(false)}
                    title={<Title order={3}>Add New Faculty</Title>}
                    centered
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack gap="md">
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <TextInput
                                        label="Faculty Name"
                                        placeholder="e.g., Faculty of Law"
                                        leftSection={<IconBuilding size={16} />}
                                        {...field}
                                    />
                                )}
                            />

                            <Controller
                                name="isActive"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        label="Is Active"
                                        description="Set whether this faculty is currently active"
                                        checked={field.value}
                                        onChange={(event) => field.onChange(event.currentTarget.checked)}
                                        thumbIcon={
                                            field.value ? (
                                                <IconToggleRight size={12} />
                                            ) : (
                                                <IconToggleLeft size={12} />
                                            )
                                        }
                                    />
                                )}
                            />

                            <Group justify="flex-end" mt="lg">
                                <Button variant="light" color="gray" onClick={() => setAddOpened(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" color="cyan">
                                    Add Faculty
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Modal>
            </div>
        </MantineProvider>
    );
}
FacultyPage.getLayout = (page: any) => (
    <AdminDashboardLayout>{page}</AdminDashboardLayout>
);