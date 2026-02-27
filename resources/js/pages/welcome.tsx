import { dashboard, login, register } from '@/routes';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Video,
    Star,
    CheckCircle,
    MessageCircle,
    HelpCircle,
    ArrowRight,
    LogIn,
} from 'lucide-react';

import PublicLayout from '@/layouts/public-layout';
import Catalog from '@/components/Catalog';
import { NavBar } from '@/components/nav-bar';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth, products, filters } = usePage().props;

    // Colores del logo para reutilizar
    const brandBlue = 'text-[#1D4ED8] dark:text-blue-500';
    const brandBg = 'bg-[#1D4ED8] dark:bg-blue-600';

    return (
        <PublicLayout>
            <div className="dark:bg-slate-950 dark:text-slate-100">
                {/* --- HERO SECTION --- */}
                <section className="overflow-hidden bg-gradient-to-b from-blue-50 to-white px-6 pt-32 pb-20 dark:from-slate-900 dark:to-slate-950">
                    <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
                        <div className="animate-in space-y-8 duration-1000 fade-in slide-in-from-left">
                            <h1 className="font-primary text-5xl leading-tight font-bold md:text-6xl">
                                Formando hoy la{' '}
                                <span className={brandBlue}>
                                    educación del mañana
                                </span>
                            </h1>
                            <p className="max-w-lg font-base text-lg font-light text-slate-600 dark:text-slate-400">
                                Material educativo diseñado para despertar la
                                curiosidad de los más pequeños. Cursos
                                interactivos y libros digitales creados por
                                expertos.
                            </p>
                            <div className="flex gap-4">
                                <a
                                    href="#catalogo"
                                    className={`flex items-center gap-2 rounded-full px-8 py-4 font-bold text-white transition-all hover:-translate-y-1 hover:shadow-lg ${brandBg}`}
                                >
                                    Ver Catálogo <ArrowRight size={20} />
                                </a>
                            </div>
                        </div>
                        <div className="relative animate-in duration-1000 zoom-in">
                            <div className="absolute -top-10 -right-10 -z-10 z-40 h-64 w-64 rounded-full bg-yellow-200/50 blur-3xl dark:bg-blue-600/20"></div>
                            <img
                                src="https://illustrations.popsy.co/blue/studying.svg"
                                alt="Niño estudiando"
                                className="mx-auto w-full max-w-md rounded-full drop-shadow-2xl dark:bg-gray-100 dark:brightness-90"
                            />
                        </div>
                    </div>
                </section>
                <PublicLayout>
                    <div className="dark:bg-slate-950 dark:text-slate-100">
                        {/* --- HERO SECTION --- */}
                        <section className="overflow-hidden bg-gradient-to-b from-blue-50 to-white px-6 pt-32 pb-20 dark:from-slate-900 dark:to-slate-950">
                            <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
                                <div className="animate-in space-y-8 duration-1000 fade-in slide-in-from-left">
                                    <h1 className="font-primary text-5xl leading-tight font-bold md:text-6xl">
                                        Formando hoy la{' '}
                                        <span className={brandBlue}>
                                            educación del mañana
                                        </span>
                                    </h1>
                                    <p className="max-w-lg font-base text-lg font-light text-slate-600 dark:text-slate-400">
                                        Material educativo diseñado para
                                        despertar la curiosidad de los más
                                        pequeños. Cursos interactivos y libros
                                        digitales creados por expertos.
                                    </p>
                                    <div className="flex gap-4">
                                        <a
                                            href="#catalogo"
                                            className={`flex items-center gap-2 rounded-full px-8 py-4 font-bold text-white transition-all hover:-translate-y-1 hover:shadow-lg ${brandBg}`}
                                        >
                                            Ver Catálogo{' '}
                                            <ArrowRight size={20} />
                                        </a>
                                    </div>
                                </div>
                                <div className="relative animate-in duration-1000 zoom-in">
                                    <div className="absolute -top-10 -right-10 -z-10 z-40 h-64 w-64 rounded-full bg-yellow-200/50 blur-3xl dark:bg-blue-600/20"></div>
                                    <img
                                        src="https://illustrations.popsy.co/blue/studying.svg"
                                        alt="Niño estudiando"
                                        className="mx-auto w-full max-w-md rounded-full drop-shadow-2xl dark:bg-gray-100 dark:brightness-90"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* --- SECCIÓN BENEFICIOS --- */}
                        <section
                            id="beneficios"
                            className="px-6 py-24 dark:bg-slate-950"
                        >
                            <div className="mx-auto mb-16 max-w-7xl text-center">
                                <h2 className="mb-4 font-primary text-2xl font-semibold dark:text-white">
                                    ¿Por qué elegirnos?
                                </h2>
                                <div className="mx-auto h-1.5 w-20 rounded-full bg-blue-500"></div>
                            </div>
                            <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
                                {[
                                    {
                                        title: 'Contenido Seguro',
                                        desc: 'Material filtrado y apto para todas las edades infantiles.',
                                        icon: (
                                            <CheckCircle className="text-green-500" />
                                        ),
                                    },
                                    {
                                        title: 'Aprendizaje Divertido',
                                        desc: 'Metodologías lúdicas que mantienen el interés del niño.',
                                        icon: (
                                            <Star className="fill-yellow-500 text-yellow-500" />
                                        ),
                                    },
                                    {
                                        title: 'Acceso de por vida',
                                        desc: 'Compra una vez y accede al material cuando quieras.',
                                        icon: (
                                            <BookOpen className="text-blue-500" />
                                        ),
                                    },
                                ].map((b, i) => (
                                    <div
                                        key={i}
                                        className="group rounded-3xl border border-transparent bg-slate-50 p-8 transition-all hover:border-blue-100 hover:bg-white hover:shadow-xl dark:bg-slate-900/50 dark:hover:border-blue-900/30 dark:hover:bg-slate-900"
                                    >
                                        <div className="mb-4 w-fit rounded-2xl bg-white p-3 shadow-sm transition-transform group-hover:scale-110 dark:bg-slate-800">
                                            {b.icon}
                                        </div>
                                        <h3 className="mb-2 text-xl font-bold dark:text-white">
                                            {b.title}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            {b.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                        {/* --- SECCIÓN BENEFICIOS --- */}
                        <section
                            id="beneficios"
                            className="px-6 py-24 dark:bg-slate-950"
                        >
                            <div className="mx-auto mb-16 max-w-7xl text-center">
                                <h2 className="mb-4 font-primary text-2xl font-semibold dark:text-white">
                                    ¿Por qué elegirnos?
                                </h2>
                                <div className="mx-auto h-1.5 w-20 rounded-full bg-blue-500"></div>
                            </div>
                            <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
                                {[
                                    {
                                        title: 'Contenido Seguro',
                                        desc: 'Material filtrado y apto para todas las edades infantiles.',
                                        icon: (
                                            <CheckCircle className="text-green-500" />
                                        ),
                                    },
                                    {
                                        title: 'Aprendizaje Divertido',
                                        desc: 'Metodologías lúdicas que mantienen el interés del niño.',
                                        icon: (
                                            <Star className="fill-yellow-500 text-yellow-500" />
                                        ),
                                    },
                                    {
                                        title: 'Acceso de por vida',
                                        desc: 'Compra una vez y accede al material cuando quieras.',
                                        icon: (
                                            <BookOpen className="text-blue-500" />
                                        ),
                                    },
                                ].map((b, i) => (
                                    <div
                                        key={i}
                                        className="group rounded-3xl border border-transparent bg-slate-50 p-8 transition-all hover:border-blue-100 hover:bg-white hover:shadow-xl dark:bg-slate-900/50 dark:hover:border-blue-900/30 dark:hover:bg-slate-900"
                                    >
                                        <div className="mb-4 w-fit rounded-2xl bg-white p-3 shadow-sm transition-transform group-hover:scale-110 dark:bg-slate-800">
                                            {b.icon}
                                        </div>
                                        <h3 className="mb-2 text-xl font-bold dark:text-white">
                                            {b.title}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            {b.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* LIBROS DESTACADOS */}
                        <section
                            id="catalogo"
                            className="bg-slate-50 px-6 py-24 dark:bg-slate-900/30"
                        >
                            <div className="mx-auto max-w-7xl">
                                <div className="mb-12 flex items-end justify-between">
                                    <div>
                                        <h2 className="mb-2 text-4xl font-bold text-slate-900 dark:text-white">
                                            Nuestros Destacados
                                        </h2>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            Lo más popular entre nuestra
                                            comunidad de padres.
                                        </p>
                                    </div>
                                    <Link
                                        href={'/recursos'}
                                        className="flex items-center gap-1 font-bold text-blue-600 hover:underline dark:text-blue-400"
                                    >
                                        Ver todo el catálogo
                                    </Link>
                                </div>

                                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                    {/* Mock de Producto 1 - Curso */}
                                    <div className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm transition-all hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                                        <div className="relative h-52 overflow-hidden bg-blue-100 dark:bg-slate-800">
                                            <span className="absolute top-4 left-4 z-10 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold backdrop-blur dark:bg-slate-900/90 dark:text-blue-400">
                                                <Video
                                                    size={14}
                                                    className="text-blue-600 dark:text-blue-400"
                                                />{' '}
                                                CURSO
                                            </span>
                                            <img
                                                src="/images/chips.jpeg"
                                                className="h-full w-full object-cover object-[center_30%] transition-transform group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="p-8">
                                            <h3 className="mb-2 text-xl font-bold dark:text-white">
                                                Chips y el largo camino a
                                                primavera
                                            </h3>
                                            <div className="mb-6 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Star
                                                        size={14}
                                                        className="fill-yellow-400 text-yellow-400"
                                                    />{' '}
                                                    4.9
                                                </span>
                                                <span>2 Lecciones</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-black text-slate-900 dark:text-white">
                                                    S/ 29.99
                                                </span>
                                                <Link
                                                    href={
                                                        '/libro/chips-y-el-largo-camino-a-primavera'
                                                    }
                                                    className={`rounded-2xl bg-primary-500 p-3 text-white shadow-lg transition hover:opacity-90`}
                                                >
                                                    <ArrowRight size={20} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mock de Producto 2 - Libro */}
                                    <div className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm transition-all hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                                        <div className="relative h-52 overflow-hidden bg-yellow-50 dark:bg-slate-800">
                                            <span className="absolute top-4 left-4 z-10 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold backdrop-blur dark:bg-slate-900/90 dark:text-yellow-500">
                                                <BookOpen
                                                    size={14}
                                                    className="text-yellow-600 dark:text-yellow-500"
                                                />{' '}
                                                PDF
                                            </span>
                                            <img
                                                src="/images/melgarejo.jpeg"
                                                className="h-full w-full object-cover object-[center_30%] transition-transform group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="p-8">
                                            <h3 className="mb-2 text-xl font-bold dark:text-white">
                                                Melgarejo
                                            </h3>
                                            <p className="mb-6 text-sm text-slate-500 italic dark:text-slate-400">
                                                Libro de ejercicios
                                                interactivos.
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-black text-slate-900 dark:text-white">
                                                    S/ 15.00
                                                </span>
                                                <button
                                                    className={`rounded-2xl bg-primary-500 p-3 text-white shadow-lg transition hover:opacity-90`}
                                                >
                                                    <ArrowRight size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* --- TESTIMONIOS --- */}
                        <section className="overflow-hidden px-6 py-24 dark:bg-slate-950">
                            <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 md:flex-row">
                                <div className="md:w-1/3">
                                    <h2 className="mb-4 text-4xl font-bold dark:text-white">
                                        Lo que dicen los padres
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Únete a más de 500 familias que confían
                                        en nosotros.
                                    </p>
                                </div>
                                <div className="flex snap-x gap-6 overflow-x-auto pb-8 md:w-2/3">
                                    {[1, 2].map((t) => (
                                        <div
                                            key={t}
                                            className="min-w-[320px] snap-center rounded-[2rem] bg-blue-50 p-8 dark:bg-slate-900"
                                        >
                                            <div className="mb-4 flex gap-1 text-yellow-400">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        size={16}
                                                        fill="currentColor"
                                                    />
                                                ))}
                                            </div>
                                            <p className="mb-6 text-slate-700 italic dark:text-slate-300">
                                                "El material de AF Educación
                                                cambió la forma en que mi hijo
                                                ve las tareas. Ahora pregunta
                                                cuándo le toca ver su curso."
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-blue-200 dark:bg-slate-700"></div>
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                    María García
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                        {/* --- TESTIMONIOS --- */}
                        <section className="overflow-hidden px-6 py-24 dark:bg-slate-950">
                            <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 md:flex-row">
                                <div className="md:w-1/3">
                                    <h2 className="mb-4 text-4xl font-bold dark:text-white">
                                        Lo que dicen los padres
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Únete a más de 500 familias que confían
                                        en nosotros.
                                    </p>
                                </div>
                                <div className="flex snap-x gap-6 overflow-x-auto pb-8 md:w-2/3">
                                    {[1, 2].map((t) => (
                                        <div
                                            key={t}
                                            className="min-w-[320px] snap-center rounded-[2rem] bg-blue-50 p-8 dark:bg-slate-900"
                                        >
                                            <div className="mb-4 flex gap-1 text-yellow-400">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        size={16}
                                                        fill="currentColor"
                                                    />
                                                ))}
                                            </div>
                                            <p className="mb-6 text-slate-700 italic dark:text-slate-300">
                                                "El material de AF Educación
                                                cambió la forma en que mi hijo
                                                ve las tareas. Ahora pregunta
                                                cuándo le toca ver su curso."
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-blue-200 dark:bg-slate-700"></div>
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                    María García
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* --- FAQ --- */}
                        <section
                            id="faq"
                            className="bg-slate-50 px-6 py-24 dark:bg-slate-900/30"
                        >
                            <div className="mx-auto max-w-3xl">
                                <h2 className="mb-12 text-center text-3xl font-bold dark:text-white">
                                    Preguntas Frecuentes
                                </h2>
                                <div className="space-y-4">
                                    {[
                                        {
                                            q: '¿Cómo accedo a los cursos?',
                                            a: 'Una vez realizada la compra, recibirás un correo electrónico con tus credenciales de acceso al dashboard de estudiante.',
                                        },
                                        {
                                            q: '¿Los libros PDF tienen caducidad?',
                                            a: 'No, una vez que descargas el PDF es tuyo para siempre.',
                                        },
                                    ].map((item, i) => (
                                        <details
                                            key={i}
                                            className="group cursor-pointer rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all open:shadow-md dark:border-slate-800 dark:bg-slate-900"
                                        >
                                            <summary className="flex list-none items-center justify-between font-bold text-slate-800 dark:text-white">
                                                {item.q}
                                                <HelpCircle className="text-blue-500 transition-transform group-open:rotate-180 dark:text-blue-400" />
                                            </summary>
                                            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">
                                                {item.a}
                                            </p>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        </section>
                        {/* --- FAQ --- */}
                        <section
                            id="faq"
                            className="bg-slate-50 px-6 py-24 dark:bg-slate-900/30"
                        >
                            <div className="mx-auto max-w-3xl">
                                <h2 className="mb-12 text-center text-3xl font-bold dark:text-white">
                                    Preguntas Frecuentes
                                </h2>
                                <div className="space-y-4">
                                    {[
                                        {
                                            q: '¿Cómo accedo a los cursos?',
                                            a: 'Una vez realizada la compra, recibirás un correo electrónico con tus credenciales de acceso al dashboard de estudiante.',
                                        },
                                        {
                                            q: '¿Los libros PDF tienen caducidad?',
                                            a: 'No, una vez que descargas el PDF es tuyo para siempre.',
                                        },
                                    ].map((item, i) => (
                                        <details
                                            key={i}
                                            className="group cursor-pointer rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all open:shadow-md dark:border-slate-800 dark:bg-slate-900"
                                        >
                                            <summary className="flex list-none items-center justify-between font-bold text-slate-800 dark:text-white">
                                                {item.q}
                                                <HelpCircle className="text-blue-500 transition-transform group-open:rotate-180 dark:text-blue-400" />
                                            </summary>
                                            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">
                                                {item.a}
                                            </p>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* --- FOOTER --- */}
                        <footer className="bg-slate-900 px-6 py-16 text-slate-400 dark:bg-black">
                            <div className="mx-auto mb-12 grid max-w-7xl gap-12 border-b border-slate-800 pb-12 md:grid-cols-4">
                                <div className="col-span-1 space-y-4 md:col-span-2">
                                    <img
                                        src="/logo.png"
                                        className="h-10 opacity-50 grayscale invert"
                                    />
                                    <p className="max-w-xs">
                                        Educando a las nuevas generaciones con
                                        tecnología y valores.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="mb-6 text-sm font-bold tracking-widest text-white uppercase">
                                        Plataforma
                                    </h4>
                                    <ul className="space-y-4 text-sm">
                                        <li>
                                            <a
                                                href="#"
                                                className="transition hover:text-white"
                                            >
                                                Cursos
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                className="transition hover:text-white"
                                            >
                                                Libros PDF
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="mb-6 text-sm font-bold tracking-widest text-white uppercase">
                                        Legal
                                    </h4>
                                    <ul className="space-y-4 text-sm">
                                        <li>
                                            <a
                                                href="#"
                                                className="transition hover:text-white"
                                            >
                                                Privacidad
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-xs md:flex-row">
                                <p>
                                    © 2026 AulaFutura. Todos los derechos
                                    reservados.
                                </p>
                            </div>
                        </footer>
                        {/* --- FOOTER --- */}
                        <footer className="bg-slate-900 px-6 py-16 text-slate-400 dark:bg-black">
                            <div className="mx-auto mb-12 grid max-w-7xl gap-12 border-b border-slate-800 pb-12 md:grid-cols-4">
                                <div className="col-span-1 space-y-4 md:col-span-2">
                                    <img
                                        src="/logo.png"
                                        className="h-10 opacity-50 grayscale invert"
                                    />
                                    <p className="max-w-xs">
                                        Educando a las nuevas generaciones con
                                        tecnología y valores.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="mb-6 text-sm font-bold tracking-widest text-white uppercase">
                                        Plataforma
                                    </h4>
                                    <ul className="space-y-4 text-sm">
                                        <li>
                                            <a
                                                href="#"
                                                className="transition hover:text-white"
                                            >
                                                Cursos
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                className="transition hover:text-white"
                                            >
                                                Libros PDF
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="mb-6 text-sm font-bold tracking-widest text-white uppercase">
                                        Legal
                                    </h4>
                                    <ul className="space-y-4 text-sm">
                                        <li>
                                            <a
                                                href="#"
                                                className="transition hover:text-white"
                                            >
                                                Privacidad
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-xs md:flex-row">
                                <p>
                                    © 2026 AulaFutura. Todos los derechos
                                    reservados.
                                </p>
                            </div>
                        </footer>

                        {/* BOTÓN WHATSAPP FLOTANTE */}
                        <a
                            href="https://wa.me/tu_numero"
                            target="_blank"
                            className="fixed right-8 bottom-8 z-50 rounded-full border-none bg-[#25D366] p-4 text-white shadow-2xl transition-all hover:scale-110 active:scale-95"
                        >
                            <MessageCircle size={32} fill="currentColor" />
                        </a>
                    </div>
                </PublicLayout>
                {/* BOTÓN WHATSAPP FLOTANTE */}
                <a
                    href="https://wa.me/tu_numero"
                    target="_blank"
                    className="fixed right-8 bottom-8 z-50 rounded-full border-none bg-[#25D366] p-4 text-white shadow-2xl transition-all hover:scale-110 active:scale-95"
                >
                    <MessageCircle size={32} fill="currentColor" />
                </a>
            </div>
        </PublicLayout>
    );
}
