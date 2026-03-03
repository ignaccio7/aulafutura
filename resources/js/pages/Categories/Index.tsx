import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Plus, Pencil, Trash2, Search, BookOpen, Video } from 'lucide-react';
import { useState, useMemo } from 'react';

export interface Category {
    id: number;
    name: string;
    type: 'course' | 'book';
}

interface Props {
    categories: Category[];
}

export default function CategoriesIndex({ categories }: Props) {
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null,
    );
    const [form, setForm] = useState({
        name: '',
        type: 'course' as 'course' | 'book',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Categorías', href: '/admin/categories' },
    ];

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return categories.filter((c) => c.name.toLowerCase().includes(q));
    }, [categories, search]);

    const handleOpenCreate = () => {
        setEditingCategory(null);
        setForm({ name: '', type: 'course' });
        setShowForm(true);
    };

    const handleOpenEdit = (category: Category) => {
        setEditingCategory(category);
        setForm({ name: category.name, type: category.type });
        setShowForm(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            router.post(`/admin/categories/${editingCategory.id}`, form, {
                onSuccess: () => setShowForm(false),
            });
        } else {
            router.post('/admin/categories', form, {
                onSuccess: () => setShowForm(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que querés eliminar esta categoría?')) {
            router.delete(`/admin/categories/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Categorías" />

            <div className="p-6">
                <div className="mx-auto max-w-4xl">
                    {usePage().props.errors?.error && (
                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {usePage().props.errors.error}
                        </div>
                    )}
                    {/* Header */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Gestión de Categorías
                            </h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {filtered.length} categoría
                                {filtered.length !== 1 ? 's' : ''} encontrada
                                {filtered.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <button
                            onClick={handleOpenCreate}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
                        >
                            <Plus className="h-4 w-4" />
                            Nueva Categoría
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative mb-4 w-full sm:max-w-xs">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar categoría..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-9 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        />
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/50">
                                    <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        ID
                                    </th>
                                    <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Nombre
                                    </th>
                                    <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Tipo
                                    </th>
                                    <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filtered.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                        <td className="p-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                                            #{category.id}
                                        </td>
                                        <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                                            {category.name}
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    category.type === 'course'
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                                                }`}
                                            >
                                                {category.type === 'course' ? (
                                                    <Video className="h-3 w-3" />
                                                ) : (
                                                    <BookOpen className="h-3 w-3" />
                                                )}
                                                {category.type === 'course'
                                                    ? 'Curso'
                                                    : 'Libro'}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() =>
                                                        handleOpenEdit(category)
                                                    }
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700"
                                                    title="Editar"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            category.id,
                                                        )
                                                    }
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-gray-700"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="p-10 text-center text-gray-400"
                                        >
                                            <Search className="mx-auto mb-2 h-8 w-8 opacity-30" />
                                            <p>
                                                No se encontraron categorías
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
                </div>
            </div>

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                            onClick={() => setShowForm(false)}
                        />
                        <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl">
                            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                                <h2 className="text-lg font-semibold">
                                    {editingCategory
                                        ? 'Editar Categoría'
                                        : 'Nueva Categoría'}
                                </h2>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100"
                                >
                                    ✕
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4 px-6 py-5">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Nombre{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    name: e.target.value,
                                                })
                                            }
                                            placeholder="Ej: Programación"
                                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Tipo{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            value={form.type}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    type: e.target.value as
                                                        | 'course'
                                                        | 'book',
                                                })
                                            }
                                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                        >
                                            <option value="course">
                                                Curso
                                            </option>
                                            <option value="book">Libro</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                    >
                                        {editingCategory
                                            ? 'Guardar cambios'
                                            : 'Crear Categoría'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
