// resources/js/components/books/BookFormModal.tsx
import { useForm } from '@inertiajs/react';
import { X, Upload, BookOpen, Trash2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

export interface Category {
    id: number;
    name: string;
}

export interface BookForEdit {
    id: number;
    title: string;
    description: string;
    price: number;
    category_id: number;
    is_active: boolean | number;
    thumbnail: string | null;
    book_file?: { id: number; file_path: string };
}

interface Props {
    open: boolean;
    onClose: () => void;
    categories: Category[];
    book?: BookForEdit | null; // null/undefined = modo crear
}

export default function BookFormModal({
    open,
    onClose,
    categories,
    book,
}: Props) {
    const isEdit = !!book;

    const { data, setData, post, processing, errors, reset } = useForm<{
        title: string;
        description: string;
        price: string;
        category_id: string;
        is_active: boolean;
        thumbnail: File | null;
        book_file: File | null;
    }>({
        title: book?.title ?? '',
        description: book?.description ?? '',
        price: book ? String(book.price) : '',
        category_id: book ? String(book.category_id) : '',
        is_active: book ? Boolean(book.is_active) : true,
        thumbnail: null,
        book_file: null,
    });

    // Re-popular cuando cambia el libro (al abrir en modo edición)
    useEffect(() => {
        if (open) {
            setData({
                title: book?.title ?? '',
                description: book?.description ?? '',
                price: book ? String(book.price) : '',
                category_id: book ? String(book.category_id) : '',
                is_active: book ? Boolean(book.is_active) : true,
                thumbnail: null,
                book_file: null,
            });
        }
    }, [open, book?.id]);

    const thumbnailRef = useRef<HTMLInputElement>(null);
    const bookFileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEdit ? `/books/${book!.id}` : '/books';
        post(url, {
            forceFormData: true,
            onSuccess: () => handleClose(),
        });
    };

    if (!open) return null;

    const inputClass = (field: keyof typeof errors) =>
        `w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-100 ${
            errors[field]
                ? 'border-red-400 focus:border-red-400'
                : 'border-gray-200 focus:border-blue-400'
        }`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-xl rounded-2xl border border-gray-200 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <h2 className="text-lg font-semibold">
                            {isEdit ? 'Editar Libro' : 'Nuevo Libro'}
                        </h2>
                        {isEdit && (
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                                #{book!.id}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleClose}
                        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-5">
                        {/* Título */}
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Título <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="Ej: El principito"
                                className={inputClass('title')}
                            />
                            {errors.title && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Descripción
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                rows={3}
                                placeholder="Breve descripción del libro..."
                                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Precio + Categoría */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Precio{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm ">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) =>
                                            setData('price', e.target.value)
                                        }
                                        placeholder="0.00"
                                        className={`w-full rounded-lg border py-2 pr-3 pl-7 text-sm transition outline-none focus:ring-2 focus:ring-blue-100 ${errors.price ? 'border-red-400' : 'border-gray-200 focus:border-blue-400'}`}
                                    />
                                </div>
                                {errors.price && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Categoría{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) =>
                                        setData('category_id', e.target.value)
                                    }
                                    className={inputClass('category_id')}
                                >
                                    <option value="">Seleccionar...</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.category_id}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail */}
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Portada (imagen)
                            </label>

                            {/* Preview si ya existe thumbnail y no se ha seleccionado uno nuevo */}
                            {isEdit && book!.thumbnail && !data.thumbnail && (
                                <div className="mb-2 flex items-center gap-3 rounded-lg border border-gray-200 p-2">
                                    <img
                                        src={`/storage/${book!.thumbnail}`}
                                        alt="Portada actual"
                                        className="h-14 w-10 rounded object-cover"
                                    />
                                    <div className="flex-1 text-xs">
                                        Portada actual
                                    </div>
                                    <span className="text-xs">
                                        Selecciona una nueva para reemplazarla
                                    </span>
                                </div>
                            )}

                            <div
                                onClick={() => thumbnailRef.current?.click()}
                                className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 transition hover:border-blue-400 hover:bg-blue-50/50"
                            >
                                <Upload className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">
                                    {data.thumbnail
                                        ? data.thumbnail.name
                                        : 'JPG, PNG, WEBP — máx. 2 MB'}
                                </span>
                                {data.thumbnail && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setData('thumbnail', null);
                                            if (thumbnailRef.current)
                                                thumbnailRef.current.value = '';
                                        }}
                                        className="ml-auto text-red-400 hover:text-red-600"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                            <input
                                ref={thumbnailRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                    setData(
                                        'thumbnail',
                                        e.target.files?.[0] ?? null,
                                    )
                                }
                            />
                        </div>

                        {/* Archivo PDF */}
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Archivo del libro (PDF)
                            </label>

                            {/* Archivo actual */}
                            {isEdit && book!.book_file && !data.book_file && (
                                <div className="mb-2 flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-500">
                                    <span className="flex-1 truncate">
                                        📄 Archivo PDF cargado actualmente
                                    </span>
                                    <span className="text-gray-400">
                                        Sube uno nuevo para reemplazarlo
                                    </span>
                                </div>
                            )}

                            <div
                                onClick={() => bookFileRef.current?.click()}
                                className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 transition hover:border-blue-400 hover:bg-blue-50/50"
                            >
                                <Upload className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                <span className="truncate">
                                    {data.book_file
                                        ? data.book_file.name
                                        : 'PDF — máx. 50 MB'}
                                </span>
                                {data.book_file && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setData('book_file', null);
                                            if (bookFileRef.current)
                                                bookFileRef.current.value = '';
                                        }}
                                        className="ml-auto text-red-400 hover:text-red-600"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                            <input
                                ref={bookFileRef}
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={(e) =>
                                    setData(
                                        'book_file',
                                        e.target.files?.[0] ?? null,
                                    )
                                }
                            />
                        </div>

                        {/* Estado toggle */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setData('is_active', !data.is_active)
                                }
                                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${data.is_active ? 'bg-blue-600' : 'bg-gray-200'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${data.is_active ? 'translate-x-4' : 'translate-x-0'}`}
                                />
                            </button>
                            <span className="text-sm text-gray-600">
                                {data.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                        >
                            {processing && (
                                <svg
                                    className="h-4 w-4 animate-spin"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    />
                                </svg>
                            )}
                            {processing
                                ? 'Guardando...'
                                : isEdit
                                  ? 'Guardar cambios'
                                  : 'Crear Libro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
