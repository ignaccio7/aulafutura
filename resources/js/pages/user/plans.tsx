// resources/js/pages/user/planes.tsx
import { Head, usePage } from '@inertiajs/react';
import {
    Rocket,
    Star,
    Crown,
    Check,
    BookOpen,
    PlayCircle,
    Zap,
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Mi Dashboard', href: '/user/dashboard' },
    { title: 'Mis Planes', href: '/user/planes' },
];

interface Product {
    id: number;
    title: string;
    type: 'book' | 'course';
}

interface Plan {
    id: number;
    name: string;
    slug: string;
    icon: 'star' | 'rocket' | 'crown';
    billing_cycle: string;
    price: number;
    discount_price: number | null;
    currency: string;
    features: string[];
    products?: Product[];
}

interface Props {
    plans: { data: Plan[] };
    currentPlanId: number | null;
}

const BILLING_LABELS: Record<string, string> = {
    semanal: 'por semana',
    mensual: 'por mes',
    trimestral: 'por trimestre',
    semestral: 'por semestre',
    anual: 'por año',
};

const ICONS = {
    star: {
        Icon: Star,
        color: 'text-amber-500',
        bg: 'bg-amber-50 dark:bg-amber-900/30',
        border: 'border-amber-200 dark:border-amber-800',
    },
    rocket: {
        Icon: Rocket,
        color: 'text-blue-500',
        bg: 'bg-blue-50 dark:bg-blue-900/30',
        border: 'border-blue-200 dark:border-blue-800',
    },
    crown: {
        Icon: Crown,
        color: 'text-purple-500',
        bg: 'bg-purple-50 dark:bg-purple-900/30',
        border: 'border-purple-200 dark:border-purple-800',
    },
};

function PlanActionButton({
    plan,
    isCurrentPlan,
}: {
    plan: Plan;
    isCurrentPlan: boolean;
}) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        try {
            const xsrfToken = decodeURIComponent(
                document.cookie
                    .split('; ')
                    .find((r) => r.startsWith('XSRF-TOKEN='))
                    ?.split('=')[1] ?? '',
            );
            const res = await fetch('/user/change-plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': xsrfToken,
                },
                body: JSON.stringify({ plan_id: plan.id }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url; // navegación real, sin CORS
            }
        } catch {
            setLoading(false);
        }
    };

    if (isCurrentPlan) {
        return (
            <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                <Check className="h-4 w-4" /> Plan actual
            </div>
        );
    }

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className="hover:bg onClick={handleClick} disabled={loading} flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition"
        >
            {loading
                ? 'Redirigiendo...'
                : `Pagar ${plan.currency} ${Number(plan.discount_price ?? plan.price).toFixed(2)}`}
        </button>
    );
}

export default function UserPlanes({
    plans: { data: plans },
    currentPlanId,
}: Props) {
    const { flash } = usePage<{
        flash: { success?: string; error?: string; info?: string };
    }>().props;
    const currentPlan = plans.find((p) => p.id === currentPlanId);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mis Planes" />
            <div className="mx-auto max-w-6xl space-y-8 p-6">
                {/* Flash messages */}
                {flash?.success && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                        <Check className="h-4 w-4 flex-shrink-0" />{' '}
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                        {flash.error}
                    </div>
                )}
                {flash?.info && (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-600 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        {flash.info}
                    </div>
                )}

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Planes disponibles
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {currentPlan ? (
                            <>
                                Estás en el plan{' '}
                                <strong className="text-gray-700 dark:text-gray-200">
                                    {currentPlan.name}
                                </strong>
                                . Al cambiar pagarás el precio completo del
                                nuevo plan y se activará de inmediato.
                            </>
                        ) : (
                            'No tienes un plan activo. Elige uno para comenzar.'
                        )}
                    </p>
                </div>

                {/* Grid */}
                <div
                    className={`grid gap-5 ${
                        plans.length === 1
                            ? 'max-w-sm'
                            : plans.length === 2
                              ? 'max-w-2xl sm:grid-cols-2'
                              : 'sm:grid-cols-2 lg:grid-cols-3'
                    }`}
                >
                    {plans.map((plan) => {
                        const iconData = ICONS[plan.icon] ?? ICONS.star;
                        const { Icon } = iconData;
                        const isCurrentPlan = plan.id === currentPlanId;
                        const effectivePrice =
                            plan.discount_price ?? plan.price;
                        const books =
                            plan.products?.filter((p) => p.type === 'book') ??
                            [];
                        const courses =
                            plan.products?.filter((p) => p.type === 'course') ??
                            [];

                        return (
                            <div
                                key={plan.id}
                                className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
                                    isCurrentPlan
                                        ? 'border-emerald-400 bg-white shadow-md ring-1 ring-emerald-400 dark:border-emerald-600 dark:bg-gray-900 dark:ring-emerald-600'
                                        : 'border-gray-200 bg-white shadow-sm hover:shadow-md dark:border-gray-800 dark:bg-gray-900'
                                }`}
                            >
                                {isCurrentPlan && (
                                    <div className="absolute -top-3 left-4">
                                        <span className="rounded-full bg-emerald-500 px-3 py-0.5 text-xs font-bold text-white">
                                            ✓ Tu plan actual
                                        </span>
                                    </div>
                                )}

                                {/* Icono + nombre */}
                                <div className="mb-4 flex items-center gap-3">
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-xl border ${iconData.bg} ${iconData.border}`}
                                    >
                                        <Icon
                                            className={`h-5 w-5 ${iconData.color}`}
                                        />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-gray-900 dark:text-white">
                                            {plan.name}
                                        </h2>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                            {BILLING_LABELS[
                                                plan.billing_cycle
                                            ] ?? plan.billing_cycle}
                                        </p>
                                    </div>
                                </div>

                                {/* Precio */}
                                <div className="mb-5">
                                    {plan.discount_price && (
                                        <span className="text-xs text-gray-400 line-through">
                                            {plan.currency}{' '}
                                            {Number(plan.price).toFixed(2)}
                                        </span>
                                    )}
                                    <div className="flex items-end gap-1">
                                        <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                                            {plan.currency}{' '}
                                            {Number(effectivePrice).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Features */}
                                {plan.features.length > 0 && (
                                    <ul className="mb-5 space-y-1.5">
                                        {plan.features.map((f, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                                            >
                                                <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* Contenido incluido */}
                                {(books.length > 0 || courses.length > 0) && (
                                    <div className="mb-5 space-y-2 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60">
                                        <p className="flex items-center gap-1 text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-gray-500">
                                            <Zap className="h-3 w-3" />{' '}
                                            Contenido incluido
                                        </p>
                                        {books.length > 0 && (
                                            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                                                <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                                                <span className="font-medium">
                                                    {books.length}
                                                </span>{' '}
                                                libro
                                                {books.length !== 1 ? 's' : ''}
                                            </div>
                                        )}
                                        {courses.length > 0 && (
                                            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                                                <PlayCircle className="h-3.5 w-3.5 text-emerald-400" />
                                                <span className="font-medium">
                                                    {courses.length}
                                                </span>{' '}
                                                curso
                                                {courses.length !== 1
                                                    ? 's'
                                                    : ''}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="mt-auto">
                                    <PlanActionButton
                                        plan={plan}
                                        isCurrentPlan={isCurrentPlan}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <p className="text-xs text-gray-400 dark:text-gray-600">
                    El pago se procesa a través de Mercado Pago de forma segura.
                    Tu membresía anterior se cancela solo cuando el pago es
                    aprobado.
                </p>
            </div>
        </AppLayout>
    );
}
