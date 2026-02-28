import { Link, router } from '@inertiajs/react';
import {
    ArrowUpRight,
    BookOpen,
    PackageOpen,
    Search,
    Video,
    X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Product {
    id: number;
    title: string;
    description: string | null;
    price: string | number;
    type: 'book' | 'course';
    thumbnail: string | null;
}

interface PaginatedData {
    data: Product[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface CatalogProps {
    products: PaginatedData;
    filters: {
        search: string | null;
        type: string;
    };
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
    return (
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
            {/* Image area */}
            <div className="h-52 w-full animate-pulse bg-slate-200 dark:bg-slate-700" />
            {/* Content area */}
            <div className="flex flex-col gap-3 p-6">
                {/* Badge */}
                <div className="h-5 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                {/* Title */}
                <div className="space-y-2">
                    <div className="h-5 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
                    <div className="h-5 w-3/4 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
                </div>
                {/* Description */}
                <div className="space-y-1.5">
                    <div className="h-3.5 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                    <div className="h-3.5 w-5/6 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                </div>
                {/* Price + CTA */}
                <div className="mt-2 flex items-center justify-between">
                    <div className="h-7 w-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
                    <div className="h-10 w-10 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
                </div>
            </div>
        </div>
    );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

interface ProductCardProps {
    product: Product;
}

function ProductCard({ product }: ProductCardProps) {
    const isBook = product.type === 'book';

    return (
        <Link
            href={isBook ? `/books/${product.id}` : `/courses/${product.id}`}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
        >
            {/* ── Thumbnail ── */}
            <div
                className={`relative h-52 overflow-hidden ${
                    isBook
                        ? 'bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/40'
                        : 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-950/40'
                }`}
            >
                {product.thumbnail ? (
                    <img
                        src={getImageUrl(product.thumbnail)}
                        alt={product.title}
                        className="h-full w-full object-cover object-[center_30%] transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        {isBook ? (
                            <BookOpen
                                size={48}
                                className="text-amber-300/60 dark:text-amber-600/40"
                            />
                        ) : (
                            <Video
                                size={48}
                                className="text-blue-300/60 dark:text-blue-600/40"
                            />
                        )}
                    </div>
                )}

                {/* Overlay gradient at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Type badge */}
                <span
                    className={`absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide backdrop-blur-sm ${
                        isBook
                            ? 'bg-amber-50/90 text-amber-700 ring-1 ring-amber-200/60 dark:bg-amber-950/80 dark:text-amber-400 dark:ring-amber-800/60'
                            : 'bg-blue-50/90 text-blue-700 ring-1 ring-blue-200/60 dark:bg-blue-950/80 dark:text-blue-400 dark:ring-blue-800/60'
                    }`}
                >
                    {isBook ? <BookOpen size={12} /> : <Video size={12} />}
                    {isBook ? 'PDF' : 'CURSO'}
                </span>
            </div>

            {/* ── Content ── */}
            <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-1.5 line-clamp-2 text-base leading-snug font-bold text-slate-900 dark:text-white">
                    {product.title}
                </h3>

                {product.description && (
                    <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        {product.description}
                    </p>
                )}

                {/* ── Footer ── */}
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div>
                        <p className="text-[11px] font-medium tracking-widest text-slate-400 uppercase dark:text-slate-500">
                            Precio
                        </p>
                        <p className="text-xl font-black text-slate-900 dark:text-white">
                            S/ {product.price}
                        </p>
                    </div>

                    <span
                        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/30 transition-all duration-200 group-hover:scale-110 group-hover:bg-blue-500 group-hover:shadow-blue-500/40 dark:bg-blue-500 dark:shadow-blue-500/30"
                        aria-label={`Ver ${product.title}`}
                    >
                        <ArrowUpRight size={18} />
                    </span>
                </div>
            </div>
        </Link>
    );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
    searchTerm: string;
    onClear: () => void;
}

function EmptyState({ searchTerm, onClear }: EmptyStateProps) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 dark:bg-slate-800">
                <PackageOpen
                    size={36}
                    className="text-slate-400 dark:text-slate-500"
                />
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-800 dark:text-white">
                Sin resultados
            </h3>
            <p className="mb-6 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                {searchTerm
                    ? `No encontramos productos para "${searchTerm}". Intenta con otro término.`
                    : 'No hay productos en esta categoría por ahora.'}
            </p>
            {searchTerm && (
                <button
                    onClick={onClear}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                    <X size={14} />
                    Limpiar búsqueda
                </button>
            )}
        </div>
    );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
    links: PaginatedData['links'];
}

