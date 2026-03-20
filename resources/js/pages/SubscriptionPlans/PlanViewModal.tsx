// resources/js/Pages/SubscriptionPlans/PlanViewModal.tsx
import { router } from '@inertiajs/react';
import {
    X,
    Pencil,
    Trash2,
    BookOpen,
    PlayCircle,
    Users,
    Tag,
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import PlanFormModal from './PlanFormModal';

export interface Product {
    id: number;
    title: string;
    type: 'book' | 'course';
    thumbnail: string | null;
    price: number;
}

interface PlanDetail {
    id: number;
    name: string;
    slug: string;
    billing_cycle: string;
    price: number;
    discount_price: number | null;
    currency: string;
    features: string[] | null;
    is_active: boolean;
    products: Product[];
    products_count: number;
    memberships_count: number;
}

interface Props {
    planId: number | null;
    onClose: () => void;
    products: Product[]; // Todos los productos para el modal de edición
}

const BILLING_LABELS: Record<string, string> = {
    semanal: 'Semanal',
    mensual: 'Mensual',
    trimestral: 'Trimestral',
    semestral: 'Semestral',
    anual: 'Anual',
};

export default function PlanViewModal({ planId, onClose, products }: Props) {
    const [plan, setPlan] = useState<PlanDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!planId) {
            setPlan(null);
            return;
        }
        setLoading(true);
        fetch(`/admin/subscription-plans/${planId}`)
            .then((r) => r.json())
            .then((data) => {
                setPlan(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [planId]);

    // Escape para cerrar
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !showEdit) onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [showEdit]);

    const handleDelete = () => {
        console.log(plan);

        if (!plan) return;
        setDeleting(true);
        router.delete(`/admin/subscription-plans/${plan.id}`, {
            onSuccess: () => {
                setDeleting(false);
                onClose();
            },
            onError: (e) => {
                console.log(e);

                setDeleting(false);
            },
        });
    };

    if (!planId) return null;

    const books = plan?.products.filter((p) => p.type === 'book') ?? [];
    const courses = plan?.products.filter((p) => p.type === 'course') ?? [];

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
                <div
                    className="absolute inset-0 backdrop-blur-sm"
                    onClick={onClose}
                />

                <div className="relative z-10 w-full max-w-xl rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                            <Tag className="h-5 w-5 text-blue-600" />
                            <h2 className="text-lg font-semibold dark:text-white">
                                {loading ? 'Cargando...' : (plan?.name ?? '—')}
                            </h2>
                            {plan && (
                                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                    #{plan.id}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            {plan && (
                                <>
                                    <button
                                        onClick={() => setShowEdit(true)}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                                        title="Editar plan"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() =>
                                            setShowDeleteConfirm(true)
                                        }
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                                        title="Eliminar plan"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </>
                            )}
                            <button
                                onClick={onClose}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">
                        {loading && (
                            <div className="flex items-center justify-center py-12">
                                <svg
                                    className="h-6 w-6 animate-spin text-blue-500"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    />
                                </svg>
                            </div>
                        )}

                        {!loading && plan && (
                            <>
                                {/* Info general */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60">
                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                            Ciclo
                                        </p>
                                        <p className="mt-0.5 font-semibold text-gray-800 dark:text-gray-200">
                                            {BILLING_LABELS[
                                                plan.billing_cycle
                                            ] ?? plan.billing_cycle}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60">
                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                            Precio
                                        </p>
                                        <div className="mt-0.5">
                                            {plan.discount_price ? (
                                                <>
                                                    <span className="text-xs text-gray-400 line-through">
                                                        {plan.currency}{' '}
                                                        {Number(
                                                            plan.price,
                                                        ).toFixed(2)}
                                                    </span>
                                                    <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                        {plan.currency}{' '}
                                                        {Number(
                                                            plan.discount_price,
                                                        ).toFixed(2)}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">
                                                    {plan.currency}{' '}
                                                    {Number(plan.price).toFixed(
                                                        2,
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60">
                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                            Miembros activos
                                        </p>
                                        <p className="mt-0.5 flex items-center gap-1 font-semibold text-gray-800 dark:text-gray-200">
                                            <Users className="h-4 w-4 text-blue-500" />
                                            {plan.memberships_count}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/60">
                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                            Estado
                                        </p>
                                        <p className="mt-0.5 flex items-center gap-1 font-semibold">
                                            {plan.is_active ? (
                                                <>
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                    <span className="text-emerald-600 dark:text-emerald-400">
                                                        Activo
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-4 w-4 text-red-400" />
                                                    <span className="text-red-500">
                                                        Inactivo
                                                    </span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Beneficios */}
                                {plan.features && plan.features.length > 0 && (
                                    <div>
                                        <p className="mb-2 text-sm font-semibold dark:text-gray-200">
                                            Beneficios
                                        </p>
                                        <ul className="space-y-1">
                                            {plan.features.map((f, i) => {
                                                const label =
                                                    typeof f === 'string'
                                                        ? f
                                                        : ((f as any).text ??
                                                          JSON.stringify(f));
                                                return (
                                                    <li
                                                        key={i}
                                                        className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                                                    >
                                                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
                                                        {label}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}

                                {/* Contenido del plan */}
                                <div>
                                    <p className="mb-2 text-sm font-semibold dark:text-gray-200">
                                        Contenido incluido
                                        <span className="ml-1 text-xs font-normal text-gray-400">
                                            ({plan.products_count} item
                                            {plan.products_count !== 1
                                                ? 's'
                                                : ''}
                                            )
                                        </span>
                                    </p>

                                    {plan.products.length === 0 ? (
                                        <p className="rounded-xl bg-gray-50 p-4 text-center text-sm text-gray-400 dark:bg-gray-800/60 dark:text-gray-500">
                                            Sin contenido asignado
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {/* Libros */}
                                            {books.length > 0 && (
                                                <div>
                                                    <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-gray-500">
                                                        <BookOpen className="h-3 w-3" />{' '}
                                                        Libros ({books.length})
                                                    </p>
                                                    <div className="space-y-1">
                                                        {books.map((p) => (
                                                            <div
                                                                key={p.id}
                                                                className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-1.5 dark:bg-gray-800/60"
                                                            >
                                                                {p.thumbnail ? (
                                                                    <img
                                                                        src={`/storage/${p.thumbnail}`}
                                                                        alt={
                                                                            p.title
                                                                        }
                                                                        className="h-8 w-8 flex-shrink-0 rounded object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-gray-200 dark:bg-gray-700">
                                                                        <BookOpen className="h-4 w-4 text-gray-400" />
                                                                    </div>
                                                                )}
                                                                <span className="flex-1 truncate text-sm text-gray-700 dark:text-gray-300">
                                                                    {p.title}
                                                                </span>
                                                                <span className="text-xs text-gray-400">
                                                                    $
                                                                    {Number(
                                                                        p.price,
                                                                    ).toFixed(
                                                                        2,
                                                                    )}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Cursos */}
                                            {courses.length > 0 && (
                                                <div>
                                                    <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-gray-500">
                                                        <PlayCircle className="h-3 w-3" />{' '}
                                                        Cursos ({courses.length}
                                                        )
                                                    </p>
                                                    <div className="space-y-1">
                                                        {courses.map((p) => (
                                                            <div
                                                                key={p.id}
                                                                className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-1.5 dark:bg-gray-800/60"
                                                            >
                                                                {p.thumbnail ? (
                                                                    <img
                                                                        src={`/storage/${p.thumbnail}`}
                                                                        alt={
                                                                            p.title
                                                                        }
                                                                        className="h-8 w-8 flex-shrink-0 rounded object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-gray-200 dark:bg-gray-700">
                                                                        <PlayCircle className="h-4 w-4 text-gray-400" />
                                                                    </div>
                                                                )}
                                                                <span className="flex-1 truncate text-sm text-gray-700 dark:text-gray-300">
                                                                    {p.title}
                                                                </span>
                                                                <span className="text-xs text-gray-400">
                                                                    $
                                                                    {Number(
                                                                        p.price,
                                                                    ).toFixed(
                                                                        2,
                                                                    )}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Confirm delete inline */}
                                {showDeleteConfirm && (
                                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                                        <p className="text-sm font-medium text-red-700 dark:text-red-300">
                                            ¿Eliminar el plan{' '}
                                            <strong>{plan.name}</strong>?
                                        </p>
                                        <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                                            Esta acción no se puede deshacer.
                                            Los planes con membresías activas no
                                            pueden eliminarse.
                                        </p>
                                        <div className="mt-3 flex gap-2">
                                            <button
                                                onClick={handleDelete}
                                                disabled={deleting}
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
                                            >
                                                {deleting
                                                    ? 'Eliminando...'
                                                    : 'Sí, eliminar'}
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setShowDeleteConfirm(false)
                                                }
                                                className="rounded-lg border border-red-200 px-4 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de edición (se monta sobre el view modal) */}
            {plan && (
                <PlanFormModal
                    open={showEdit}
                    onClose={() => setShowEdit(false)}
                    products={products}
                    plan={{
                        ...plan,
                        products: plan.products,
                    }}
                />
            )}
        </>
    );
}
