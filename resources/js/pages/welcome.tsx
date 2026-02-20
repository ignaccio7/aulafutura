import { Head, Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Video,
    Star,
    CheckCircle,
    MessageCircle,
    HelpCircle,
    ArrowRight,
} from 'lucide-react';
import { dashboard, login, register } from '@/routes';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    // Colores del logo para reutilizar
    const brandBlue = 'text-[#1D4ED8]';
    const brandBg = 'bg-[#1D4ED8]';

    return (
        <div className="min-h-screen bg-white font-['Instrument_Sans'] text-slate-900">
            <Head title="Aulafutura" />

            {/* --- NAVBAR --- */}
            <nav className="fixed top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    <div className="flex items-center gap-2">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-12 w-auto"
                        />
                    </div>

                    <div className="hidden items-center gap-8 font-medium md:flex">
                        <a
                            href="#beneficios"
                            className="transition hover:text-blue-600"
                        >
                            Beneficios
                        </a>
                        <a
                            href="#catalogo"
                            className="transition hover:text-blue-600"
                        >
                            Cursos y Libros
                        </a>
                        <a
                            href="#faq"
                            className="transition hover:text-blue-600"
                        >
                            Preguntas
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        {auth?.user ? (
                            <Link
                                href={dashboard()}
                                className={`rounded-full px-6 py-2 font-semibold text-white transition hover:scale-105 ${brandBg}`}
                            >
                                Mi Panel
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="font-medium text-slate-600 hover:text-blue-600"
                                >
                                    Entrar
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className={`rounded-full px-6 py-2 font-semibold text-white transition hover:scale-105 ${brandBg}`}
                                    >
                                        Registrarme
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="overflow-hidden bg-gradient-to-b from-blue-50 to-white px-6 pt-32 pb-20">
                <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
                    <div className="animate-in space-y-8 duration-1000 fade-in slide-in-from-left">
                        <h1 className="font-primary text-5xl leading-tight font-bold md:text-6xl">
                            Formando hoy la{' '}
                            <span className={brandBlue}>
                                educación del mañana
                            </span>
                        </h1>
                        <p className="max-w-lg font-base text-lg font-light text-slate-600">
                            Material educativo diseñado para despertar la
                            curiosidad de los más pequeños. Cursos interactivos
                            y libros digitales creados por expertos.
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
                        <div className="absolute -top-10 -right-10 -z-10 h-64 w-64 rounded-full bg-yellow-200/50 blur-3xl"></div>
                        <img
                            src="https://illustrations.popsy.co/blue/studying.svg"
                            alt="Niño estudiando"
                            className="mx-auto w-full max-w-md drop-shadow-2xl"
                        />
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN BENEFICIOS --- */}
            <section id="beneficios" className="px-6 py-24">
                <div className="mx-auto mb-16 max-w-7xl text-center">
                    <h2 className="mb-4 font-primary text-2xl font-semibold">
                        ¿Por qué elegirnos?
                    </h2>
                    <div className="mx-auto h-1.5 w-20 rounded-full bg-blue-500"></div>
                </div>
                <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
                    {[
                        {
                            title: 'Contenido Seguro',
                            desc: 'Material filtrado y apto para todas las edades infantiles.',
                            icon: <CheckCircle className="text-green-500" />,
                        },
                        {
                            title: 'Aprendizaje Divertido',
                            desc: 'Metodologías lúdicas que mantienen el interés del niño.',
                            icon: <Star className="text-yellow-500" />,
                        },
                        {
                            title: 'Acceso de por vida',
                            desc: 'Compra una vez y accede al material cuando quieras.',
                            icon: <BookOpen className="text-blue-500" />,
                        },
                    ].map((b, i) => (
                        <div
                            key={i}
                            className="group rounded-3xl border border-transparent bg-slate-50 p-8 transition-all hover:border-blue-100 hover:bg-white hover:shadow-xl"
                        >
                            <div className="mb-4 w-fit rounded-2xl bg-white p-3 shadow-sm transition-transform group-hover:scale-110">
                                {b.icon}
                            </div>
                            <h3 className="mb-2 text-xl font-bold">
                                {b.title}
                            </h3>
                            <p className="text-slate-600">{b.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- SECCIÓN DESTACADOS (Libros/Cursos) --- */}
            <section id="catalogo" className="bg-slate-50 px-6 py-24">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 flex items-end justify-between">
                        <div>
                            <h2 className="mb-2 text-4xl font-bold text-slate-900">
                                Nuestros Destacados
                            </h2>
                            <p className="text-slate-600">
                                Lo más popular entre nuestra comunidad de
                                padres.
                            </p>
                        </div>
                        <button className="flex items-center gap-1 font-bold text-blue-600 hover:underline">
                            Ver todo el catálogo
                        </button>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {/* Mock de Producto 1 - Curso */}
                        <div className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm transition-all hover:shadow-2xl">
                            <div className="relative h-52 overflow-hidden bg-blue-100">
                                <span className="absolute top-4 left-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold backdrop-blur">
                                    <Video
                                        size={14}
                                        className="text-blue-600"
                                    />{' '}
                                    CURSO
                                </span>
                                <img
                                    src="https://illustrations.popsy.co/blue/creative-work.svg"
                                    className="h-full w-full p-4 transition-transform group-hover:scale-110"
                                />
                            </div>
                            <div className="p-8">
                                <h3 className="mb-2 text-xl font-bold">
                                    Lectura Comprensiva Nivel 1
                                </h3>
                                <div className="mb-6 flex items-center gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Star
                                            size={14}
                                            className="fill-yellow-400 text-yellow-400"
                                        />{' '}
                                        4.9
                                    </span>
                                    <span>12 Lecciones</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-black text-slate-900">
                                        $29.99
                                    </span>
                                    <button
                                        className={`rounded-2xl p-3 text-white transition hover:opacity-90 ${brandBg}`}
                                    >
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mock de Producto 2 - Libro */}
                        <div className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm transition-all hover:shadow-2xl">
                            <div className="relative h-52 overflow-hidden bg-yellow-50">
                                <span className="absolute top-4 left-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold backdrop-blur">
                                    <BookOpen
                                        size={14}
                                        className="text-yellow-600"
                                    />{' '}
                                    PDF
                                </span>
                                <img
                                    src="https://illustrations.popsy.co/blue/reading-side.svg"
                                    className="h-full w-full p-4 transition-transform group-hover:scale-110"
                                />
                            </div>
                            <div className="p-8">
                                <h3 className="mb-2 text-xl font-bold">
                                    Aventuras Matemáticas
                                </h3>
                                <p className="mb-6 text-sm text-slate-500 italic">
                                    Libro de ejercicios interactivos.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-black text-slate-900">
                                        $15.00
                                    </span>
                                    <button
                                        className={`rounded-2xl p-3 text-white transition hover:opacity-90 ${brandBg}`}
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
            <section className="overflow-hidden px-6 py-24">
                <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 md:flex-row">
                    <div className="md:w-1/3">
                        <h2 className="mb-4 text-4xl font-bold">
                            Lo que dicen los padres
                        </h2>
                        <p className="text-slate-600">
                            Únete a más de 500 familias que confían en nosotros.
                        </p>
                    </div>
                    <div className="flex snap-x gap-6 overflow-x-auto pb-8 md:w-2/3">
                        {[1, 2].map((t) => (
                            <div
                                key={t}
                                className="min-w-[320px] snap-center rounded-[2rem] bg-blue-50 p-8"
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
                                <p className="mb-6 text-slate-700 italic">
                                    "El material de AF Educación cambió la forma
                                    en que mi hijo ve las tareas. Ahora pregunta
                                    cuándo le toca ver su curso."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-blue-200"></div>
                                    <span className="text-sm font-bold text-slate-900">
                                        María García
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FAQ --- */}
            <section id="faq" className="bg-slate-50 px-6 py-24">
                <div className="mx-auto max-w-3xl">
                    <h2 className="mb-12 text-center text-3xl font-bold">
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
                            {
                                q: '¿Hay reembolsos?',
                                a: 'Sí, tienes 7 días de garantía de satisfacción.',
                            },
                        ].map((item, i) => (
                            <details
                                key={i}
                                className="group cursor-pointer rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all open:shadow-md"
                            >
                                <summary className="flex list-none items-center justify-between font-bold text-slate-800">
                                    {item.q}
                                    <HelpCircle className="text-blue-500 transition-transform group-open:rotate-180" />
                                </summary>
                                <p className="mt-4 leading-relaxed text-slate-600">
                                    {item.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-slate-900 px-6 py-16 text-slate-400">
                <div className="mx-auto mb-12 grid max-w-7xl gap-12 border-b border-slate-800 pb-12 md:grid-cols-4">
                    <div className="col-span-1 space-y-4 md:col-span-2">
                        <img
                            src="/logo.png"
                            className="h-10 opacity-50 grayscale invert"
                        />
                        <p className="max-w-xs">
                            Educando a las nuevas generaciones con tecnología y
                            valores.
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
                            <li>
                                <a
                                    href="#"
                                    className="transition hover:text-white"
                                >
                                    Suscripciones
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
                                    Términos y condiciones
                                </a>
                            </li>
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
                    <p>© 2026 AulaFutura. Todos los derechos reservados.</p>
                    <div className="flex gap-6">
                        <a href="#" className="transition hover:text-white">
                            Instagram
                        </a>
                        <a href="#" className="transition hover:text-white">
                            Facebook
                        </a>
                        <a href="#" className="transition hover:text-white">
                            WhatsApp
                        </a>
                    </div>
                </div>
            </footer>

            {/* BOTÓN WHATSAPP FLOTANTE */}
            <a
                href="https://wa.me/tu_numero"
                target="_blank"
                className="fixed right-8 bottom-8 z-50 rounded-full bg-[#25D366] p-4 text-white shadow-2xl transition-all hover:scale-110 active:scale-95"
            >
                <MessageCircle size={28} />
            </a>
        </div>
    );
}
