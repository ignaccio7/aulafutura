import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Folder,
    LayoutGrid,
    LibraryBig,
    Video,
    Tag,
} from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const role = auth.user.rol;

    const getNavItems = (): NavItem[] => {
        if (role === 'admin') {
            return [
                {
                    title: 'Dashboard',
                    href: dashboard().url,
                    icon: LayoutGrid,
                },
                {
                    title: 'Libros',
                    href: admin.books.index().url,
                    icon: LibraryBig,
                },
                {
                    title: 'Cursos',
                    href: admin.courses.index().url,
                    icon: Video,
                },
                {
                    title: 'Categorías',
                    href: '/admin/categories',
                    icon: Tag,
                },
            ];
        } else if (role === 'user') {
            return [
                {
                    title: 'Dashboard',
                    href: dashboard().url,
                    icon: LayoutGrid,
                },
                {
                    title: 'Mis Libros',
                    href: '/user/books',
                    icon: LibraryBig,
                },
                {
                    title: 'Mis Cursos',
                    href: '/user/courses',
                    icon: Video,
                },
            ];
        }
        return [];
    };

    const mainNavItems = getNavItems();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
