import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';
import {
    Check,
    Star,
    Rocket,
    Crown,
    ArrowRight,
    ShieldCheck,
} from 'lucide-react';

export default function Suscripciones() {
    // Colores de marca unificados con la landing
    const brandBg = 'bg-[#1D4ED8] dark:bg-blue-600';
    const brandText = 'text-[#1D4ED8] dark:text-blue-400';

    const planes = [
        {
            nombre: 'Explorador',
            slug: 'basico',
            precio: '19.99',
            periodo: 'Trimestral',
            icon: <Rocket className="text-blue-500" size={32} />,
            features: [
                'Acceso a 5 libros PDF',
                '2 Cursos básicos',
                'Soporte por email',
                'Certificado digital',
            ],
            recomendado: false,
        },
        {
            nombre: 'Aventura',
            slug: 'plus',
            precio: '35.00',
            periodo: 'Semestral',
            icon: (
                <Star className="fill-yellow-500 text-yellow-500" size={32} />
            ),
            features: [
                'Todos los libros PDF',
                '5 Cursos interactivos',
                'Acceso a webinars',
                'Soporte prioritario',
                'Comunidad de padres',
            ],
            recomendado: true,
        },
        {
            nombre: 'Maestro',
            slug: 'premium',
            precio: '59.99',
            periodo: 'Anual',
            icon: <Crown className="text-purple-500" size={32} />,
            features: [
                'Acceso ILIMITADO total',
                'Todos los cursos nuevos',
                'Mentoría 1 a 1',
                'Material físico incluido',
                'Acceso anticipado',
            ],
            recomendado: false,
        },
    ];

    return (
        <PublicLayout
            title="Planes de Suscripcion - AulaFutura"
            toolbar={false}
        >
            <div className="min-h-screen bg-white font-sans text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
                <Head title="Planes de Suscripción - AulaFutura" />

                {/* --- HEADER --- */}
                <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pt-32 pb-16 dark:from-slate-900 dark:to-slate-950">
                    <div className="mx-auto max-w-7xl px-6 text-center">
                        <h1 className="mb-6 text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
                            Elige el plan ideal para su{' '}
                            <span className={brandText}>crecimiento</span>
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                            Invierte en una educación de calidad. Todos nuestros
                            planes incluyen actualizaciones mensuales y
                            contenido seguro para niños.
                        </p>
                    </div>
                    {/* Decoración lúdica */}
                    <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl"></div>
                    <div className="absolute top-1/2 -right-24 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl"></div>
                </section>

                {/* --- PLANES --- */}
                <section className="px-6 py-20">
                    <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
                        {planes.map((plan, i) => (
                            <div
                                key={i}
                                className={`relative flex flex-col rounded-[2.5rem] border p-8 transition-all duration-300 hover:shadow-2xl ${
                                    plan.recomendado
                                        ? 'z-10 scale-105 border-blue-500 bg-white shadow-xl dark:border-blue-400 dark:bg-slate-900'
                                        : 'border-slate-100 bg-slate-50/50 hover:bg-white dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900'
                                }`}
                            >
                                {plan.recomendado && (
                                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-4 py-1 text-sm font-bold text-white shadow-lg">
                                        MÁS POPULAR
                                    </span>
                                )}

                                <div className="mb-8 flex items-center justify-between">
                                    <div
                                        className={`rounded-2xl p-4 shadow-sm ${plan.recomendado ? 'bg-blue-50 dark:bg-slate-800' : 'bg-white dark:bg-slate-800'}`}
                                    >
                                        {plan.icon}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            {plan.periodo}
                                        </p>
                                        <div className="flex items-baseline justify-end gap-1">
                                            <span className="text-3xl font-black">
                                                S/ {plan.precio}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="mb-4 text-2xl font-bold">
                                    {plan.nombre}
                                </h3>

                                <ul className="mb-10 flex-1 space-y-4">
                                    {plan.features.map((feature, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-center gap-3 text-slate-600 dark:text-slate-400"
                                        >
                                            <div className="rounded-full bg-green-100 p-1 dark:bg-green-900/30">
                                                <Check
                                                    className="text-green-600 dark:text-green-400"
                                                    size={14}
                                                />
                                            </div>
                                            <span className="text-sm">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className={`group flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-white transition-all active:scale-95 ${
                                        plan.recomendado
                                            ? brandBg
                                            : 'bg-slate-800 hover:bg-slate-900 dark:bg-slate-700'
                                    }`}
                                >
                                    Seleccionar Plan
                                    <ArrowRight
                                        size={18}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- GARANTÍA --- */}
                <section className="mx-auto max-w-4xl px-6 pb-24">
                    <div className="flex flex-col items-center rounded-[2rem] bg-blue-50 p-8 text-center md:flex-row md:text-left dark:bg-slate-900/50">
                        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm md:mr-8 md:mb-0 dark:bg-slate-800">
                            <ShieldCheck className="text-blue-500" size={48} />
                        </div>
                        <div>
                            <h4 className="mb-2 text-xl font-bold">
                                Compra 100% Segura
                            </h4>
                            <p className="text-slate-600 dark:text-slate-400">
                                ¿No es lo que esperabas? No te preocupes. Tienes
                                **7 días de garantía** para solicitar un
                                reembolso completo si el contenido no satisface
                                tus necesidades.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
