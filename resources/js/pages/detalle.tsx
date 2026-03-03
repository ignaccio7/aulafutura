import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    FileText,
    Download,
    Star,
    ShieldCheck,
    ArrowLeft,
    ShoppingCart,
    CheckCircle2,
} from 'lucide-react';

export default function DetalleLibro() {
    // Colores de marca
    const brandBg = 'bg-[#1D4ED8] dark:bg-blue-600';
    const brandText = 'text-[#1D4ED8] dark:text-blue-400';

    const libro = {
        titulo: 'Chips y el largo camino a primavera',
        subtitulo: 'Nivel Inicial - 4 a 6 años',
        precio: '15.00',
        rating: 4.9,
        reviews: 128,
        paginas: 45,
        formato: 'PDF de Alta Calidad',
        descripcion:
            'Un libro diseñado por especialistas en psicopedagogía para ayudar a los niños a desarrollar la coordinación ojo-mano y prepararlos para la escritura de una forma lúdica y colorida.',
        beneficios: [
            'Ejercicios de trazo dirigido',
            'Ilustraciones para colorear',
            'Actividades de lógica simple',
            'Listo para imprimir en casa',
        ],
    };

    return (
        <PublicLayout title="Chips y el largo camino a primavera - AulaFutura">
            <div className="min-h-screen bg-white font-sans text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
                <Head title={`${libro.titulo} - AulaFutura`} />

                {/* --- TOP BAR / BACK --- */}
                <div className="mx-auto max-w-7xl px-6 pt-6">
                    <Link
                        href="#catalogo"
                        className="flex w-fit items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                    >
                        <ArrowLeft size={16} />
                        Volver al catálogo
                    </Link>
                </div>

                {/* --- MAIN CONTENT --- */}
                <section className="mx-auto max-w-7xl px-6 py-12">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
                        {/* COLUMNA IZQUIERDA: VISUALIZACIÓN */}
                        <div className="space-y-6">
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] bg-yellow-50 shadow-inner dark:bg-slate-900">
                                <img
                                    src="/images/chips.jpeg"
                                    alt={libro.titulo}
                                    className="h-full w-full object-cover object-top p-4 transition-transform duration-500 hover:scale-105"
                                />
                                <div className="absolute top-6 right-6 rounded-full bg-white/90 px-4 py-2 text-xs font-bold backdrop-blur dark:bg-slate-800/90">
                                    VISTA PREVIA DISPONIBLE
                                </div>
                            </div>

                            {/* Miniaturas o detalles técnicos rápidos */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex flex-col items-center rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                                    <FileText
                                        className="mb-1 text-blue-500"
                                        size={20}
                                    />
                                    <span className="text-xs font-bold">
                                        {libro.paginas} Págs.
                                    </span>
                                </div>
                                <div className="flex flex-col items-center rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                                    <Download
                                        className="mb-1 text-green-500"
                                        size={20}
                                    />
                                    <span className="text-xs font-bold">
                                        PDF
                                    </span>
                                </div>
                                <div className="flex flex-col items-center rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                                    <BookOpen
                                        className="mb-1 text-purple-500"
                                        size={20}
                                    />
                                    <span className="text-xs font-bold">
                                        A4
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* COLUMNA DERECHA: COMPRA E INFO */}
                        <div className="space-y-8">
                            <div>
                                <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                    LIBRO DIGITAL (PDF)
                                </span>
                                <h1 className="mb-4 text-4xl leading-tight font-bold md:text-5xl">
                                    {libro.titulo}
                                </h1>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <Star size={18} fill="currentColor" />
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            {libro.rating}
                                        </span>
                                    </div>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        ({libro.reviews} valoraciones de padres)
                                    </span>
                                </div>
                            </div>

                            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                                {libro.descripcion}
                            </p>

                            <div className="space-y-4">
                                <h3 className="font-bold">
                                    ¿Qué incluye este libro?
                                </h3>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {libro.beneficios.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <CheckCircle2
                                                size={18}
                                                className="text-green-500"
                                            />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CAJA DE COMPRA */}
                            <div className="rounded-[2.5rem] border border-slate-100 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/50">
                                <div className="mb-6 flex items-end justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            Precio único
                                        </p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black">
                                                S/ {libro.precio}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <ShieldCheck
                                            className="mb-1 ml-auto text-blue-500"
                                            size={24}
                                        />
                                        <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                            Pago Seguro
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <button
                                        className={`flex flex-1 items-center justify-center gap-3 rounded-2xl py-4 font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95 ${brandBg}`}
                                    >
                                        <ShoppingCart size={20} />
                                        Comprar ahora
                                    </button>
                                    <button className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-4 font-bold transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
                                        Añadir al carrito
                                    </button>
                                </div>

                                <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                                    Tras la compra, el link de descarga se
                                    enviará automáticamente a tu correo
                                    electrónico.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
