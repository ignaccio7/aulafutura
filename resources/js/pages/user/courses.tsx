import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { PlayCircle, BookOpen } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Mi Dashboard', href: '/user/dashboard' },
    { title: 'Mis Cursos', href: '/user/courses' },
];

interface CourseItem {
    id: number;
    title: string;
    thumbnail: string | null;
    description: string | null;
}

interface Props {
    courses: CourseItem[];
}

export default function UserCourses({ courses }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mis Cursos" />

            <div className="flex flex-col gap-8 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Mis Cursos
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {courses.length > 0
                                ? `Tienes acceso a ${courses.length} curso${courses.length !== 1 ? 's' : ''} con tu plan.`
                                : 'Continúa tu aprendizaje donde lo dejaste.'}
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <BookOpen className="h-12 w-12 text-green-500/20" />
                    </div>
                </div>

                {courses.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-md"
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-video overflow-hidden bg-muted">
                                    {course.thumbnail ? (
                                        <img
                                            src={`/storage/${course.thumbnail}`}
                                            alt={course.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-emerald-50 dark:bg-emerald-900/20">
                                            <PlayCircle className="h-16 w-16 text-emerald-200 dark:text-emerald-800" />
                                        </div>
                                    )}
                                    {/* Overlay play */}
                                    <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/20 opacity-0 transition-opacity hover:bg-black/40 hover:opacity-100">
                                        <PlayCircle className="h-16 w-16 text-white drop-shadow-lg" />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex flex-1 flex-col p-5">
                                    <h3 className="line-clamp-2 text-xl leading-tight font-bold">
                                        {course.title}
                                    </h3>
                                    {course.description && (
                                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                            {course.description}
                                        </p>
                                    )}

                                    {/* Botón — lo conectará quien maneje el módulo de cursos */}
                                    <Link
                                        href={`/courses/${course.id}`}
                                        className="group mt-5 mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                                    >
                                        Ir al curso
                                        <PlayCircle className="h-4 w-4 transition-transform group-hover:scale-110" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed py-20 text-center">
                        <PlayCircle className="mb-4 h-16 w-16 text-muted-foreground/30" />
                        <h2 className="text-xl font-semibold">
                            Tu plan no incluye cursos
                        </h2>
                        <p className="mt-2 max-w-sm text-muted-foreground">
                            Actualiza tu plan para acceder a nuestros cursos y
                            potenciar tu aprendizaje.
                        </p>
                        <Link
                            href="/suscripciones"
                            className="mt-6 rounded-full bg-green-600 px-6 py-2 font-medium text-white transition-colors hover:bg-green-700"
                        >
                            Ver planes
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
