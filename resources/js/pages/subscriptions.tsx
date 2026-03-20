// resources/js/pages/subscriptions.tsx
import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';
import { Rocket, Star, Crown, Check, Zap } from 'lucide-react';

interface Plan {
    id: number;
    name: string;
    slug: string;
    icon: 'star' | 'rocket' | 'crown';
    billing_cycle: string;
    duration_days: number;
    price: number;
    discount_price: number | null;
    currency: string;
    features: string[];
    is_active: boolean;
}

interface Props {
    plans: Plan[];
}

const BILLING_LABELS: Record<string, string> = {
    semanal: 'por semana',
    mensual: 'por mes',
    trimestral: 'por trimestre',
    semestral: 'por semestre',
    anual: 'por año',
};

const ICONS = {
    star: Star,
    rocket: Rocket,
    crown: Crown,
};

// El plan del medio (índice 1) se destaca visualmente
const HIGHLIGHT_INDEX = 1;

export default function Subscriptions({ plans: { data: plans } }: Props) {
    console.log(plans);

    return (
        <PublicLayout>
            <Head title="Planes de Suscripción" />

            <div className="min-h-screen bg-gray-50 px-4 py-16 dark:bg-gray-950">
                {/* Header */}
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                        <Zap className="h-3 w-3" /> Planes disponibles
                    </span>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                        Elige tu plan
                    </h1>
                    <p className="mt-3 text-gray-500 dark:text-gray-400">
                        Accede a libros y cursos seleccionados según el plan que
                        mejor se adapte a ti.
                    </p>
                </div>

                {plans?.length !== 0 && (
                    <div
                        className={`mx-auto grid max-w-5xl gap-6 ${
                            plans.length === 1
                                ? 'max-w-sm'
                                : plans.length === 2
                                  ? 'max-w-2xl grid-cols-1 sm:grid-cols-2'
                                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                        }`}
                    >
                        {/* Cards */}
                        {plans?.map((plan, idx) => {
                            const Icon = ICONS[plan.icon] ?? Star;
                            const isHighlighted =
                                plans.length >= 3 && idx === HIGHLIGHT_INDEX;
                            const effectivePrice =
                                plan.discount_price ?? plan.price;

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-200 ${
                                        isHighlighted
                                            ? 'scale-105 border-blue-500 bg-blue-600 text-white shadow-2xl shadow-blue-500/20'
                                            : 'border-gray-200 bg-white shadow-sm hover:shadow-md dark:border-gray-800 dark:bg-gray-900'
                                    }`}
                                >
                                    {/* Badge popular */}
                                    {isHighlighted && (
                                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                            <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-900 shadow">
                                                ⭐ Más popular
                                            </span>
                                        </div>
                                    )}

                                    {/* Icono */}
                                    <div
                                        className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                                            isHighlighted
                                                ? 'bg-white/20'
                                                : 'bg-blue-50 dark:bg-blue-900/30'
                                        }`}
                                    >
                                        <Icon
                                            className={`h-6 w-6 ${
                                                isHighlighted
                                                    ? 'text-white'
                                                    : 'text-blue-600 dark:text-blue-400'
                                            }`}
                                        />
                                    </div>

                                    {/* Nombre */}
                                    <h2
                                        className={`text-xl font-bold ${
                                            isHighlighted
                                                ? 'text-white'
                                                : 'text-gray-900 dark:text-white'
                                        }`}
                                    >
                                        {plan.name}
                                    </h2>

                                    {/* Precio */}
                                    <div className="mt-4 mb-6">
                                        {plan.discount_price && (
                                            <span
                                                className={`text-sm line-through ${
                                                    isHighlighted
                                                        ? 'text-blue-200'
                                                        : 'text-gray-400'
                                                }`}
                                            >
                                                {plan.currency}{' '}
                                                {plan.price.toFixed(2)}
                                            </span>
                                        )}
                                        <div className="flex items-end gap-1">
                                            <span
                                                className={`text-4xl font-extrabold ${
                                                    isHighlighted
                                                        ? 'text-white'
                                                        : 'text-gray-900 dark:text-white'
                                                }`}
                                            >
                                                {plan.currency}{' '}
                                                {effectivePrice.toFixed(2)}
                                            </span>
                                            <span
                                                className={`mb-1.5 text-sm ${
                                                    isHighlighted
                                                        ? 'text-blue-200'
                                                        : 'text-gray-400 dark:text-gray-500'
                                                }`}
                                            >
                                                {BILLING_LABELS[
                                                    plan.billing_cycle
                                                ] ?? `/${plan.billing_cycle}`}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    {plan.features.length > 0 && (
                                        <ul className="mb-8 flex-1 space-y-2.5">
                                            {plan.features.map((f, i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-start gap-2.5 text-sm"
                                                >
                                                    <span
                                                        className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${
                                                            isHighlighted
                                                                ? 'bg-white/25 text-white'
                                                                : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
                                                        }`}
                                                    >
                                                        <Check className="h-2.5 w-2.5" />
                                                    </span>
                                                    <span
                                                        className={
                                                            isHighlighted
                                                                ? 'text-blue-100'
                                                                : 'text-gray-600 dark:text-gray-300'
                                                        }
                                                    >
                                                        {f}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* CTA */}
                                    <Link
                                        href={`/payment/${plan.slug}`}
                                        className={`mt-auto block w-full rounded-xl py-3 text-center text-sm font-semibold transition active:scale-95 ${
                                            isHighlighted
                                                ? 'bg-white text-blue-600 hover:bg-blue-50'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
                                        }`}
                                    >
                                        Comenzar ahora
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Nota soft deletes */}
                <p className="mt-10 text-center text-xs text-gray-400 dark:text-gray-600">
                    Los planes adquiridos se mantienen activos hasta su fecha de
                    vencimiento.
                </p>
            </div>
        </PublicLayout>
    );
}
