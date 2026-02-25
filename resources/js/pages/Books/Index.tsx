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
    Image as ImageIcon, // Añadimos el icono para cuando no hay imagen
} from 'lucide-react';
import { useState, useMemo } from 'react';
import BookFormModal from './BookFormModal';
import BookViewModal from './BookViewModal';

// 1. IMPORTACIÓN DE WAYFINDER
// Ajusta esta ruta dependiendo de dónde genere los archivos tu versión (usualmente @/actions/ o @/wayfinder/)
import BookController from '@/actions/App/Http/Controllers/BookController';

export interface BookFile {
    id: number;
    product_id: number;
    file_path: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface Book {
    id: number;
    category_id: number;
    title: string;
    description: string;
    price: number;
    type: string;
    thumbnail: string | null;
    is_active: boolean | number;
    book_file?: BookFile;
    category?: Category;
}

interface Props {
    books: Book[];
    categories: Category[];
}

type SortField = 'id' | 'title' | 'price' | 'is_active';
type SortDir = 'asc' | 'desc';

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
        return <ChevronsUpDown className="ml-1 inline h-3 w-3 text-gray-400 dark:text-gray-500" />;
    return sortDir === 'asc' ? (
        <ChevronUp className="ml-1 inline h-3 w-3 text-blue-500 dark:text-blue-400" />
    ) : (
        <ChevronDown className="ml-1 inline h-3 w-3 text-blue-500 dark:text-blue-400" />
    );
}

const PAGE_SIZES = [10, 25, 50];

export default function Books({ books, categories }: Props) {
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState<SortField>('id');
    const [sortDir, setSortDir] = useState<SortDir>('asc');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [showCreate, setShowCreate] = useState(false);
    const [viewBookId, setViewBookId] = useState<number | null>(null);

    // 2. WAYFINDER EN ACCIÓN: Generamos la URL dinámicamente
    const breadcrumbs: BreadcrumbItem[] = useMemo(() => [
        { title: 'Libros', href: BookController.index.url() }
    ], []);

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
        return books.filter(
            (b) =>
                b.title.toLowerCase().includes(q) ||
                String(b.id).includes(q) ||
                String(b.price).includes(q),
        );
    }, [books, search]);

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

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    // 3. CLASES DE MODO OSCURO (dark:text-gray-300, etc.)
    const thClass =
        'p-3 font-semibold text-gray-600 dark:text-gray-300 text-sm cursor-pointer select-none hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap transition-colors';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Libros" />

            <div className="p-6">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                                Gestión de Libros
                            </h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {filtered.length} libro{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCreate(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 active:scale-95"
                        >
                            <Plus className="h-4 w-4" />
                            Nuevo Libro
                        </button>
                    </div>

                    {/* Toolbar */}
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Buscar por título, ID, precio..."
                                value={search}
                                onChange={handleSearch}
                                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 pr-4 pl-9 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>Mostrar</span>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30"
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
                    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition-colors">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                                    <th className={thClass} onClick={() => handleSort('id')}>
                                        ID <SortIcon field="id" sortField={sortField} sortDir={sortDir} />
                                    </th>
                                    {/* 4. COLUMNA DE IMAGEN */}
                                    <th className="p-3 font-semibold text-gray-600 dark:text-gray-300 text-sm whitespace-nowrap">
                                        Imagen
                                    </th>
                                    <th className={thClass} onClick={() => handleSort('title')}>
                                        Título <SortIcon field="title" sortField={sortField} sortDir={sortDir} />
                                    </th>
                                    <th className={thClass} onClick={() => handleSort('price')}>
                                        Precio <SortIcon field="price" sortField={sortField} sortDir={sortDir} />
                                    </th>
                                    <th className={thClass} onClick={() => handleSort('is_active')}>
                                        Estado <SortIcon field="is_active" sortField={sortField} sortDir={sortDir} />
                                    </th>
                                    <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {paginated.map((book) => (
                                    <tr key={book.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="p-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                                            #{book.id}
                                        </td>
                                        {/* CELDA DE LA IMAGEN */}
                                        <td className="p-3">
                                            {book.thumbnail ? (
                                                <img
                                                    src={`/storage/${book.thumbnail}`}
                                                    alt={`Portada de ${book.title}`}
                                                    className="h-10 w-10 rounded-lg object-cover border border-gray-200 dark:border-gray-700 shadow-sm"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                                    <ImageIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {book.title}
                                            </span>
                                        </td>
                                        <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                                            ${Number(book.price).toFixed(2)}
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    book.is_active
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                                                        : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                                                }`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${
                                                        book.is_active ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-red-400 dark:bg-red-500'
                                                    }`}
                                                />
                                                {book.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setViewBookId(book.id)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:border-blue-800 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                                                    title="Ver libro"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {paginated.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="p-10 text-center text-gray-400 dark:text-gray-500"
                                        >
                                            <Search className="mx-auto mb-2 h-8 w-8 opacity-30" />
                                            <p>
                                                No se encontraron libros
                                                {search ? ` para "${search}"` : ''}.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex flex-col gap-3 text-sm text-gray-500 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                        <span>
                            Mostrando{' '}
                            {sorted.length === 0 ? 0 : (page - 1) * pageSize + 1}
                            –{Math.min(page * pageSize, sorted.length)} de{' '}
                            {sorted.length} resultados
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(1)}
                                disabled={page === 1}
                                className="rounded-lg border border-gray-200 dark:border-gray-700 px-2.5 py-1.5 text-xs transition hover:bg-gray-100 dark:hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                «
                            </button>
                            <button
                                onClick={() => setPage((p) => p - 1)}
                                disabled={page === 1}
                                className="rounded-lg border border-gray-200 dark:border-gray-700 px-2.5 py-1.5 text-xs transition hover:bg-gray-100 dark:hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                ‹
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(
                                    (p) =>
                                        p === 1 ||
                                        p === totalPages ||
                                        Math.abs(p - page) <= 1,
                                )
                                .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                                    if (
                                        idx > 0 &&
                                        typeof arr[idx - 1] === 'number' &&
                                        (p as number) - (arr[idx - 1] as number) > 1
                                    ) {
                                        acc.push('...');
                                    }
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((p, idx) =>
                                    p === '...' ? (
                                        <span key={`ellipsis-${idx}`} className="px-1">
                                            …
                                        </span>
                                    ) : (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p as number)}
                                            className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                                                page === p
                                                    ? 'border-blue-500 bg-blue-500 text-white dark:border-blue-600 dark:bg-blue-600'
                                                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ),
                                )}

                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={page === totalPages}
                                className="rounded-lg border border-gray-200 dark:border-gray-700 px-2.5 py-1.5 text-xs transition hover:bg-gray-100 dark:hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                ›
                            </button>
                            <button
                                onClick={() => setPage(totalPages)}
                                disabled={page === totalPages}
                                className="rounded-lg border border-gray-200 dark:border-gray-700 px-2.5 py-1.5 text-xs transition hover:bg-gray-100 dark:hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                »
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <BookFormModal
                open={showCreate}
                onClose={() => setShowCreate(false)}
                categories={categories}
            />
            <BookViewModal
                bookId={viewBookId}
                onClose={() => setViewBookId(null)}
                categories={categories}
            />
        </AppLayout>
    );
}
