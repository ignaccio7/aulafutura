import { useForm } from '@inertiajs/react';
import { X, Upload, Video, Trash2, Plus, GripVertical } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Category, Lesson } from './Index';

export interface CourseForEdit {
    id: number;
    title: string;
    description: string;
    price: number;
    category_id: number;
    is_active: boolean | number;
    thumbnail: string | null;
    course?: {
        id: number;
        total_duration: number;
        description: string | null;
        requirements: string | null;
        trailer_url: string | null;
        lessons: Lesson[];
    };
}

interface Props {
    open: boolean;
    onClose: () => void;
    categories: Category[];
    course?: CourseForEdit | null;
}

export default function CourseFormModal({
    open,
    onClose,
    categories,
    course,
}: Props) {
    const isEdit = !!course;

    const { data, setData, post, processing, errors, reset } = useForm<{
        title: string;
        description: string;
        price: string;
        category_id: string;
        is_active: boolean;
        thumbnail: File | null;
        requirements: string;
        trailer_url: string;
        lessons: {
            title: string;
            duration: string;
            order_number: number;
            video_url: string;
        }[];
    }>({
        title: course?.title ?? '',
        description: course?.description ?? '',
        price: course ? String(course.price) : '',
        category_id: course ? String(course.category_id) : '',
        is_active: course ? Boolean(course.is_active) : true,
        thumbnail: null,
        requirements: course?.course?.requirements ?? '',
        trailer_url: course?.course?.trailer_url ?? '',
        lessons:
            course?.course?.lessons?.map((l) => ({
                title: l.title,
                duration: String(l.duration),
                order_number: l.order_number,
                video_url: l.video_url ?? '',
            })) ?? [],
    });

    useEffect(() => {
        if (open) {
            setData({
                title: course?.title ?? '',
                description: course?.description ?? '',
                price: course ? String(course.price) : '',
                category_id: course ? String(course.category_id) : '',
                is_active: course ? Boolean(course.is_active) : true,
                thumbnail: null,
                requirements: course?.course?.requirements ?? '',
                lessons:
                    course?.course?.lessons?.map((l) => ({
                        title: l.title,
                        duration: String(l.duration),
                        order_number: l.order_number,
                        video_url: l.video_url ?? '',
                    })) ?? [],
            });
        }
    }, [open, course?.id]);

    const thumbnailRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEdit
            ? `/admin/courses-admin/${course!.id}`
            : '/admin/courses-admin';
        post(url, {
            forceFormData: true,
            onSuccess: () => handleClose(),
        });
    };

    // Lecciones
    const addLesson = () => {
        setData('lessons', [
            ...data.lessons,
            {
                title: '',
                duration: '',
                order_number: data.lessons.length + 1,
                video_url: '',
            },
        ]);
    };

    const removeLesson = (index: number) => {
        setData(
            'lessons',
            data.lessons
                .filter((_, i) => i !== index)
                .map((l, i) => ({ ...l, order_number: i + 1 })),
        );
    };

    const updateLesson = (index: number, field: string, value: string) => {
        const updated = [...data.lessons];
        updated[index] = { ...updated[index], [field]: value };
        setData('lessons', updated);
    };

    if (!open) return null;

    const inputClass = (hasError: boolean) =>
        `w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-100 ${
            hasError
                ? 'border-red-400'
                : 'border-gray-200 focus:border-blue-400'
        }`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div
                className="absolute inset-0 backdrop-blur-sm"
                onClick={handleClose}
            />

            <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Video className="h-5 w-5 text-blue-600" />
                        <h2 className="text-lg font-semibold">
                            {isEdit ? 'Editar Curso' : 'Nuevo Curso'}
                        </h2>
                        {isEdit && (
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                                #{course!.id}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleClose}
                        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-5">
                        {/* Título */}
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Título <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="Ej: Laravel desde cero"
                                className={inputClass(!!errors.title)}
                            />
                            {errors.title && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Descripción
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                rows={3}
                                placeholder="Breve descripción del curso..."
                                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Precio + Categoría */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Precio{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm">
                                        Bs.
                                    </span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) =>
                                            setData('price', e.target.value)
                                        }
                                        placeholder="0.00"
                                        className={`w-full rounded-lg border py-2 pr-3 pl-10 text-sm transition outline-none focus:ring-2 focus:ring-blue-100 ${errors.price ? 'border-red-400' : 'border-gray-200 focus:border-blue-400'}`}
                                    />
                                </div>
                                {errors.price && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.price}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Categoría{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) =>
                                        setData('category_id', e.target.value)
                                    }
                                    className={inputClass(!!errors.category_id)}
                                >
                                    <option value="">Seleccionar...</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.category_id}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Requisitos */}
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Requisitos
                            </label>
                            <textarea
                                value={data.requirements}
                                onChange={(e) =>
                                    setData('requirements', e.target.value)
                                }
                                rows={2}
                                placeholder="Ej: No se requieren conocimientos previos..."
                                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Trailer URL */}
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                URL del Trailer
                            </label>
                            <input
                                type="text"
                                value={data.trailer_url}
                                onChange={(e) =>
                                    setData('trailer_url', e.target.value)
                                }
                                placeholder="https://youtube.com/..."
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Thumbnail */}
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Portada (imagen)
                            </label>
                            {isEdit && course!.thumbnail && !data.thumbnail && (
                                <div className="mb-2 flex items-center gap-3 rounded-lg border border-gray-200 p-2">
                                    <img
                                        src={`/storage/${course!.thumbnail}`}
                                        alt="Portada actual"
                                        className="h-14 w-20 rounded object-cover"
                                    />
                                    <span className="text-xs text-gray-400">
                                        Selecciona una nueva para reemplazarla
                                    </span>
                                </div>
                            )}
                            <div
                                onClick={() => thumbnailRef.current?.click()}
                                className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 transition hover:border-blue-400 hover:bg-blue-50/50"
                            >
                                <Upload className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">
                                    {data.thumbnail
                                        ? data.thumbnail.name
                                        : 'JPG, PNG, WEBP — máx. 2 MB'}
                                </span>
                                {data.thumbnail && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setData('thumbnail', null);
                                            if (thumbnailRef.current)
                                                thumbnailRef.current.value = '';
                                        }}
                                        className="ml-auto text-red-400 hover:text-red-600"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                            <input
                                ref={thumbnailRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                    setData(
                                        'thumbnail',
                                        e.target.files?.[0] ?? null,
                                    )
                                }
                            />
                        </div>

                        {/* Lecciones */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-sm font-medium">
                                    Lecciones
                                </label>
                                <button
                                    type="button"
                                    onClick={addLesson}
                                    className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Agregar lección
                                </button>
                            </div>

                            <div className="space-y-2">
                                {data.lessons.map((lesson, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                                    >
                                        <GripVertical className="h-4 w-4 flex-shrink-0 text-gray-300" />
                                        <span className="w-6 text-center text-xs font-bold text-gray-400">
                                            {index + 1}
                                        </span>
                                        <input
                                            type="text"
                                            value={lesson.title}
                                            onChange={(e) =>
                                                updateLesson(
                                                    index,
                                                    'title',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Título de la lección"
                                            className="flex-1 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-blue-400"
                                        />

                                        <input
                                            type="text"
                                            value={lesson.video_url ?? ''}
                                            onChange={(e) =>
                                                updateLesson(
                                                    index,
                                                    'video_url',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="URL del video"
                                            className="flex-1 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-blue-400"
                                        />
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="number"
                                                min="1"
                                                value={lesson.duration}
                                                onChange={(e) =>
                                                    updateLesson(
                                                        index,
                                                        'duration',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Min"
                                                className="w-16 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-blue-400"
                                            />
                                            <span className="text-xs text-gray-400">
                                                min
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeLesson(index)}
                                            className="text-red-400 transition hover:text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                {data.lessons.length === 0 && (
                                    <p className="py-4 text-center text-xs text-gray-400">
                                        No hay lecciones. Agregá al menos una.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Estado */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setData('is_active', !data.is_active)
                                }
                                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${data.is_active ? 'bg-blue-600' : 'bg-gray-200'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${data.is_active ? 'translate-x-4' : 'translate-x-0'}`}
                                />
                            </button>
                            <span className="text-sm text-gray-600">
                                {data.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                        >
                            {processing && (
                                <svg
                                    className="h-4 w-4 animate-spin"
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
                            )}
                            {processing
                                ? 'Guardando...'
                                : isEdit
                                  ? 'Guardar cambios'
                                  : 'Crear Curso'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
