import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Book, Eye, BookOpen } from 'lucide-react';
import { Link } from '@inertiajs/react';

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

export default function UserBooks({ books }: Props) {
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
                                        <Link
                                            href={`/admin/books/${book.id}/preview`}
                                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2 text-sm font-semibold text-black transition-colors hover:bg-gray-100"
                                        >
                                            <Eye className="h-4 w-4" /> Leer
                                            ahora
                                        </Link>
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
                                    <div className="mt-3">
                                        <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                                            PDF
                                        </span>
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
        </AppLayout>
    );
}
