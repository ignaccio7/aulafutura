import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    Download,
    FileText,
    ShoppingCart,
    Tag
} from 'lucide-react';
import React from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Category {
    id: number;
    name: string;
}

interface BookFile {
    id: number;
    file_path: string;
}

interface Book {
    id: number;
    title: string;
    description: string | null;
    price: string | number;
    type: 'book';
    thumbnail: string | null;
    category?: Category;
    book_file?: BookFile;
}

interface BookShowProps {
    book: Book;
}

// ─── Utils ───────────────────────────────────────────────────────────────────

function getImageUrl(path?: string | null): string {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `/storage/${path}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function BookShow({ book }: BookShowProps) {
    const formattedPrice = Number(book.price).toFixed(2);
    const isFree = Number(book.price) === 0;

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-amber-100 selection:text-amber-900 dark:bg-slate-950 dark:selection:bg-amber-900/30 dark:selection:text-amber-200">
            <Head title={`${book.title} | Catálogo`} />

            {/* ── Navbar Spacer / Back Button ── */}
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <Link
                    href="/recursos"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                    <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                    Volver al catálogo
                </Link>
            </div>

            <main className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">

                    {/* ── Columna Izquierda: Imagen (Ocupa 5 columnas en LG) ── */}
                    <div className="lg:col-span-5">
                        <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 to-orange-100 ring-1 ring-slate-200/50 dark:from-amber-950/20 dark:to-orange-950/20 dark:ring-slate-800/50">
                            {book.thumbnail ? (
                                <img
                                    src={getImageUrl(book.thumbnail)}
                                    alt={`Portada de ${book.title}`}
                                    className="h-full w-full object-cover object-center shadow-2xl transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full w-full flex-col items-center justify-center text-amber-300/60 dark:text-amber-600/30">
                                    <BookOpen size={80} strokeWidth={1} />
                                </div>
                            )}

                            {/* Overlay sutil */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </div>
                    </div>

                    {/* ── Columna Derecha: Información (Ocupa 7 columnas en LG) ── */}
                    <div className="flex flex-col justify-center lg:col-span-7">

                        {/* Insignias / Categoría */}
                        <div className="mb-6 flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/60 bg-amber-50 px-3 py-1 text-xs font-semibold tracking-wide text-amber-700 dark:border-amber-800/50 dark:bg-amber-500/10 dark:text-amber-400">
                                <FileText size={14} />
                                E-Book / PDF
                            </span>
                            {book.category && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                                    <Tag size={14} />
                                    {book.category.name}
                                </span>
                            )}
                        </div>

                        {/* Título */}
                        <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
                            {book.title}
                        </h1>

                        {/* Descripción (Minimalista, usa color secundario) */}
                        <div className="prose prose-slate prose-lg dark:prose-invert mb-10 max-w-none text-slate-600 dark:text-slate-400">
                            {book.description ? (
                                <p className="leading-relaxed">{book.description}</p>
                            ) : (
                                <p className="italic opacity-60">Sin descripción disponible para este material.</p>
                            )}
                        </div>

                        {/* Separador elegante */}
                        <hr className="mb-10 border-slate-200 dark:border-slate-800" />

                        {/* Sección de Compra / Precio */}
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="mb-1 text-sm font-medium tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                    Precio de Adquisición
                                </p>
                                <div className="flex items-baseline gap-2">
                                    {isFree ? (
                                        <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
                                            Gratis
                                        </span>
                                    ) : (
                                        <>
                                            <span className="text-2xl font-bold text-slate-400">S/</span>
                                            <span className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                                                {formattedPrice}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Botón CTA (Call to Action) */}
                            <div className="flex w-full sm:w-auto">
                                <button
                                    type="button"
                                    className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-amber-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-amber-500/20 transition-all hover:-translate-y-1 hover:bg-amber-400 hover:shadow-2xl hover:shadow-amber-500/40 focus:ring-4 focus:ring-amber-500/30 sm:w-auto dark:bg-amber-600 dark:hover:bg-amber-500"
                                >
                                    {isFree ? (
                                        <>
                                            <Download size={20} className="transition-transform group-hover:scale-110" />
                                            Descargar Ahora
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart size={20} className="transition-transform group-hover:scale-110" />
                                            Adquirir Libro
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
