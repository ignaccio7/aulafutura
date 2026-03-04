import { Head, Link } from '@inertiajs/react';
import {
    Check,
    Star,
    Rocket,
    Crown,
    ArrowRight,
    ShieldCheck,
} from 'lucide-react';
import React from 'react';
import PublicLayout from '@/layouts/public-layout';
import { cardPayment } from '@/routes';

interface Feature {
    text: string;
    icon: string;
}

interface Plan {
    id: number;
    name: string;
    slug: string;
    price: string;
    discount_price: string | null;
    effective_price: string;
    billing_cycle: string;
    features: Feature[];
    is_active: boolean;
}

interface Props {
    plans: {
        data: Plan[];
    };
}

const iconMap: Record<string, React.ReactElement> = {
    basico: <Rocket className="text-blue-500" size={32} />,
    plus: <Star className="fill-yellow-500 text-yellow-500" size={32} />,
    premium: <Crown className="text-purple-500" size={32} />,
};

export default function Suscripciones({ plans }: Props) {
    const brandBg = 'bg-[#1D4ED8] dark:bg-blue-600';
    const brandText = 'text-[#1D4ED8] dark:text-blue-400';

    return (
        <PublicLayout
            title="Planes de Suscripcion - AulaFutura"
            toolbar={false}
        >
            <div className="min-h-screen bg-white font-sans text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
                <Head title="Planes de Suscripción - AulaFutura" />

                {/* --- HEADER --- */}
                <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pt-32 pb-10 dark:from-slate-900 dark:to-slate-950">
                    <div className="mx-auto max-w-7xl px-6 text-center">
                        <h1 className="mb-6 text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
                            Elige el plan ideal para su{' '}
                            <span className={brandText}>crecimiento</span>
                        </h1>
                        <p className="mx-auto max-w-3xl text-lg text-slate-600 dark:text-slate-400">
                            Invierte en una educación de calidad. Todos nuestros
                            planes incluyen actualizaciones mensuales y
                            contenido seguro para niños.
                        </p>
                    </div>
                    <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl"></div>
                    <div className="absolute top-1/2 -right-24 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl"></div>
                </section>

                {/* --- PLANES --- */}
                <section className="px-6 pb-20">
                    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {plans.data.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative flex flex-col rounded-[2.5rem] border p-8 transition-all duration-300 hover:shadow-2xl ${
                                    plan.slug === 'plus'
                                        ? 'z-10 scale-105 border-blue-500 bg-white shadow-xl dark:border-blue-400 dark:bg-slate-900'
                                        : 'border-slate-100 bg-slate-50/50 hover:bg-white dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900'
                                }`}
                            >
                                {plan.slug === 'plus' && (
                                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-4 py-1 text-sm font-bold text-white shadow-lg">
                                        MÁS POPULAR
                                    </span>
                                )}

                                <div className="mb-8 flex items-center justify-between">
                                    <div
                                        className={`rounded-2xl p-4 shadow-sm ${plan.slug === 'plus' ? 'bg-blue-50 dark:bg-slate-800' : 'bg-white dark:bg-slate-800'}`}
                                    >
                                        {iconMap[plan.slug]}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            {plan.billing_cycle}
                                        </p>
                                        <div className="flex items-baseline justify-end gap-1">
                                            <span className="text-2xl font-black">
                                                S/ {plan.effective_price}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="mb-4 text-xl font-bold">
                                    {plan.name}
                                </h3>

                                <ul className="mb-10 flex-1 space-y-4">
                                    {plan.features?.map((feature, idx) => (
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
                                                {feature.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={`/payment/${plan.slug}`}
                                    className={`group flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-white transition-all active:scale-95 ${
                                        plan.slug === 'plus'
                                            ? brandBg
                                            : 'bg-slate-800 hover:bg-slate-900 dark:bg-slate-700'
                                    }`}
                                >
                                    Seleccionar Plan
                                    <ArrowRight
                                        size={18}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </Link>
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
                                7 días de garantía para solicitar un reembolso
                                completo si el contenido no satisface tus
                                necesidades.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
