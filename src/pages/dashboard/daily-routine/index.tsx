import React, { useEffect, useState } from 'react';
import { Table, Button, Group, ActionIcon, Text, Badge } from '@mantine/core';
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
import axios from 'axios';
import {AdminDashboardLayout} from "@/layouts/AdminDashboardLayout";
import ClassRoutinePage from "@/pages/dashboard/class-routine";
import {DeleteRequest, GetRequest, PatchRequest} from "@/plugins/https";

interface ClassRoutine {
    id: string;
    day: string;
    index: number;
    startTime: string;
    endTime: string;
    subject: string;
    teacher: string;
    roomNo: string;
}

interface DailyClass {
    id: string;
    classDate: string;
    hasAttended: boolean;
    classRoutine: ClassRoutine;
}

const DailyClassesTable = () => {
    const [classes, setClasses] = useState<DailyClass[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchClasses = async () => {
        try {
            const response = await GetRequest('/daily-class');
            setClasses(response.data);
            console.log(response)// Adjust based on your API response structure
        } catch (error) {
            console.error('Error fetching classes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleMarkAttended = async (id: string) => {
        try {
            await PatchRequest(`/daily-class/${id}`, { hasAttended: true });
            setClasses(prev =>
                prev.map(cls => (cls.id === id ? { ...cls, hasAttended: true } : cls))
            );
        } catch (error) {
            console.error('Error marking attended:', error);
        }
    };

    const handleDelete = async (id: string) => {

            try {
                 await DeleteRequest(`/daily-class/${id}`);
                setClasses(prev => prev.filter(cls => cls.id !== id));
            } catch (error) {
                console.error('Error deleting:', error);
            }
    };

    const rows = classes?.map((item) => (
        <Table.Tr key={item.id}>
            <Table.Td>{item.classDate}</Table.Td>
            <Table.Td>{item.classRoutine.subject}</Table.Td>
            <Table.Td>{item.classRoutine.teacher}</Table.Td>
            <Table.Td>{item.classRoutine.startTime} - {item.classRoutine.endTime}</Table.Td>
            <Table.Td>{item.classRoutine.roomNo}</Table.Td>


            <Table.Td>
                <Badge color={item.hasAttended ? 'green' : 'red'}>
                    {item.hasAttended ? 'Attended' : 'Not Attended'}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Group gap="xs">
                    {!item.hasAttended && (
                        <Button
                            size="xs"
                            color="blue"
                            onClick={() => handleMarkAttended(item.id)}
                        >
                            Mark Attended
                        </Button>
                    )}
                    <ActionIcon
                        size="sm"
                        variant="subtle"
                        color="gray"
                        // You can implement view/details fetch from /daily-class/details/${item.id}
                    >
                        <IconEye size={16} />
                    </ActionIcon>
                    <ActionIcon
                        size="sm"
                        variant="subtle"
                        color="red"
                        onClick={() => handleDelete(item.id)}
                    >
                        <IconTrash size={16} />
                    </ActionIcon>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Subject</Table.Th>
                    <Table.Th>Teacher</Table.Th>
                    <Table.Th>Time</Table.Th>
                    <Table.Th>Room</Table.Th>
                    <Table.Th>Attendance</Table.Th>
                    <Table.Th>Actions</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{loading ? <Table.Tr><Table.Td colSpan={7}>Loading...</Table.Td></Table.Tr> : rows}</Table.Tbody>
        </Table>
    );
};

export default DailyClassesTable;

DailyClassesTable.getLayout = (page: any) => (
    <AdminDashboardLayout>{page}</AdminDashboardLayout>
);