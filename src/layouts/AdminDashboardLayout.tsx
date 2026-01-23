// src/layouts/AdminDashboardLayout.tsx
import {
    AppShell,
    Avatar,
    Box,
    Button,
    Group,
    NavLink,
    Popover,
    Stack,
    Text,
    Title,
    rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";
import Link from "next/link";
import {
    IconDashboard,
    IconSchool,
    IconCalendarEvent,
    IconBuildingCommunity,
    IconClock,
    IconLogout,
    IconUserCircle, IconClock2,
} from "@tabler/icons-react";
import { deleteCookie } from "cookies-next/client";

export function AdminDashboardLayout({
                                         children,
                                     }: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();

    const handleLogout = () => {
        deleteCookie("token");
        deleteCookie("role");
        deleteCookie("user");
        router.push("/login");
    };

    const isActive = (path: string) => {
        if (path === "/dashboard") {
            return router.pathname === "/dashboard" || router.pathname === "/dashboard/";
        }
        return router.pathname.startsWith(path);
    };

    const menuItems = [
        { label: "Dashboard", href: "/dashboard", icon: IconDashboard },
        { label: "Batches", href: "/dashboard/batch", icon: IconSchool },
        { label: "Class Routine", href: "/dashboard/class-routine", icon: IconClock },
        { label: "Daily Routine", href: "/dashboard/daily-routine", icon: IconClock2 },
        { label: "Class Section", href: "/dashboard/class-section", icon: IconBuildingCommunity },
        { label: "Faculty", href: "/dashboard/faculty", icon: IconBuildingCommunity },
        { label: "Semesters", href: "/dashboard/semester", icon: IconCalendarEvent },
    ];

    return (
        <AppShell
            header={{ height: 80 }}
            navbar={{
                width: 280,
                breakpoint: "sm",
                collapsed: { mobile: !mobileOpened },
            }}
            padding="md"
        >
            {/* Header */}
            <AppShell.Header bg="white" px="xl" py="md" withBorder>
                <Group justify="space-between" h="100%" align="center">
                    <Group align="center">
                        <Box visibleFrom="sm">
                            <img
                                src="/damipasal.png"
                                alt="Admin Logo"
                                style={{ height: 48, width: "auto" }}
                            />
                        </Box>
                        <Box hiddenFrom="sm">
                            <img
                                src="/damipasal.png"
                                alt="Admin Logo"
                                style={{ height: 40, width: "auto" }}
                            />
                        </Box>
                    </Group>

                    <Popover width={200} position="bottom-end" shadow="md">
                        <Popover.Target>
                            <Avatar
                                src="/profile.png"
                                alt="Admin"
                                radius="xl"
                                size="lg"
                                style={{ cursor: "pointer" }}
                            />
                        </Popover.Target>
                        <Popover.Dropdown p="md">
                            <Stack gap="sm">
                                <Group gap="xs">
                                    <IconUserCircle size={20} />
                                    <Text fw={500}>Admin User</Text>
                                </Group>
                                <Button
                                    leftSection={<IconLogout size={16} />}
                                    variant="subtle"
                                    color="red"
                                    fullWidth
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </Stack>
                        </Popover.Dropdown>
                    </Popover>
                </Group>
            </AppShell.Header>

            {/* Sidebar */}
            <AppShell.Navbar p="md" bg="gray.0">
                <Stack justify="flex-start" gap="xs">
                    <Title order={5} pl="md" c="dimmed" mb="md" tt="uppercase" fw={600} fz="sm">
                        Navigation
                    </Title>

                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <NavLink
                                key={item.href}
                                component={Link}
                                href={item.href}
                                label={item.label}
                                leftSection={
                                    <Icon style={{ width: rem(18), height: rem(18) }} stroke={1.8} />
                                }
                                active={active}
                                variant={active ? "filled" : "light"}
                                color="indigo"
                                styles={{
                                    root: {
                                        borderRadius: rem(12),
                                        fontSize: rem(14.5),
                                        fontWeight: 500,
                                        transition: 'background-color 0.2s ease, transform 0.1s ease',
                                        '&:hover': {
                                            transform: 'translateX(4px)',
                                        },
                                    },
                                    label: {
                                        fontWeight: active ? 600 : 500,
                                    },
                                }}
                            />
                        );
                    })}
                </Stack>

                {/* Optional: Footer section in sidebar */}
                <Box mt="auto" p="md">
                    <Text size="xs" c="dimmed" ta="center">
                        © 2025 Your University
                    </Text>
                </Box>
            </AppShell.Navbar>

            {/* Main Content */}
            <AppShell.Main pt={`calc(${rem(80)} + var(--mantine-spacing-md))`}>
                <Box px="xl">{children}</Box>
            </AppShell.Main>
        </AppShell>
    );
}