function Pagination({ links }: PaginationProps) {
    if (links.length <= 3) return null;

    return (
        <div className="mt-14 flex justify-center">
            <div className="flex flex-wrap items-center justify-center gap-1">
                {links.map((link, index) => {
                    if (link.url === null) {
                        return (
                            <span
                                key={index}
                                className="flex h-9 min-w-9 items-center justify-center rounded-xl border border-slate-200 px-3 text-sm text-slate-300 dark:border-slate-700 dark:text-slate-600"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={link.url}
                            preserveScroll
                            preserveState
                            className={`flex h-9 min-w-9 items-center justify-center rounded-xl border px-3 text-sm font-medium transition-all duration-150 ${
                                link.active
                                    ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/25 dark:border-blue-500 dark:bg-blue-500'
                                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </div>
        </div>
    );
}

// ─── Search Input ─────────────────────────────────────────────────────────────

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
}

function SearchInput({ value, onChange, onClear }: SearchInputProps) {
    return (
        <div className="relative">
            <Search
                size={16}
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
            />
            <input
                type="text"
                placeholder="Buscar productos..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full rounded-2xl border border-slate-200 bg-white py-2.5 pr-9 pl-10 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none sm:w-64 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-400"
            />
            {value && (
                <button
                    onClick={onClear}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Limpiar búsqueda"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}

// ─── Tab Filter ───────────────────────────────────────────────────────────────

const TABS = [
    { value: 'all', label: 'Todos' },
    { value: 'book', label: 'Libros' },
    { value: 'course', label: 'Cursos' },
] as const;

interface TabFilterProps {
    active: string;
    onChange: (value: string) => void;
}

function TabFilter({ active, onChange }: TabFilterProps) {
    return (
        <div className="flex gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
            {TABS.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => onChange(tab.value)}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-150 ${
                        active === tab.value
                            ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

// ─── Catalog (Main) ───────────────────────────────────────────────────────────

const SKELETON_COUNT = 6;

function getImageUrl(path?: string | null): string {
    if (!path) return '/images/placeholder.png';

    // Si ya es una URL externa
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // Si es archivo almacenado en Laravel storage
    return `/storage/${path}`;
}

export default function Catalog({
    products,
    filters = { search: '', type: 'all' },
}: CatalogProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [activeTab, setActiveTab] = useState(filters.type || 'all');
    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = useRef(true);

    const applyFilters = (search: string, type: string) => {
        setIsLoading(true);
        router.get(
            '/recursos',
            { search, type },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    // Debounced search
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const id = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                applyFilters(searchTerm, activeTab);
            }
        }, 400);

        return () => clearTimeout(id);
    }, [searchTerm]);

    const handleTabChange = (newType: string) => {
        setActiveTab(newType);
        applyFilters(searchTerm, newType);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        applyFilters('', activeTab);
    };

    const showProducts = !isLoading && products.data.length > 0;
    const showEmpty = !isLoading && products.data.length === 0;

    return (
        <section
            id="catalogo"
            className="min-h-screen bg-slate-50 px-4 py-20 sm:px-6 dark:bg-slate-950"
        >
            <div className="mx-auto max-w-7xl">
                {/* ── Header ── */}
                <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-1 text-xs font-semibold tracking-widest text-blue-600 uppercase dark:text-blue-400">
                            Catálogo
                        </p>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                            Nuestros Destacados
                        </h2>
                        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                            Lo más popular entre nuestra comunidad.
                        </p>
                    </div>

                    {/* ── Controls ── */}
                    <div className="flex flex-wrap items-center gap-3">
                        <SearchInput
                            value={searchTerm}
                            onChange={setSearchTerm}
                            onClear={handleClearSearch}
                        />
                        <TabFilter
                            active={activeTab}
                            onChange={handleTabChange}
                        />
                    </div>
                </div>

                {/* ── Results count (when not loading) ── */}
                {!isLoading && (
                    <p className="mb-6 text-xs text-slate-400 dark:text-slate-500">
                        {products.data.length === 0
                            ? 'Sin resultados'
                            : `${products.data.length} producto${products.data.length !== 1 ? 's' : ''} encontrado${products.data.length !== 1 ? 's' : ''}`}
                    </p>
                )}

                {/* ── Grid ── */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {/* Skeletons */}
                    {isLoading &&
                        Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}

                    {/* Cards */}
                    {showProducts &&
                        products.data.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}

                    {/* Empty */}
                    {showEmpty && (
                        <EmptyState
                            searchTerm={searchTerm}
                            onClear={handleClearSearch}
                        />
                    )}
                </div>

                {/* ── Pagination ── */}
                {showProducts && <Pagination links={products.links} />}
            </div>
        </section>
    );
}
