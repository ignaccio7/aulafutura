import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import {
    Eye,
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    Search,
    Plus,
    Image as ImageIcon,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import CourseFormModal from './CourseFormModal';
import CourseViewModal from './CourseViewModal';

// ─── Tipos ──────

export interface Lesson {
    id: number;
    title: string;
    duration: number;
    order_number: number;
}

export interface Category {
    id: number;
    name: string;
}

export interface Course {
    id: number;
    category_id: number;
    title: string;
    description: string;
    price: number;
    type: string;
    thumbnail: string | null;
    is_active: boolean | number;
    category?: Category;
    course?: {
        id: number;
        total_duration: number;
        description: string | null;
        requirements: string | null;
        lessons: Lesson[];
    };
}

interface Props {
    courses: Course[];
    categories: Category[];
}

type SortField = 'id' | 'title' | 'price' | 'is_active';
type SortDir = 'asc' | 'desc';

// ─── SortIcon ─────────

function SortIcon({
    field,
    sortField,
    sortDir,
}: {
    field: SortField;
    sortField: SortField;
    sortDir: SortDir;
}) {
    if (sortField !== field)
        return <ChevronsUpDown className="ml-1 inline h-3 w-3 text-gray-400" />;
    return sortDir === 'asc' ? (
        <ChevronUp className="ml-1 inline h-3 w-3 text-blue-500" />
    ) : (
        <ChevronDown className="ml-1 inline h-3 w-3 text-blue-500" />
    );
}

const PAGE_SIZES = [10, 25, 50];

// ─── Página principal ────────

export default function CoursesIndex({ courses, categories }: Props) {
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState<SortField>('id');
    const [sortDir, setSortDir] = useState<SortDir>('asc');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [showCreate, setShowCreate] = useState(false);
    const [viewCourseId, setViewCourseId] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Cursos', href: '/courses-admin' },
    ];

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDir('asc');
        }
        setPage(1);
    };

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return courses.filter(
            (c) =>
                c.title.toLowerCase().includes(q) ||
                String(c.id).includes(q) ||
                String(c.price).includes(q),
        );
    }, [courses, search]);

    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            if (valA < valB) return sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filtered, sortField, sortDir]);

    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

    const thClass =
        'p-3 font-semibold text-gray-600 dark:text-gray-300 text-sm cursor-pointer select-none hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap transition-colors';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Cursos" />

            <div className="p-6">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Gestión de Cursos
                            </h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {filtered.length} curso
                                {filtered.length !== 1 ? 's' : ''} encontrado
                                {filtered.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCreate(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
                        >
                            <Plus className="h-4 w-4" />
                            Nuevo Curso
                        </button>
                    </div>

                    {/* Toolbar */}
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por título, ID, precio..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-9 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Mostrar</span>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-blue-400 dark:border-gray-700 dark:bg-gray-900"
                            >
                                {PAGE_SIZES.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                            <span>por página</span>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/50">
                                    <th
                                        className={thClass}
                                        onClick={() => handleSort('id')}
                                    >
                                        ID{' '}
                                        <SortIcon
                                            field="id"
                                            sortField={sortField}
                                            sortDir={sortDir}
                                        />
                                    </th>
                                    <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Imagen
                                    </th>
                                    <th
                                        className={thClass}
                                        onClick={() => handleSort('title')}
                                    >
                                        Título{' '}
                                        <SortIcon
                                            field="title"
                                            sortField={sortField}
                                            sortDir={sortDir}
                                        />
                                    </th>
                                    <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Categoría
                                    </th>
                                    <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Lecciones
                                    </th>
                                    <th
                                        className={thClass}
                                        onClick={() => handleSort('price')}
                                    >
                                        Precio{' '}
                                        <SortIcon
                                            field="price"
                                            sortField={sortField}
                                            sortDir={sortDir}
                                        />
                                    </th>
                                    <th
                                        className={thClass}
                                        onClick={() => handleSort('is_active')}
                                    >
                                        Estado{' '}
                                        <SortIcon
                                            field="is_active"
                                            sortField={sortField}
                                            sortDir={sortDir}
                                        />
                                    </th>
                                    <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {paginated.map((course) => (
                                    <tr
                                        key={course.id}
                                        className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                        <td className="p-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                                            #{course.id}
                                        </td>
                                        <td className="p-3">
                                            {course.thumbnail ? (
                                                <img
                                                    src={`/storage/${course.thumbnail}`}
                                                    alt={course.title}
                                                    className="h-10 w-10 rounded-lg border border-gray-200 object-cover dark:border-gray-700"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                                                    <ImageIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                                            {course.title}
                                        </td>
                                        <td className="p-3 text-gray-500 dark:text-gray-400">
                                            {course.category?.name ?? '—'}
                                        </td>
                                        <td className="p-3 text-gray-500 dark:text-gray-400">
                                            {course.course?.lessons?.length ??
                                                0}{' '}
                                            lecciones
                                        </td>
                                        <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                                            S/{' '}
                                            {Number(course.price).toFixed(2)}
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    course.is_active
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                                                        : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                                                }`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${course.is_active ? 'bg-emerald-500' : 'bg-red-400'}`}
                                                />
                                                {course.is_active
                                                    ? 'Activo'
                                                    : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <button
                                                onClick={() =>
                                                    setViewCourseId(course.id)
                                                }
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700"
                                                title="Ver curso"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {paginated.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="p-10 text-center text-gray-400"
                                        >
                                            <Search className="mx-auto mb-2 h-8 w-8 opacity-30" />
                                            <p>
                                                No se encontraron cursos
                                                {search
                                                    ? ` para "${search}"`
                                                    : ''}
                                                .
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                        <span>
                            Mostrando{' '}
                            {sorted.length === 0
                                ? 0
                                : (page - 1) * pageSize + 1}
                            –{Math.min(page * pageSize, sorted.length)} de{' '}
                            {sorted.length} resultados
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(1)}
                                disabled={page === 1}
                                className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700"
                            >
                                «
                            </button>
                            <button
                                onClick={() => setPage((p) => p - 1)}
                                disabled={page === 1}
                                className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700"
                            >
                                ‹
                            </button>
                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1,
                            ).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`rounded-lg border px-3 py-1.5 text-xs transition ${page === p ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-200 hover:bg-gray-100 dark:border-gray-700'}`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={page === totalPages}
                                className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700"
                            >
                                ›
                            </button>
                            <button
                                onClick={() => setPage(totalPages)}
                                disabled={page === totalPages}
                                className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700"
                            >
                                »
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <CourseFormModal
                open={showCreate}
                onClose={() => setShowCreate(false)}
                categories={categories}
            />
            <CourseViewModal
                courseId={viewCourseId}
                onClose={() => setViewCourseId(null)}
                categories={categories}
            />
        </AppLayout>
    );
}
