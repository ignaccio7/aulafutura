import { Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';

export function NavBar() {
    const { auth } = usePage().props;

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                <div className="flex items-center gap-2">
                    <Link href={'/'}>
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-12 w-auto dark:brightness-110"
                        />
                    </Link>
                </div>

                <div className="hidden items-center gap-8 font-medium md:flex">
                    <Link
                        href={'/recursos'}
                        className="transition hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        Cursos y Libros
                    </Link>
                    <Link
                        href={'/suscripciones'}
                        className="transition hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        Suscripciones
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {auth?.user ? (
                        <Link
                            href={dashboard()}
                            className={`rounded-full bg-primary-500 px-6 py-2 font-semibold text-white shadow-md transition hover:scale-105`}
                        >
                            Mi Panel
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="flex flex-row items-center gap-1 font-medium text-slate-600 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                            >
                                Ingresar
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
