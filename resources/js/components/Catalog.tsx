import { Link, router } from '@inertiajs/react';
import { ArrowRight, BookOpen, Search, Video } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Interfaces (puedes moverlas a un archivo types.d.ts si prefieres)
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

export default function Catalog({
    products,
    filters = { search: '', type: 'all' },
}: CatalogProps) {
    const brandBg = 'bg-[#1D4ED8] dark:bg-blue-600';

    // Estados locales sincronizados con los filtros de la URL
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [activeTab, setActiveTab] = useState(filters.type || 'all');

    // Función que usa Inertia para pedir nuevos datos al controlador
    const applyFilters = (search: string, type: string) => {
        router.get(
            '/', // <-- Usamos directamente la URL de la Landing Page
            { search, type },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    // Efecto de búsqueda (Debounce de 400ms)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // Solo buscamos si el término cambió respecto al filtro actual de la URL
            if (searchTerm !== (filters.search || '')) {
                applyFilters(searchTerm, activeTab);
            }
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handleTabChange = (newType: string) => {
        setActiveTab(newType);
        applyFilters(searchTerm, newType);
    };

    return (
        <section
            id="catalogo"
            className="bg-slate-50 px-6 py-24 dark:bg-slate-900/30"
        >
            <div className="mx-auto max-w-7xl">
                {/* ENCABEZADO Y FILTROS */}
                <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="mb-2 text-4xl font-bold text-slate-900 dark:text-white">
                            Nuestros Destacados
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Lo más popular entre nuestra comunidad.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        {/* Buscador */}
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search size={18} className="text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full rounded-full border border-slate-200 bg-white py-2 pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-blue-500 sm:w-64 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-400"
                            />
                        </div>

                        {/* Tabs */}
                        <div className="flex space-x-1 rounded-full bg-slate-200/50 p-1 dark:bg-slate-800">
                            {['all', 'book', 'course'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => handleTabChange(tab)}
                                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                                        activeTab === tab
                                            ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                    }`}
                                >
                                    {tab === 'all'
                                        ? 'Todos'
                                        : tab === 'book'
                                          ? 'Libros'
                                          : 'Cursos'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* GRID DE PRODUCTOS */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {products.data.map((product) => {
                        const isBook = product.type === 'book';
                        return (
                            <div
                                key={product.id}
                                className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm transition-all hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900"
                            >
                                <div
                                    className={`relative h-52 overflow-hidden ${isBook ? 'bg-yellow-50' : 'bg-blue-100'} dark:bg-slate-800`}
                                >
                                    <span
                                        className={`absolute top-4 left-4 z-10 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold backdrop-blur dark:bg-slate-900/90 ${isBook ? 'text-yellow-600 dark:text-yellow-500' : 'text-blue-600 dark:text-blue-400'}`}
                                    >
                                        {isBook ? (
                                            <BookOpen size={14} />
                                        ) : (
                                            <Video size={14} />
                                        )}
                                        {isBook ? 'PDF' : 'CURSO'}
                                    </span>
                                    {product.thumbnail ? (
                                        <img
                                            src={`/storage/${product.thumbnail}`}
                                            alt={product.title}
                                            className="h-full w-full object-cover object-[center_30%] transition-transform group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                                            Sin portada
                                        </div>
                                    )}
                                </div>
                                <div className="flex h-[220px] flex-col p-8">
                                    <h3 className="mb-2 line-clamp-2 text-xl font-bold dark:text-white">
                                        {product.title}
                                    </h3>
                                    <p className="mb-4 line-clamp-2 flex-grow text-sm text-slate-500 dark:text-slate-400">
                                        {product.description}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between">
                                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                                            Bs. {product.price}
                                        </span>
                                        <Link
                                            href={`/productos/${product.id}`}
                                            className={`rounded-2xl p-3 text-white shadow-lg transition hover:opacity-90 ${brandBg}`}
                                        >
                                            <ArrowRight size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* MENSAJE VACÍO */}
                {products.data.length === 0 && (
                    <div className="mt-12 text-center text-slate-500">
                        No se encontraron productos con esos filtros.
                    </div>
                )}

                {/* PAGINACIÓN DE INERTIA */}
                {products.data.length > 0 && products.links.length > 3 && (
                    <div className="mt-12 flex justify-center">
                        <div className="flex flex-wrap items-center gap-1">
                            {products.links.map((link, index) => {
                                if (link.url === null) {
                                    return (
                                        <div
                                            key={index}
                                            className="mr-1 mb-1 rounded border border-slate-200 px-4 py-3 text-sm text-slate-400 dark:border-slate-700 dark:text-slate-600"
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    );
                                }
                                return (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        preserveScroll
                                        preserveState
                                        className={`mr-1 mb-1 rounded border px-4 py-3 text-sm transition-colors focus:border-blue-500 focus:text-blue-500 ${
                                            link.active
                                                ? 'bg-blue-600 text-white dark:border-blue-600'
                                                : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
