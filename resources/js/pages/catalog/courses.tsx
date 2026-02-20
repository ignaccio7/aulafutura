import { router, usePage } from '@inertiajs/react';
import {
    Video,
    Clock,
    BookOpen,
    ArrowRight,
    SlidersHorizontal,
} from 'lucide-react';

// ─── Tipos ──────

interface Category {
    id: number;
    name: string;
}

interface Lesson {
    id: number;
    duration: number | null;
}

interface Course {
    id: number;
    total_duration: number | null;
    lessons: Lesson[];
}

interface Product {
    id: number;
    title: string;
    thumbnail: string | null;
    price: number;
    category: Category;
    course: Course;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedProducts {
    data: Product[];
    links: PaginationLink[];
    total: number;
    current_page: number;
    last_page: number;
}

interface Filters {
    category: number | null;
}

interface PageProps {
    products: PaginatedProducts;
    categories: Category[];
    filters: Filters;
    [key: string]: unknown;
}

// ─── Utilidades ──────

function formatDuration(minutes: number | null): string {
    if (!minutes || minutes <= 0) return '—';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
}

function formatPrice(price: number): string {
    return price === 0 ? 'Gratis' : `S/ ${Number(price).toFixed(2)}`;
}

// ─── Cards ───────

function CourseCard({ product }: { product: Product }) {
    const lessonCount = product.course?.lessons?.length ?? 0;
    const duration = product.course?.total_duration ?? null;

    return (
        <div className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm transition-all hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            {/* Thumbnail */}
            <div className="relative h-52 overflow-hidden bg-blue-100 dark:bg-slate-800">
                {/* Badge tipo */}
                <span className="absolute top-4 left-4 z-10 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold backdrop-blur dark:bg-slate-900/90 dark:text-blue-400">
                    <Video
                        size={14}
                        className="text-[#1D4ED8] dark:text-blue-400"
                    />
                    CURSO
                </span>

                {product.thumbnail ? (
                    <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                    />
                ) : (
                    /* Placeholder cuando no hay thumbnail */
                    <div className="flex h-full w-full items-center justify-center">
                        <BookOpen
                            size={48}
                            className="text-blue-200 dark:text-slate-600"
                        />
                    </div>
                )}
            </div>

            {/* Contenido */}
            <div className="p-8">
                {/* Categoría */}
                <span className="mb-2 inline-block text-xs font-semibold tracking-wide text-[#1D4ED8] uppercase dark:text-blue-400">
                    {product.category?.name ?? 'Sin categoría'}
                </span>

                {/* Título */}
                <h3 className="mb-4 line-clamp-2 text-xl leading-snug font-bold text-slate-900 dark:text-white">
                    {product.title}
                </h3>

                {/* Métricas */}
                <div className="mb-6 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatDuration(duration)}
                    </span>
                    <span className="flex items-center gap-1">
                        <BookOpen size={14} />
                        {lessonCount}{' '}
                        {lessonCount === 1 ? 'lección' : 'lecciones'}
                    </span>
                </div>

                {/* Precio + CTA */}
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                        {formatPrice(product.price)}
                    </span>
                    <button className="rounded-2xl bg-[#1D4ED8] p-3 text-white shadow-lg transition hover:opacity-90 dark:bg-blue-600">
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Filtro Categoria───────────

function CategoryFilter({
    categories,
    selected,
}: {
    categories: Category[];
    selected: number | null;
}) {
    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;
        router.get('/courses', value ? { category: value } : {}, {
            preserveState: true,
            replace: true,
        });
    }

    return (
        <div className="flex items-center gap-3">
            <SlidersHorizontal size={16} className="text-slate-400" />
            <select
                value={selected ?? ''}
                onChange={handleChange}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition focus:ring-2 focus:ring-blue-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
                <option value="">Todos los temas</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

// ─── Pagination ────────

function Pagination({ links }: { links: PaginationLink[] }) {
    if (links.length <= 3) return null;

    return (
        <nav
            className="mt-12 flex justify-center gap-2"
            aria-label="Paginación"
        >
            {links.map((link, i) => (
                <button
                    key={i}
                    disabled={!link.url}
                    onClick={() =>
                        link.url &&
                        router.visit(link.url, { preserveState: true })
                    }
                    className={[
                        'min-w-[40px] rounded-full px-4 py-2 text-sm font-semibold transition',
                        link.active
                            ? 'bg-[#1D4ED8] text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800',
                    ].join(' ')}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </nav>
    );
}

// ─── EmptyState ────────

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 rounded-full bg-blue-50 p-6 dark:bg-slate-800">
                <BookOpen
                    size={48}
                    className="text-blue-300 dark:text-slate-500"
                />
            </div>
            <p className="mb-2 text-lg font-semibold text-slate-700 dark:text-slate-300">
                {hasFilters
                    ? 'No hay cursos para esta categoría.'
                    : 'No hay cursos disponibles.'}
            </p>
            <p className="mb-6 text-sm text-slate-400">
                {hasFilters
                    ? 'Prueba con otro tema.'
                    : 'Vuelve pronto, estamos preparando contenido.'}
            </p>
            {hasFilters && (
                <button
                    onClick={() =>
                        router.get('/courses', {}, { replace: true })
                    }
                    className="rounded-full bg-[#1D4ED8] px-6 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                    Ver todos los cursos
                </button>
            )}
        </div>
    );
}

// ─── Página principal───────────────

export default function Courses() {
    const { products, categories, filters } = usePage<PageProps>().props;
    const courseList = products?.data ?? [];
    const hasFilters = filters.category !== null;

    return (
        <div className="min-h-screen bg-white font-['Instrument_Sans'] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            {/* Navbar */}
            <nav className="fixed top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    <a href="/">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-12 w-auto dark:brightness-110"
                        />
                    </a>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        Catálogo de Cursos
                    </span>
                </div>
            </nav>

            {/* Hero sección */}
            <section className="bg-gradient-to-b from-blue-50 to-white px-6 pt-32 pb-16 dark:from-slate-900 dark:to-slate-950">
                <div className="mx-auto max-w-7xl">
                    <h1 className="mb-2 font-primary text-4xl font-bold md:text-5xl">
                        Cursos Grabados
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        {products.total}{' '}
                        {products.total === 1
                            ? 'curso disponible'
                            : 'cursos disponibles'}
                    </p>
                </div>
            </section>

            {/* Contenido principal */}
            <section className="px-6 py-12 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl">
                    {/* Barra de filtros */}
                    <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
                        <CategoryFilter
                            categories={categories}
                            selected={filters.category}
                        />
                        {hasFilters && (
                            <span className="text-sm text-slate-400">
                                Filtrando por:{' '}
                                <span className="font-semibold text-[#1D4ED8] dark:text-blue-400">
                                    {
                                        categories.find(
                                            (c) => c.id === filters.category,
                                        )?.name
                                    }
                                </span>
                            </span>
                        )}
                    </div>

                    {/* Grid */}
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {courseList.length === 0 ? (
                            <EmptyState hasFilters={hasFilters} />
                        ) : (
                            courseList.map((product) => (
                                <CourseCard
                                    key={product.id}
                                    product={product}
                                />
                            ))
                        )}
                    </div>

                    {/* Paginación */}
                    <Pagination links={products.links} />
                </div>
            </section>
        </div>
    );
}
