import { router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    BookOpen,
    Play,
    CheckCircle,
    Lock,
    Search,
} from 'lucide-react';
import { useState } from 'react';

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
    video_url: string | null;
}

interface Course {
    id: number;
    total_duration: number | null;
    description: string | null;
    requirements: string | null;
    trailer_url: string | null;
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
    userProgress: number[];
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
function getEmbedUrl(url: string): string {
    // YouTube
    const ytMatch = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    );
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

    return url;
}
function LessonRow({
    lesson,
    index,
    onSelect,
    completed,
}: {
    lesson: Lesson;
    index: number;
    onSelect: (lesson: Lesson) => void;
    completed: boolean;
}) {
    const isPreview = index === 0;

    return (
        <div
            className={`flex cursor-pointer items-center justify-between rounded-xl border px-5 py-4 transition-all duration-300 hover:shadow-sm ${
                completed
                    ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10'
                    : 'border-slate-100 bg-white hover:border-blue-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900/30'
            }`}
            onClick={() => onSelect(lesson)}
        >
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
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        fetch('/user/lesson-progress', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN':
                                    document
                                        .querySelector(
                                            'meta[name="csrf-token"]',
                                        )
                                        ?.getAttribute('content') ?? '',
                            },
                            body: JSON.stringify({ lesson_id: lesson.id }),
                        })
                            .then(() => {
                                router.reload({ preserveUrl: true });
                            })
                            .catch(() => {});
                    }}
                    className={`rounded-full p-1 transition ${completed ? 'text-emerald-500 hover:text-emerald-600' : 'text-slate-300 hover:text-slate-400'}`}
                    title={
                        completed
                            ? 'Marcar como no completada'
                            : 'Marcar como completada'
                    }
                >
                    <CheckCircle size={18} />
                </button>
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
    const { product, userProgress } = usePage<PageProps>().props;
    const course = product.course;
    const lessons = course?.lessons ?? [];
    const [lessonSearch, setLessonSearch] = useState('');
    const filteredLessons = lessons
        .sort((a, b) => a.order_number - b.order_number)
        .filter((l) =>
            l.title.toLowerCase().includes(lessonSearch.toLowerCase()),
        );
    const lessonCount = lessons.length;
    const completedCount = userProgress.length;
    const progressPercent =
        lessonCount > 0 ? Math.round((completedCount / lessonCount) * 100) : 0;
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

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
                        {/* Reproductor */}
                        {selectedLesson && selectedLesson.video_url && (
                            <div className="mb-8">
                                <div className="overflow-hidden rounded-2xl bg-black shadow-xl">
                                    {selectedLesson.video_url.startsWith(
                                        'http',
                                    ) ? (
                                        <iframe
                                            src={getEmbedUrl(
                                                selectedLesson.video_url,
                                            )}
                                            className="aspect-video w-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <video
                                            src={`/storage/${selectedLesson.video_url}`}
                                            className="aspect-video w-full"
                                            controls
                                            controlsList="nodownload"
                                        />
                                    )}
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {selectedLesson.title}
                                    </p>
                                    <button
                                        onClick={() => setSelectedLesson(null)}
                                        className="text-sm text-slate-400 hover:text-slate-600"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* Barra de progreso */}
                        {userProgress.length > 0 && (
                            <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                        Tu progreso
                                    </span>
                                    <span className="font-bold text-emerald-600">
                                        {progressPercent}%
                                    </span>
                                </div>
                                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                    <div
                                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                                <p className="mt-2 text-xs text-slate-400">
                                    {completedCount} de {lessonCount} lecciones
                                    completadas
                                </p>
                            </div>
                        )}

                        {/* Temario */}
                        <div>
                            <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                                Temario
                            </h2>
                            {/* Buscador */}
                            <div className="relative mb-4">
                                <Search
                                    size={14}
                                    className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Buscar lección..."
                                    value={lessonSearch}
                                    onChange={(e) =>
                                        setLessonSearch(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-4 pl-9 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                />
                            </div>
                            <div className="space-y-3">
                                {filteredLessons.map((lesson, index) => (
                                    <LessonRow
                                        key={lesson.id}
                                        lesson={lesson}
                                        index={index}
                                        onSelect={setSelectedLesson}
                                        completed={userProgress.includes(
                                            lesson.id,
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha — sticky */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                            {/* Thumbnail / Trailer */}
                            <div className="relative h-48 overflow-hidden bg-blue-100 dark:bg-slate-800">
                                {course?.trailer_url ? (
                                    <iframe
                                        src={getEmbedUrl(course.trailer_url)}
                                        className="h-full w-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : product.thumbnail ? (
                                    <img
                                        src={`/storage/${product.thumbnail}`}
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
