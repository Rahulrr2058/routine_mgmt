// src/pages/dashboard/page.tsx  (or wherever your dashboard lives)
import React from 'react';
import {
    Paper,
    Title,
    Text,
    Grid,
    Group,
    Badge,
    Table,
    Input,
    Stack,
    Box,
    Divider,
    Center,
    SimpleGrid,
} from '@mantine/core';
import {
    IconSchool,
    IconBuildingCommunity,
    IconCalendarEvent,
    IconClock,
    IconSearch,
    IconUsers,
    IconChecklist,
} from '@tabler/icons-react';
import { AdminDashboardLayout } from '@/layouts/AdminDashboardLayout';

// Static mock data summarizing everything we've built
const dashboardData = {
    totalBatches: 12,
    totalFaculties: 5,
    totalSemesters: 48,
    activeSemesters: 6,
    totalRoutines: 156,
    todayClasses: 42,
    recentRoutines: [
        {
            id: '1',
            semester: 'Fall 2025',
            batch: 'Computer Science 2023',
            day: 'Monday',
            classesToday: 8,
            status: 'Scheduled',
        },
        {
            id: '2',
            semester: 'Spring 2025',
            batch: 'Electrical Engineering 2024',
            day: 'Monday',
            classesToday: 6,
            status: 'Scheduled',
        },
        {
            id: '3',
            semester: 'Fall 2025',
            batch: 'Information Technology 2023',
            day: 'Monday',
            classesToday: 7,
            status: 'In Progress',
        },
    ],
};

export default function DashboardPage() {
    return (
        <>
            <Box>
                {/* Welcome Header */}
                <Group justify="space-between" mb="xl">
                    <div>
                        <Title order={2} fw={700}>
                            Welcome back, Admin!
                        </Title>
                        <Text c="dimmed" size="lg">
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </Text>
                    </div>

                    <Input
                        placeholder="Search batches, semesters..."
                        leftSection={<IconSearch size={16} />}
                        radius="xl"
                        style={{ width: 320 }}
                    />
                </Group>

                <Divider mb="xl" />

                {/* Stats Cards */}
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" mb="xl">
                    <Paper p="xl" radius="md" withBorder bg="blue.0">
                        <Group justify="space-between">
                            <div>
                                <Text c="dimmed" size="sm" tt="uppercase" fw={600}>
                                    Total Batches
                                </Text>
                                <Title order={2} mt={5}>
                                    {dashboardData.totalBatches}
                                </Title>
                            </div>
                            <IconSchool size={48} className="text-blue-600 opacity-80" />
                        </Group>
                    </Paper>

                    <Paper p="xl" radius="md" withBorder bg="green.0">
                        <Group justify="space-between">
                            <div>
                                <Text c="dimmed" size="sm" tt="uppercase" fw={600}>
                                    Faculties
                                </Text>
                                <Title order={2} mt={5}>
                                    {dashboardData.totalFaculties}
                                </Title>
                            </div>
                            <IconBuildingCommunity size={48} className="text-green-600 opacity-80" />
                        </Group>
                    </Paper>

                    <Paper p="xl" radius="md" withBorder bg="violet.0">
                        <Group justify="space-between">
                            <div>
                                <Text c="dimmed" size="sm" tt="uppercase" fw={600}>
                                    Total Semesters
                                </Text>
                                <Title order={2} mt={5}>
                                    {dashboardData.totalSemesters}
                                </Title>
                                <Text size="sm" c="dimmed" mt={4}>
                                    {dashboardData.activeSemesters} Active
                                </Text>
                            </div>
                            <IconCalendarEvent size={48} className="text-violet-600 opacity-80" />
                        </Group>
                    </Paper>

                    <Paper p="xl" radius="md" withBorder bg="orange.0">
                        <Group justify="space-between">
                            <div>
                                <Text c="dimmed" size="sm" tt="uppercase" fw={600}>
                                    Classes Today
                                </Text>
                                <Title order={2} mt={5}>
                                    {dashboardData.todayClasses}
                                </Title>
                                <Text size="sm" c="dimmed" mt={4}>
                                    Across all routines
                                </Text>
                            </div>
                            <IconClock size={48} className="text-orange-600 opacity-80" />
                        </Group>
                    </Paper>
                </SimpleGrid>

                {/* Today's Schedule Overview */}
                <Paper withBorder radius="md" p="lg" mt="xl">
                    <Group justify="space-between" mb="md">
                        <Title order={3}>
                            <Group gap="xs">
                                <IconChecklist size={24} />
                                Today&apos;s Class Schedule Overview
                            </Group>
                        </Title>
                        <Badge size="lg" color="teal" variant="light">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                        </Badge>
                    </Group>

                    <Table highlightOnHover withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Semester</Table.Th>
                                <Table.Th>Batch</Table.Th>
                                <Table.Th>Day</Table.Th>
                                <Table.Th>Classes Today</Table.Th>
                                <Table.Th>Status</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {dashboardData.recentRoutines.map((routine) => (
                                <Table.Tr key={routine.id}>
                                    <Table.Td fw={600}>{routine.semester}</Table.Td>
                                    <Table.Td>{routine.batch}</Table.Td>
                                    <Table.Td>
                                        <Badge variant="light" color="gray">
                                            {routine.day}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <IconClock size={16} />
                                            <Text fw={600}>{routine.classesToday}</Text>
                                        </Group>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge
                                            color={routine.status === 'In Progress' ? 'orange' : 'teal'}
                                            variant="light"
                                        >
                                            {routine.status}
                                        </Badge>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>

                    {dashboardData.recentRoutines.length === 0 && (
                        <Center py="xl">
                            <Text c="dimmed">No classes scheduled for today</Text>
                        </Center>
                    )}
                </Paper>

                {/* Quick Actions */}
                <SimpleGrid cols={{ base: 1, md: 2 }} mt="xl" spacing="lg">
                    <Paper p="lg" withBorder radius="md">
                        <Group>
                            <IconUsers size={32} className="text-indigo-600" />
                            <div>
                                <Title order={4}>Manage Academic Data</Title>
                                <Text size="sm" c="dimmed">
                                    Add batches, faculties, semesters, and class routines
                                </Text>
                            </div>
                        </Group>
                    </Paper>

                    <Paper p="lg" withBorder radius="md">
                        <Group>
                            <IconChecklist size={32} className="text-teal-600" />
                            <div>
                                <Title order={4}>Monitor Schedules</Title>
                                <Text size="sm" c="dimmed">
                                    View and update today&apos;s class routines
                                </Text>
                            </div>
                        </Group>
                    </Paper>
                </SimpleGrid>
            </Box>
        </>
    );
}

// Wrap with layout
DashboardPage.getLayout = (page: React.ReactNode) => (
    <AdminDashboardLayout>{page}</AdminDashboardLayout>
);