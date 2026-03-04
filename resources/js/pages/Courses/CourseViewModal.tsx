import {
    X,
    Video,
    Tag,
    DollarSign,
    FileText,
    Clock,
    BookOpen,
    Pencil,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { CourseForEdit } from './CourseFormModal';
import type { Category } from './Index';
import CourseFormModal from './CourseFormModal';

interface Props {
    courseId: number | null;
    onClose: () => void;
    categories: Category[];
}

function formatDuration(minutes: number | null): string {
    if (!minutes || minutes <= 0) return '—';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
}

export default function CourseViewModal({
    courseId,
    onClose,
    categories,
}: Props) {
    const [course, setCourse] = useState<CourseForEdit | null>(null);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (!courseId) {
            setCourse(null);
            return;
        }
        setLoading(true);
        fetch(`/admin/courses-admin/${courseId}`)
            .then((r) => r.json())
            .then((data) => {
                setCourse(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [courseId]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !editing) onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [editing]);

    if (!courseId) return null;

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
                            <Video className="h-5 w-5 text-blue-600" />
                            <h2 className="text-lg font-semibold">
                                Detalle del Curso
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
                                className="ml-1 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100"
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

                        {!loading && course && (
                            <div className="space-y-5">
                                {/* Thumbnail + título + estado */}
                                <div className="flex gap-4">
                                    {course.thumbnail ? (
                                        <img
                                            src={`/storage/${course.thumbnail}`}
                                            alt={course.title}
                                            className="h-24 w-32 flex-shrink-0 rounded-xl object-cover shadow"
                                        />
                                    ) : (
                                        <div className="flex h-24 w-32 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                                            <Video className="h-8 w-8 text-blue-200" />
                                        </div>
                                    )}
                                    <div className="flex flex-col justify-center gap-2">
                                        <h3 className="text-lg leading-tight font-bold">
                                            {course.title}
                                        </h3>
                                        <span
                                            className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${course.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${course.is_active ? 'bg-emerald-500' : 'bg-red-400'}`}
                                            />
                                            {course.is_active
                                                ? 'Activo'
                                                : 'Inactivo'}
                                        </span>
                                    </div>
                                </div>

                                {/* Info grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl bg-slate-50 px-4 py-3">
                                        <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-500">
                                            <DollarSign className="h-3.5 w-3.5" />{' '}
                                            Precio
                                        </div>
                                        <p className="text-base font-bold">
                                            PEN.{' '}
                                            {Number(course.price).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 px-4 py-3">
                                        <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-500">
                                            <Clock className="h-3.5 w-3.5" />{' '}
                                            Duración total
                                        </div>
                                        <p className="text-base font-bold">
                                            {formatDuration(
                                                course.course?.total_duration ??
                                                    null,
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Descripción */}
                                {course.description && (
                                    <div>
                                        <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                            <FileText className="h-3.5 w-3.5" />{' '}
                                            Descripción
                                        </p>
                                        <p className="text-sm leading-relaxed">
                                            {course.description}
                                        </p>
                                    </div>
                                )}

                                {/* Requisitos */}
                                {course.course?.requirements && (
                                    <div>
                                        <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                            <Tag className="h-3.5 w-3.5" />{' '}
                                            Requisitos
                                        </p>
                                        <p className="text-sm leading-relaxed">
                                            {course.course.requirements}
                                        </p>
                                    </div>
                                )}

                                {/* Lecciones */}
                                {course.course?.lessons &&
                                    course.course.lessons.length > 0 && (
                                        <div>
                                            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                                <BookOpen className="h-3.5 w-3.5" />{' '}
                                                Lecciones (
                                                {course.course.lessons.length})
                                            </p>
                                            <div className="space-y-1.5">
                                                {course.course.lessons
                                                    .sort(
                                                        (a, b) =>
                                                            a.order_number -
                                                            b.order_number,
                                                    )
                                                    .map((lesson, i) => (
                                                        <div
                                                            key={lesson.id}
                                                            className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                                                    {i + 1}
                                                                </span>
                                                                <span className="text-sm">
                                                                    {
                                                                        lesson.title
                                                                    }
                                                                </span>
                                                            </div>
                                                            <span className="text-xs text-slate-400">
                                                                {formatDuration(
                                                                    lesson.duration,
                                                                )}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
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

            <CourseFormModal
                open={editing}
                onClose={() => setEditing(false)}
                categories={categories}
                course={course ?? undefined}
            />
        </>
    );
}
