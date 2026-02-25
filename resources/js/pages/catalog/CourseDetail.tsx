import { router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    BookOpen,
    Play,
    CheckCircle,
    Lock,
} from 'lucide-react';

// ─── Tipos ───────────

interface Category {
    id: number;
    name: string;
}

interface Lesson {
    id: number;
    title: string;
    duration: number | null;
    order_number: number;
}

interface Course {
    id: number;
    total_duration: number | null;
    description: string | null;
    requirements: string | null;
    lessons: Lesson[];
}

interface Product {
    id: number;
    title: string;
    description: string | null;
    price: number;
    thumbnail: string | null;
    category: Category;
    course: Course;
}

interface PageProps {
    product: Product;
    [key: string]: unknown;
}

// ─── Utilidades ────────

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

// ─── Componentes ────────

function LessonRow({ lesson, index }: { lesson: Lesson; index: number }) {
    const isPreview = index === 0;

    return (
        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-5 py-4 transition hover:border-blue-100 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900/30">
            <div className="flex items-center gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {isPreview ? (
                        <Play size={14} className="text-[#1D4ED8]" />
                    ) : (
                        <Lock size={14} className="text-slate-400" />
                    )}
                </span>
                <div>
                    <p
                        className={`font-medium ${isPreview ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}
                    >
                        {lesson.title}
                    </p>
                    {isPreview && (
                        <span className="text-xs font-semibold text-[#1D4ED8]">
                            Vista previa gratuita
                        </span>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-sm text-slate-400">
                    <Clock size={13} />
                    {formatDuration(lesson.duration)}
                </span>
                {!isPreview && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-400 dark:bg-slate-800">
                        Bloqueado
                    </span>
                )}
            </div>
        </div>
    );
}

// ─── Página principal ─────────

export default function CourseDetail() {
    const { product } = usePage<PageProps>().props;
    const course = product.course;
    const lessons = course?.lessons ?? [];
    const lessonCount = lessons.length;

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
                    <button
                        onClick={() => router.visit('/courses')}
                        className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#1D4ED8] dark:text-slate-400"
                    >
                        <ArrowLeft size={16} />
                        Volver al catálogo
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section className="bg-gradient-to-b from-blue-50 to-white px-6 pt-32 pb-12 dark:from-slate-900 dark:to-slate-950">
                <div className="mx-auto max-w-7xl">
                    <span className="mb-3 inline-block text-xs font-semibold tracking-wide text-[#1D4ED8] uppercase">
                        {product.category?.name}
                    </span>
                    <h1 className="mb-4 font-primary text-4xl leading-tight font-bold md:text-5xl">
                        {product.title}
                    </h1>
                    {product.description && (
                        <p className="max-w-2xl text-lg text-slate-500 dark:text-slate-400">
                            {product.description}
                        </p>
                    )}
                    <div className="mt-6 flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                            <Clock size={15} />
                            {formatDuration(course?.total_duration)}
                        </span>
                        <span className="flex items-center gap-1">
                            <BookOpen size={15} />
                            {lessonCount}{' '}
                            {lessonCount === 1 ? 'lección' : 'lecciones'}
                        </span>
                    </div>
                </div>
            </section>

            {/* Contenido */}
            <section className="px-6 py-12 dark:bg-slate-950">
                <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-3">
                    {/* Columna izquierda */}
                    <div className="space-y-10 lg:col-span-2">
                        {/* Requisitos */}
                        {course?.requirements && (
                            <div>
                                <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                                    Requisitos
                                </h2>
                                <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                                    <CheckCircle
                                        size={20}
                                        className="mt-0.5 shrink-0 text-[#1D4ED8]"
                                    />
                                    <p className="text-slate-600 dark:text-slate-400">
                                        {course.requirements}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Temario */}
                        <div>
                            <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                                Temario
                            </h2>
                            <div className="space-y-3">
                                {lessons
                                    .sort(
                                        (a, b) =>
                                            a.order_number - b.order_number,
                                    )
                                    .map((lesson, index) => (
                                        <LessonRow
                                            key={lesson.id}
                                            lesson={lesson}
                                            index={index}
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha — sticky */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                            {/* Thumbnail / Preview */}
                            <div className="relative h-48 overflow-hidden bg-blue-100 dark:bg-slate-800">
                                {product.thumbnail ? (
                                    <img
                                        src={product.thumbnail}
                                        alt={product.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 shadow-lg">
                                            <Play
                                                size={28}
                                                className="text-[#1D4ED8]"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Info y CTA */}
                            <div className="space-y-6 p-8">
                                <div>
                                    <p className="text-sm text-slate-400 dark:text-slate-500">
                                        Precio
                                    </p>
                                    <p className="text-4xl font-black text-slate-900 dark:text-white">
                                        {formatPrice(product.price)}
                                    </p>
                                </div>

                                <button className="w-full rounded-2xl bg-[#1D4ED8] py-4 font-bold text-white shadow-lg transition hover:opacity-90 dark:bg-blue-600">
                                    Comprar curso
                                </button>

                                <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                                    <p className="flex items-center gap-2">
                                        <Clock size={14} /> Duración total:{' '}
                                        {formatDuration(course?.total_duration)}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <BookOpen size={14} /> {lessonCount}{' '}
                                        {lessonCount === 1
                                            ? 'lección'
                                            : 'lecciones'}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <CheckCircle size={14} /> Acceso de por
                                        vida
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
