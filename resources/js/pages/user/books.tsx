import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import {
    Book,
    BookOpen,
    X,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    RotateCcw,
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Mi Dashboard', href: '/user/dashboard' },
    { title: 'Mis Libros', href: '/user/books' },
];

interface BookItem {
    id: number;
    title: string;
    thumbnail: string | null;
    description: string | null;
}

interface Props {
    books: BookItem[];
}

/* ─────────────── Modal visor PDF ─────────────── */

interface PdfModalProps {
    book: BookItem;
    onClose: () => void;
}

function PdfModal({ book, onClose }: PdfModalProps) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [baseWidth, setBaseWidth] = useState(700);

    const MIN_SCALE = 0.6;
    const MAX_SCALE = 2.5;
    const MAX_WIDTH = 900;

    /* Ajuste de ancho responsivo */
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

    /* Cerrar con Escape */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handler);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    /* Protecciones */
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

    const prevPage = () => setPageNumber((p) => Math.max(p - 1, 1));
    const nextPage = () => setPageNumber((p) => Math.min(p + 1, numPages ?? 1));
    const zoomIn = () =>
        setScale((s) => Math.min(+(s + 0.2).toFixed(1), MAX_SCALE));
    const zoomOut = () =>
        setScale((s) => Math.max(+(s - 0.2).toFixed(1), MIN_SCALE));
    const resetZoom = () => setScale(1);

    return (
        <div className="fixed inset-0 z-50 flex flex-col">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Contenedor del modal */}
            <div className="relative z-10 mx-auto my-4 flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-gray-700 bg-gray-950 shadow-2xl">
                {/* Header */}
                <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-800 bg-gray-900 px-5 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <BookOpen className="h-5 w-5 flex-shrink-0 text-blue-400" />
                        <h2 className="truncate text-sm font-semibold text-gray-100">
                            {book.title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-3 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-700 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Área de visualización */}
                <div
                    ref={containerRef}
                    className="flex flex-1 justify-center overflow-auto bg-gray-950 px-4 py-6"
                    onContextMenu={blockContextMenu}
                    onDragStart={blockDrag}
                    onKeyDown={blockKeys}
                    tabIndex={0}
                >
                    <div className="flex w-full max-w-[900px] flex-col items-center">
                        {loading && (
                            <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
                                <svg
                                    className="h-9 w-9 animate-spin text-blue-500"
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
                                <span className="text-sm">
                                    Cargando documento…
                                </span>
                            </div>
                        )}

                        {error && (
                            <div className="flex flex-col items-center justify-center gap-2 py-20 text-red-400">
                                <BookOpen className="h-12 w-12 opacity-40" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {!error && (
                            <Document
                                file={`/user/books/${book.id}/preview`}
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
                                    className="shadow-2xl"
                                    onContextMenu={blockContextMenu}
                                    onDragStart={blockDrag}
                                />
                            </Document>
                        )}

                        {/* Marca de agua */}
                        <div className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center">
                            <div className="rotate-[-30deg] text-6xl font-bold text-white opacity-[0.03] select-none">
                                SOLO LECTURA
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controles */}
                {!error && numPages && (
                    <div className="flex flex-shrink-0 items-center justify-between gap-4 border-t border-gray-800 bg-gray-900 px-5 py-3">
                        {/* Paginación */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={prevPage}
                                disabled={pageNumber <= 1}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 text-gray-300 transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <span className="min-w-[64px] text-center text-xs text-gray-400 tabular-nums">
                                {pageNumber} / {numPages}
                            </span>
                            <button
                                onClick={nextPage}
                                disabled={pageNumber >= numPages}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 text-gray-300 transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Zoom */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={zoomOut}
                                disabled={scale <= MIN_SCALE}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 text-gray-300 transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <ZoomOut className="h-4 w-4" />
                            </button>
                            <span className="min-w-[44px] text-center text-xs text-gray-400 tabular-nums">
                                {Math.round(scale * 100)}%
                            </span>
                            <button
                                onClick={zoomIn}
                                disabled={scale >= MAX_SCALE}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 text-gray-300 transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <ZoomIn className="h-4 w-4" />
                            </button>
                            <button
                                onClick={resetZoom}
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-700 px-2.5 text-xs text-gray-400 transition hover:bg-gray-700"
                            >
                                <RotateCcw className="h-3 w-3" />
                                Reset
                            </button>
                        </div>

                        <span className="hidden text-xs text-gray-600 sm:block">
                            Solo lectura · sin descarga
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─────────────── Vista principal ─────────────── */

export default function UserBooks({ books }: Props) {
    const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mis Libros" />

            <div className="flex flex-col gap-8 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Mis Libros
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {books.length > 0
                                ? `Tienes acceso a ${books.length} libro${books.length !== 1 ? 's' : ''} con tu plan.`
                                : 'Accede a tu biblioteca personal de libros digitales.'}
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <Book className="h-12 w-12 text-blue-500/20" />
                    </div>
                </div>

                {books.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {books.map((book) => (
                            <div
                                key={book.id}
                                className="group relative overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:shadow-xl"
                            >
                                {/* Portada */}
                                <div className="aspect-3/4 overflow-hidden bg-muted">
                                    {book.thumbnail ? (
                                        <img
                                            src={`/storage/${book.thumbnail}`}
                                            alt={book.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-blue-50 dark:bg-blue-900/20">
                                            <BookOpen className="h-16 w-16 text-blue-200 dark:text-blue-800" />
                                        </div>
                                    )}

                                    {/* Overlay al hover */}
                                    <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                                        <button
                                            onClick={() =>
                                                setSelectedBook(book)
                                            }
                                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2 text-sm font-semibold text-black transition-colors hover:bg-gray-100"
                                        >
                                            <BookOpen className="h-4 w-4" />
                                            Leer ahora
                                        </button>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <h3 className="line-clamp-2 leading-tight font-bold">
                                        {book.title}
                                    </h3>
                                    {book.description && (
                                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                            {book.description}
                                        </p>
                                    )}
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                                            PDF
                                        </span>
                                        <button
                                            onClick={() =>
                                                setSelectedBook(book)
                                            }
                                            className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            Leer →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed py-20 text-center">
                        <Book className="mb-4 h-16 w-16 text-muted-foreground/30" />
                        <h2 className="text-xl font-semibold">
                            Tu plan no incluye libros
                        </h2>
                        <p className="mt-2 max-w-sm text-muted-foreground">
                            Actualiza tu plan para acceder a nuestra biblioteca
                            de libros digitales.
                        </p>
                        <Link
                            href="/suscripciones"
                            className="mt-6 rounded-full bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                        >
                            Ver planes
                        </Link>
                    </div>
                )}
            </div>

            {/* Modal PDF */}
            {selectedBook && (
                <PdfModal
                    book={selectedBook}
                    onClose={() => setSelectedBook(null)}
                />
            )}
        </AppLayout>
    );
}
