import { Head, Link } from '@inertiajs/react';
import {
    Book,
    Video,
    CreditCard,
    Star,
    Rocket,
    Crown,
    BookOpen,
    PlayCircle,
    CalendarDays,
    AlertCircle,
    ArrowRight,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Mi Dashboard', href: '/user/dashboard' },
];

interface Product {
    id: number;
    title: string;
    type: 'book' | 'course';
    thumbnail: string | null;
    description: string | null;
}

interface Membership {
    plan: string;
    icon: 'star' | 'rocket' | 'crown';
    active: boolean;
    start_date: string;
    expires_at: string;
    price: string;
}

interface Props {
    membership: Membership | null;
    stats: {
        total_books: number;
        total_courses: number;
    };
    books: Product[];
    courses: Product[];
}

const PLAN_ICONS = {
    star: {
        Icon: Star,
        color: 'text-amber-500',
        bg: 'bg-amber-50 dark:bg-amber-900/30',
    },
    rocket: { Icon: Rocket, color: 'text-blue-400', bg: 'bg-blue-900/30' },
    crown: { Icon: Crown, color: 'text-purple-400', bg: 'bg-purple-900/30' },
};

export default function UserDashboard({
    membership,
    stats,
    books,
    courses,
}: Props) {
    // ── Sin membresía ──────────────────────────────
    if (!membership) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Mi Panel" />
                <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-6 text-center">
                    <div className="rounded-full bg-amber-100 p-5 dark:bg-amber-900/30">
                        <AlertCircle className="h-10 w-10 text-amber-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            No tienes una suscripción activa
                        </h2>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                            Elige un plan para acceder a libros y cursos.
                        </p>
                    </div>
                    <Link
                        href="/suscripciones"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Ver planes disponibles
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </AppLayout>
        );
    }

    const planIcon = PLAN_ICONS[membership.icon] ?? PLAN_ICONS.star;
    const PlanIcon = planIcon.Icon;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mi Panel" />

            <div className="mx-auto flex max-w-7xl flex-col gap-8 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">
                        Hola, bienvenido de nuevo 👋
                    </h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                        Aquí tienes todo el contenido de tu plan{' '}
                        <strong className="text-gray-700 dark:text-gray-200">
                            {membership.plan}
                        </strong>
                        .
                    </p>
                </div>

                {/* Stats */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Libros */}
                    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-900/30">
                            <Book className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Libros incluidos
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.total_books}
                            </p>
                        </div>
                    </div>

                    {/* Cursos */}
                    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-900/30">
                            <Video className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Cursos incluidos
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.total_courses}
                            </p>
                        </div>
                    </div>

                    {/* Plan activo */}
                    <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-md sm:col-span-2 lg:col-span-1">
                        <div className={`rounded-xl p-3 ${planIcon.bg}`}>
                            <PlanIcon className={`h-6 w-6 ${planIcon.color}`} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold tracking-wider uppercase opacity-75">
                                Plan activo
                            </p>
                            <p className="text-xl font-bold">
                                {membership.plan}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Contenido del plan (ocupa 2 columnas) */}
                    <div className="space-y-8 lg:col-span-2">
                        {/* Libros */}
                        {books.length > 0 && (
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="flex items-center gap-2 text-lg font-bold dark:text-white">
                                        <BookOpen className="h-5 w-5 text-blue-500" />
                                        Mis Libros
                                    </h3>
                                    <Link
                                        href="/user/books"
                                        className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                                    >
                                        Ver todos
                                    </Link>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {books.map((book) => (
                                        <div
                                            key={book.id}
                                            className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                                        >
                                            {book.thumbnail ? (
                                                <img
                                                    src={`/storage/${book.thumbnail}`}
                                                    alt={book.title}
                                                    className="h-14 w-10 flex-shrink-0 rounded-lg object-cover shadow-sm"
                                                />
                                            ) : (
                                                <div className="flex h-14 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30">
                                                    <BookOpen className="h-5 w-5 text-blue-400" />
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                    {book.title}
                                                </p>
                                                {book.description && (
                                                    <p className="mt-0.5 truncate text-xs text-gray-400">
                                                        {book.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Cursos */}
                        {courses.length > 0 && (
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="flex items-center gap-2 text-lg font-bold dark:text-white">
                                        <PlayCircle className="h-5 w-5 text-emerald-500" />
                                        Mis Cursos
                                    </h3>
                                    <Link
                                        href="/user/courses"
                                        className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                                    >
                                        Ver todos
                                    </Link>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {courses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                                        >
                                            {course.thumbnail ? (
                                                <img
                                                    src={`/storage/${course.thumbnail}`}
                                                    alt={course.title}
                                                    className="h-12 w-16 flex-shrink-0 rounded-lg object-cover shadow-sm"
                                                />
                                            ) : (
                                                <div className="flex h-12 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
                                                    <PlayCircle className="h-5 w-5 text-emerald-400" />
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                    {course.title}
                                                </p>
                                                {course.description && (
                                                    <p className="mt-0.5 truncate text-xs text-gray-400">
                                                        {course.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sin contenido en el plan */}
                        {books.length === 0 && courses.length === 0 && (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
                                <BookOpen className="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
                                <p className="text-sm text-gray-400 dark:text-gray-500">
                                    Tu plan aún no tiene contenido asignado.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar: detalles de membresía */}
                    <div>
                        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            {/* Icono decorativo de fondo */}
                            <div className="absolute top-0 right-0 p-6 opacity-5 transition-transform group-hover:scale-110">
                                <CreditCard className="h-24 w-24 text-gray-900 dark:text-white" />
                            </div>

                            <h3 className="mb-4 text-lg font-bold dark:text-white">
                                Tu Membresía
                            </h3>

                            <div className="relative z-10 space-y-3">
                                <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Estado
                                    </span>
                                    <span
                                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                                            membership.active
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                                                : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
                                        }`}
                                    >
                                        {membership.active
                                            ? 'Activo'
                                            : 'Inactivo'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Plan
                                    </span>
                                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        {membership.plan}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Precio
                                    </span>
                                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        {membership.price}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
                                    <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                        <CalendarDays className="h-3.5 w-3.5" />{' '}
                                        Inicio
                                    </span>
                                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        {membership.start_date}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pb-1">
                                    <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                        <CalendarDays className="h-3.5 w-3.5" />{' '}
                                        Vence el
                                    </span>
                                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        {membership.expires_at}
                                    </span>
                                </div>

                                <Link
                                    href="/suscripciones"
                                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                >
                                    Cambiar plan
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
