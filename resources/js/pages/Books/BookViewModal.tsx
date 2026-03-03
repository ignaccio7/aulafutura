// resources/js/components/books/BookViewModal.tsx
import {
    X,
    BookOpen,
    Tag,
    DollarSign,
    FileText,
    ExternalLink,
    Pencil,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { BookForEdit, Category } from './BookFormModal';
import BookFormModal from './BookFormModal';

interface Props {
    bookId: number | null;
    onClose: () => void;
    categories: Category[];
}

export default function BookViewModal({ bookId, onClose, categories }: Props) {
    const [book, setBook] = useState<
        (BookForEdit & { category?: { id: number; name: string } }) | null
    >(null);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (!bookId) {
            setBook(null);
            return;
        }
        setLoading(true);
        fetch(`/books/${bookId}`)
            .then((r) => r.json())
            .then((data) => {
                setBook(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [bookId]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !editing) onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [editing]);

    if (!bookId) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="absolute inset-0 backdrop-blur-sm"
                    onClick={onClose}
                />

                <div className="relative z-10 w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            <h2 className="text-lg font-semibold">
                                Detalle del Libro
                            </h2>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setEditing(true)}
                                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                Editar
                            </button>
                            <button
                                onClick={onClose}
                                className="ml-1 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-5">
                        {loading && (
                            <div className="flex items-center justify-center py-12">
                                <svg
                                    className="h-8 w-8 animate-spin text-blue-500"
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
                            </div>
                        )}

                        {!loading && book && (
                            <div className="space-y-5">
                                {/* Thumbnail + título + estado */}
                                <div className="flex gap-4">
                                    {book.thumbnail ? (
                                        <img
                                            src={`/storage/${book.thumbnail}`}
                                            alt={book.title}
                                            className="h-28 w-20 flex-shrink-0 rounded-xl object-cover shadow"
                                        />
                                    ) : (
                                        <div className="flex h-28 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100">
                                            <BookOpen className="h-8 w-8 text-gray-300" />
                                        </div>
                                    )}
                                    <div className="flex flex-col justify-center gap-2">
                                        <h3 className="text-lg leading-tight font-bold">
                                            {book.title}
                                        </h3>
                                        <span
                                            className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                book.is_active
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-red-100 text-red-600'
                                            }`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${book.is_active ? 'bg-emerald-500' : 'bg-red-400'}`}
                                            />
                                            {book.is_active
                                                ? 'Activo'
                                                : 'Inactivo'}
                                        </span>
                                    </div>
                                </div>

                                {/* Info grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl px-4 py-3">
                                        <div className="mb-1 flex items-center gap-1.5 text-xs">
                                            <DollarSign className="h-3.5 w-3.5" />{' '}
                                            Precio
                                        </div>
                                        <p className="text-base font-bold">
                                            ${Number(book.price).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="rounded-xl px-4 py-3">
                                        <div className="mb-1 flex items-center gap-1.5 text-xs">
                                            <Tag className="h-3.5 w-3.5" />{' '}
                                            Categoría
                                        </div>
                                        <p className="text-sm font-medium">
                                            {book.category?.name ?? '—'}
                                        </p>
                                    </div>
                                </div>

                                {/* Descripción */}
                                {book.description && (
                                    <div>
                                        <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium">
                                            <FileText className="h-3.5 w-3.5" />{' '}
                                            Descripción
                                        </p>
                                        <p className="text-sm leading-relaxed">
                                            {book.description}
                                        </p>
                                    </div>
                                )}

                                {/* PDF */}
                                {book.book_file && (
                                    <div className="mt-4 h-[500px] w-full overflow-hidden rounded-xl border">
                                        <iframe
                                            src={`/books/${book.id}/preview`}
                                            className="h-full w-full"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end border-t border-gray-100 px-6 py-4">
                        <button
                            onClick={onClose}
                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de edición que se abre encima */}
            <BookFormModal
                open={editing}
                onClose={() => setEditing(false)}
                categories={categories}
                book={book ?? undefined}
            />
        </>
    );
}
