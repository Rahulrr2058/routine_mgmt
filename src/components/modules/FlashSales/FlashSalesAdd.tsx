import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Button,
    Modal,
    TextInput,
    Textarea,
    Switch,
    MultiSelect,
    Table,
    Group,
    ActionIcon,
    Text,
} from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import {APIGetIndividualProduct, APIGetMenuItemForFlashSale} from '@/apis/product';
import {
    APIAddFlashSales,
    APIDeleteFlashSales,
    APIGetFlashSalesById,
    APIUpdateFlashSales,
    getAllFlashSales,
} from '@/apis/flashSales';
import showNotify from '@/utils/notify';

interface MenuItem {
    id: string;
    name: string;
}

export default function FlashSalesManager() {
    const [flashSales, setFlashSales] = useState<any[]>([]);
    const [menuItems, setMenuItems] = useState<{ value: string; label: string }[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editingFlashSale, setEditingFlashSale] = useState<any | null>(null);
    const [timers, setTimers] = useState<{ [key: string]: string }>({});

    const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            description: '',
            startDate: '',
            endDate: '',
            isActive: false,
            isFlashSale: false,
            bannerImage: '',
            menuItemIds: [],
        },
    });

    // Function to calculate countdown timer to midnight of endDate
    const calculateCountdown = (endDate: string | Date) => {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Set to midnight (end of day)
        const now = new Date().getTime();
        const distance = end.getTime() - now;

        if (distance <= 0) return 'Expired';

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    // Update timers every second
    useEffect(() => {
        const interval = setInterval(() => {
            setTimers((prev) => {
                const newTimers = { ...prev };
                flashSales.forEach((sale) => {
                    if (sale.endDate) {
                        newTimers[sale.id] = calculateCountdown(sale.endDate);
                    }
                });
                return newTimers;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [flashSales]);

    const fetchFlashSales = async () => {
        try {
            const response = await getAllFlashSales();
            setFlashSales(response.data);
        } catch (error: any) {
            showNotify("error", error);
        }
    };

    const fetchMenuItems = async () => {
        try {
            const { data } = await APIGetMenuItemForFlashSale();
            setMenuItems(data.map((item: any) => ({ value: item.id, label: item.productName })));
        } catch (error: any) {
            showNotify("error", error);
        }
    };

    const createFlashSale = async (data: any) => {
        try {
            await APIAddFlashSales(data);
            await fetchFlashSales();
            setModalOpen(false);
            reset();
            showNotify("success", "Flash sale created successfully");
        } catch (error: any) {
            showNotify("error", error);
        }
    };

    const updateFlashSale = async (data: any) => {
        if (!editingFlashSale) return;
        try {
            await APIUpdateFlashSales(editingFlashSale.id, data);
            await fetchFlashSales();
            setModalOpen(false);
            setEditingFlashSale(null);
            reset();
            showNotify("success", "Flash sale updated successfully");
        } catch (error: any) {
            showNotify("error", error);
        }
    };

    const deleteFlashSale = async (id: string) => {
        try {
            await APIDeleteFlashSales(id);
            await fetchFlashSales();
            showNotify("success", "Flash sale deleted successfully");
        } catch (error: any) {
            showNotify("error", error);
        }
    };

    const fetchFlashSaleById = async (id: string) => {
        try {
            const response = await APIGetFlashSalesById(id);
            return response.data;
        } catch (error: any) {
            showNotify("error", error);
            return null;
        }
    };

    const openEditModal = async (flashSale: any) => {
        const flashSaleData = await fetchFlashSaleById(flashSale.id);
        if (flashSaleData) {
            setEditingFlashSale(flashSaleData);
            reset({
                title: flashSaleData.title,
                description: flashSaleData.description || '',
                startDate: new Date(flashSaleData.startDate).toISOString().split('T')[0],
                endDate: new Date(flashSaleData.endDate).toISOString().split('T')[0],
                isActive: flashSaleData.isActive,
                isFlashSale: flashSaleData.isFlashSale,
                bannerImage: flashSaleData.bannerImage || '',
                menuItemIds: flashSaleData.menuItems?.map((item: any) => item.id) || [],
            });
            setModalOpen(true);
        }
    };

    const openCreateModal = () => {
        setEditingFlashSale(null);
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7); // Set endDate to 7 days from today
        reset({
            title: '',
            description: '',
            startDate: '', // Set to today's date (2025-09-22)
            endDate: '', // Set to 7 days from today
            isActive: false,
            isFlashSale: false,
            bannerImage: '',
            menuItemIds: [],
        });
        setModalOpen(true);
    };

    const openDeleteModal = (id: string) => {
        setDeleteId(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (deleteId) {
            deleteFlashSale(deleteId);
        }
        setDeleteModalOpen(false);
        setDeleteId(null);
    };

    useEffect(() => {
        fetchFlashSales();
        fetchMenuItems();
    }, []);

    const onSubmit = (data: any) => {
        if (editingFlashSale) {
            updateFlashSale(data);
        } else {
            createFlashSale(data);
        }
    };

    // Get today's date in YYYY-MM-DD format for min attribute
    const today = new Date().toISOString().split('T')[0];

    const watchedStartDate = watch('startDate')

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Flash Sales Manager</h1>
            <Button onClick={openCreateModal} className="mb-4">
                Create Flash Sale
            </Button>

            <Modal
                opened={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingFlashSale(null);
                    reset();
                }}
                title={editingFlashSale ? 'Edit Flash Sale' : 'Create Flash Sale'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Controller
                        name="title"
                        control={control}
                        rules={{ required: 'Title is required' }}
                        render={({ field }) => (
                            <TextInput
                                label="Title"
                                placeholder="Flash Sale Title"
                                {...field}
                                error={errors.title?.message}
                            />
                        )}
                    />
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <Textarea
                                label="Description"
                                placeholder="Flash Sale Description"
                                {...field}
                            />
                        )}
                    />
                    <Controller
                        name="startDate"
                        control={control}
                        rules={{
                            required: 'Start Date is required',
                            validate: (value) => new Date(value) >= new Date(today) || 'Start Date cannot be before today'
                        }}
                        render={({ field }) => (
                            <TextInput
                                type="date"
                                label="Start Date"
                                min={today} // Restrict to today or later
                                {...field}
                                error={errors.startDate?.message}
                            />
                        )}
                    />
                    <Controller
                        name="endDate"
                        control={control}
                        rules={{
                            required: 'End Date is required',
                        }}
                        render={({ field }) => (
                            <TextInput
                                type="date"
                                label="End Date"
                                min={watchedStartDate || today} // Restrict to today or later
                                {...field}
                                error={errors.endDate?.message}
                            />
                        )}
                    />
                    <Controller
                        name="isActive"
                        control={control}
                        render={({ field }) => (
                            <Switch
                                label="Is Active"
                                checked={field.value}
                                onChange={(event) => field.onChange(event.currentTarget.checked)}
                            />
                        )}
                    />
                    <Controller
                        name="isFlashSale"
                        control={control}
                        render={({ field }) => (
                            <Switch
                                label="Is Flash Sale"
                                checked={field.value}
                                onChange={(event) => field.onChange(event.currentTarget.checked)}
                            />
                        )}
                    />
                    <Controller
                        name="bannerImage"
                        control={control}
                        render={({ field }) => (
                            <TextInput
                                label="Banner Image URL"
                                placeholder="Enter banner image URL"
                                {...field}
                            />
                        )}
                    />
                    <Controller
                        name="menuItemIds"
                        control={control}
                        rules={{
                            required: 'Menu items are required',
                            validate: (value) => value.length > 0 || 'At least one menu item is required',
                        }}
                        render={({ field }) => (
                            <MultiSelect
                                label="Menu Items"
                                data={menuItems}
                                placeholder="Select menu items"
                                searchable
                                clearable
                                required
                                withAsterisk
                                hidePickedOptions
                                nothingFoundMessage="No items found"
                                {...field}
                            />
                        )}
                    />
                    <Group justify="flex-end">
                        <Button type="submit">{editingFlashSale ? 'Update' : 'Create'}</Button>
                    </Group>
                </form>
            </Modal>

            <Modal
                opened={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setDeleteId(null);
                }}
                title="Confirm Deletion"
            >
                <Text>Are you sure you want to delete this flash sale?</Text>
                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={() => {
                        setDeleteModalOpen(false);
                        setDeleteId(null);
                    }}>Cancel</Button>
                    <Button color="red" onClick={confirmDelete}>Delete</Button>
                </Group>
            </Modal>

            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Title</Table.Th>
                        <Table.Th>Start Date</Table.Th>
                        <Table.Th>End Date</Table.Th>
                        <Table.Th>Active</Table.Th>
                        <Table.Th>Flash Sale</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {flashSales.map((sale) => (
                        <Table.Tr key={sale.id}>
                            <Table.Td>{sale.title}</Table.Td>
                            <Table.Td>
                                {sale.startDate ? new Date(sale.startDate).toLocaleDateString() : '-'}
                            </Table.Td>
                            <Table.Td>
                                {sale.endDate ? new Date(sale.endDate).toLocaleDateString() : '-'}
                            </Table.Td>
                            <Table.Td>{sale.isActive ? 'Yes' : 'No'}</Table.Td>
                            <Table.Td>{sale.isFlashSale ? 'Yes' : 'No'}</Table.Td>
                            <Table.Td>
                                <Group>
                                    <ActionIcon onClick={() => openEditModal(sale)}>
                                        <IconEdit size={16} />
                                    </ActionIcon>
                                    <ActionIcon onClick={() => openDeleteModal(sale.id)} color="red">
                                        <IconTrash size={16} />
                                    </ActionIcon>
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </div>
    );
}