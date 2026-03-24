// resources/js/components/books/BookViewModal.tsx
import {
    X,
    BookOpen,
    Tag,
    DollarSign,
    FileText,
    Pencil,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    RotateCcw,
} from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import type { BookForEdit, Category } from './BookFormModal';
import BookFormModal from './BookFormModal';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Worker — asegúrate de tener el archivo en /public/
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

/* ─────────────────────────── PdfViewer interno ─────────────────────────── */

interface PdfViewerProps {
    bookId: number;
    titulo: string;
}

function PdfViewer({ bookId, titulo }: PdfViewerProps) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [baseWidth, setBaseWidth] = useState(600);

    const MIN_SCALE = 0.6;
    const MAX_SCALE = 2.5;
    const MAX_WIDTH = 800;

    /* ── Ajuste de ancho responsivo ── */
    useEffect(() => {
        const calculateWidth = () => {
            if (!containerRef.current) return;
            const available = containerRef.current.clientWidth - 32;
            setBaseWidth(Math.min(available, MAX_WIDTH));
        };
        calculateWidth();
        const observer = new ResizeObserver(calculateWidth);
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    /* ── Protecciones ── */
    const blockContextMenu = (e: React.MouseEvent) => e.preventDefault();
    const blockDrag = (e: React.DragEvent) => e.preventDefault();
    const blockKeys = (e: React.KeyboardEvent) => {
        if (
            (e.ctrlKey || e.metaKey) &&
            ['s', 'p'].includes(e.key.toLowerCase())
        ) {
            e.preventDefault();
        }
    };

    /* ── Callbacks PDF ── */
    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setLoading(false);
        setError(null);
    };

    const onDocumentLoadError = (err: Error) => {
        console.error(err);
        setError('No se pudo cargar el documento.');
        setLoading(false);
    };

    /* ── Controles ── */
    const prevPage = () => setPageNumber((p) => Math.max(p - 1, 1));
    const nextPage = () => setPageNumber((p) => Math.min(p + 1, numPages ?? 1));
    const zoomIn = () =>
        setScale((s) => Math.min(+(s + 0.2).toFixed(1), MAX_SCALE));
    const zoomOut = () =>
        setScale((s) => Math.max(+(s - 0.2).toFixed(1), MIN_SCALE));
    const resetZoom = () => setScale(1);

    return (
        <div
            className="flex h-full flex-col overflow-hidden rounded-xl bg-gray-950 outline-none"
            tabIndex={0}
            onContextMenu={blockContextMenu}
            onDragStart={blockDrag}
            onKeyDown={blockKeys}
        >
            {/* Header del visor */}
            <div className="flex items-center gap-2 border-b border-gray-800 bg-gray-900 px-4 py-2.5 text-white">
                <BookOpen className="h-4 w-4 flex-shrink-0 text-blue-400" />
                <h3 className="truncate text-sm font-semibold text-gray-200">
                    {titulo}
                </h3>
            </div>

            {/* Área de visualización */}
            <div
                ref={containerRef}
                className="flex flex-1 justify-center overflow-auto bg-gray-950 px-4 py-5"
            >
                <div className="flex w-full max-w-[800px] flex-col items-center gap-0">
                    {loading && (
                        <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
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
                            <span className="text-sm">Cargando documento…</span>
                        </div>
                    )}

                    {error && (
                        <div className="flex flex-col items-center justify-center gap-2 py-16 text-red-400">
                            <FileText className="h-10 w-10 opacity-50" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {!error && (
                        <Document
                            file={`/admin/books/${bookId}/preview`}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                            loading=""
                            error=""
                        >
                            <Page
                                pageNumber={pageNumber}
                                width={baseWidth * scale}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                className="rounded-sm shadow-2xl"
                                onContextMenu={blockContextMenu}
                                onDragStart={blockDrag}
                            />
                        </Document>
                    )}
                </div>
            </div>

            {/* Controles de navegación y zoom */}
            {!error && numPages && (
                <div className="flex items-center justify-between gap-4 border-t border-gray-800 bg-gray-900 px-4 py-2.5">
                    {/* Paginación */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={prevPage}
                            disabled={pageNumber <= 1}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-700 text-gray-300 transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="min-w-[60px] text-center text-xs text-gray-400 tabular-nums">
                            {pageNumber} / {numPages}
                        </span>
                        <button
                            onClick={nextPage}
                            disabled={pageNumber >= numPages}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-700 text-gray-300 transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Zoom */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={zoomOut}
                            disabled={scale <= MIN_SCALE}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-700 text-gray-300 transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <ZoomOut className="h-4 w-4" />
                        </button>
                        <span className="min-w-[44px] text-center text-xs text-gray-400 tabular-nums">
                            {Math.round(scale * 100)}%
                        </span>
                        <button
                            onClick={zoomIn}
                            disabled={scale >= MAX_SCALE}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-700 text-gray-300 transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <ZoomIn className="h-4 w-4" />
                        </button>
                        <button
                            onClick={resetZoom}
                            className="inline-flex h-7 items-center gap-1 rounded-md border border-gray-700 px-2 text-xs text-gray-400 transition hover:bg-gray-700"
                        >
                            <RotateCcw className="h-3 w-3" />
                            Reset
                        </button>
                    </div>

                    {/* Nota de protección */}
                    <span className="hidden text-xs text-gray-600 sm:block">
                        Solo lectura · sin descarga
                    </span>
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────── BookViewModal ─────────────────────────── */

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
        fetch(`/admin/books/${bookId}`)
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
    }, [editing, onClose]);

    if (!bookId) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal — más ancho cuando hay PDF */}
                <div
                    className={`relative z-10 flex w-full flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all dark:border-gray-800 dark:bg-gray-900 ${
                        book?.book_file ? 'max-w-4xl' : 'max-w-lg'
                    }`}
                    style={{ maxHeight: '92vh' }}
                >
                    {/* Header */}
                    <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Detalle del Libro
                            </h2>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setEditing(true)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                Editar
                            </button>
                            <button
                                onClick={onClose}
                                className="ml-1 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex flex-col gap-5 overflow-y-auto px-6 py-5">
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
                            <>
                                {/* Thumbnail + título + estado */}
                                <div className="flex gap-4">
                                    {book.thumbnail ? (
                                        <img
                                            src={`/storage/${book.thumbnail}`}
                                            alt={book.title}
                                            className="h-28 w-20 flex-shrink-0 rounded-xl object-cover shadow"
                                        />
                                    ) : (
                                        <div className="flex h-28 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                                            <BookOpen className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                                        </div>
                                    )}
                                    <div className="flex flex-col justify-center gap-2">
                                        <h3 className="text-lg leading-tight font-bold text-gray-900 dark:text-white">
                                            {book.title}
                                        </h3>
                                        <span
                                            className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                book.is_active
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                                                    : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                                            }`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${
                                                    book.is_active
                                                        ? 'bg-emerald-500 dark:bg-emerald-400'
                                                        : 'bg-red-400 dark:bg-red-500'
                                                }`}
                                            />
                                            {book.is_active
                                                ? 'Activo'
                                                : 'Inactivo'}
                                        </span>
                                    </div>
                                </div>

                                {/* Info grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/50">
                                        <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                            <DollarSign className="h-3.5 w-3.5" />
                                            Precio
                                        </div>
                                        <p className="text-base font-bold text-gray-900 dark:text-white">
                                            ${Number(book.price).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/50">
                                        <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                            <Tag className="h-3.5 w-3.5" />
                                            Categoría
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {book.category?.name ?? '—'}
                                        </p>
                                    </div>
                                </div>

                                {/* Descripción */}
                                {book.description && (
                                    <div>
                                        <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                                            <FileText className="h-3.5 w-3.5" />
                                            Descripción
                                        </p>
                                        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                            {book.description}
                                        </p>
                                    </div>
                                )}

                                {/* ── Visor PDF con react-pdf ── */}
                                {book.book_file && (
                                    <div className="mt-2 h-[520px] w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                                        <PdfViewer
                                            bookId={book.id}
                                            titulo={book.title}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex flex-shrink-0 justify-end border-t border-gray-100 px-6 py-4 dark:border-gray-800">
                        <button
                            onClick={onClose}
                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de edición encima */}
            <BookFormModal
                open={editing}
                onClose={() => setEditing(false)}
                categories={categories}
                book={book ?? undefined}
            />
        </>
    );
}
