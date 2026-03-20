import { Head } from '@inertiajs/react';
import {
    Eye,
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    Search,
    Plus,
    BookOpen,
    Users,
} from 'lucide-react';

import { useState, useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { BreadcrumbItem } from '@/types';
import PlanFormModal from './PlanFormModal';
import PlanViewModal from './PlanViewModal';

export interface Product {
    id: number;
    title: string;
    type: 'book' | 'course';
    thumbnail: string | null;
    price: number;
}

export interface SubscriptionPlan {
    id: number;
    name: string;
    slug: string;
    billing_cycle: 'semanal' | 'mensual' | 'trimestral' | 'semestral' | 'anual';
    price: number;
    discount_price: number | null;
    currency: string;
    features: string[] | null;
    is_active: boolean | number;
    products_count?: number;
    memberships_count?: number;
}

interface Props {
    plans: SubscriptionPlan[];
    products: Product[];
}

type SortField = 'id' | 'name' | 'price' | 'billing_cycle' | 'is_active';
type SortDir = 'asc' | 'desc';

const BILLING_LABELS: Record<string, string> = {
    semanal: 'Semanal',
    mensual: 'Mensual',
    trimestral: 'Trimestral',
    semestral: 'Semestral',
    anual: 'Anual',
};

const BILLING_COLORS: Record<string, string> = {
    semanal:
        'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400',
    mensual: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
    trimestral:
        'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    semestral:
        'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400',
    anual: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
};

function SortIcon({
    field,
    sortField,
    sortDir,
}: {
    field: SortField;
    sortField: SortField;
    sortDir: SortDir;
}) {
    if (sortField !== field)
        return (
            <ChevronsUpDown className="ml-1 inline h-3 w-3 text-gray-400 dark:text-gray-500" />
        );
    return sortDir === 'asc' ? (
        <ChevronUp className="ml-1 inline h-3 w-3 text-blue-500 dark:text-blue-400" />
    ) : (
        <ChevronDown className="ml-1 inline h-3 w-3 text-blue-500 dark:text-blue-400" />
    );
}

const PAGE_SIZES = [10, 25, 50];

export default function SubscriptionPlans({ plans, products }: Props) {
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState<SortField>('id');
    const [sortDir, setSortDir] = useState<SortDir>('asc');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [showCreate, setShowCreate] = useState(false);
    const [viewPlanId, setViewPlanId] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            {
                title: 'Planes de Suscripción',
                href: admin.subscriptionPlans.index.url(),
            },
        ],
        [],
    );

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDir('asc');
        }
        setPage(1);
    };

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return plans.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                String(p.id).includes(q) ||
                String(p.price).includes(q) ||
                BILLING_LABELS[p.billing_cycle]?.toLowerCase().includes(q),
        );
    }, [plans, search]);

    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            let valA: string | number = a[sortField] as string | number;
            let valB: string | number = b[sortField] as string | number;
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            if (valA < valB) return sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filtered, sortField, sortDir]);

    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

    const thClass =
        'p-3 font-semibold text-gray-600 dark:text-gray-300 text-sm cursor-pointer select-none hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap transition-colors';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Planes de Suscripción" />

            <div className="p-6">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 transition-colors dark:text-white">
                                Planes de Suscripción
                            </h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {filtered.length} plan
                                {filtered.length !== 1 ? 'es' : ''} encontrado
                                {filtered.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCreate(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 dark:focus:ring-offset-gray-900"
                        >
                            <Plus className="h-4 w-4" />
                            Nuevo Plan
                        </button>
                    </div>

                    {/* Toolbar */}
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, ciclo, precio..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-9 text-sm text-gray-900 placeholder-gray-400 transition-colors outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-blue-900/30"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>Mostrar</span>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-900 transition-colors outline-none focus:border-blue-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                            >
                                {PAGE_SIZES.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                            <span>por página</span>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/50">
                                    <th
                                        className={thClass}
                                        onClick={() => handleSort('id')}
                                    >
                                        ID{' '}
                                        <SortIcon
                                            field="id"
                                            sortField={sortField}
                                            sortDir={sortDir}
                                        />
                                    </th>
                                    <th
                                        className={thClass}
                                        onClick={() => handleSort('name')}
                                    >
                                        Nombre{' '}
                                        <SortIcon
                                            field="name"
                                            sortField={sortField}
                                            sortDir={sortDir}
                                        />
                                    </th>
                                    <th
                                        className={thClass}
                                        onClick={() =>
                                            handleSort('billing_cycle')
                                        }
                                    >
                                        Ciclo{' '}
                                        <SortIcon
                                            field="billing_cycle"
                                            sortField={sortField}
                                            sortDir={sortDir}
                                        />
                                    </th>
                                    <th
                                        className={thClass}
                                        onClick={() => handleSort('price')}
                                    >
                                        Precio{' '}
                                        <SortIcon
                                            field="price"
                                            sortField={sortField}
                                            sortDir={sortDir}
                                        />
                                    </th>
                                    <th className="p-3 text-sm font-semibold whitespace-nowrap text-gray-600 dark:text-gray-300">
                                        Contenido
                                    </th>
                                    <th className="p-3 text-sm font-semibold whitespace-nowrap text-gray-600 dark:text-gray-300">
                                        Miembros
                                    </th>
                                    <th
                                        className={thClass}
                                        onClick={() => handleSort('is_active')}
                                    >
                                        Estado{' '}
                                        <SortIcon
                                            field="is_active"
                                            sortField={sortField}
                                            sortDir={sortDir}
                                        />
                                    </th>
                                    <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {paginated.map((plan) => (
                                    <tr
                                        key={plan.id}
                                        className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                        <td className="p-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                                            #{plan.id}
                                        </td>
                                        <td className="p-3">
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {plan.name}
                                            </span>
                                            {plan.discount_price && (
                                                <span className="ml-2 rounded-full bg-pink-100 px-1.5 py-0.5 text-xs font-medium text-pink-600 dark:bg-pink-500/20 dark:text-pink-400">
                                                    Oferta
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${BILLING_COLORS[plan.billing_cycle] ?? ''}`}
                                            >
                                                {BILLING_LABELS[
                                                    plan.billing_cycle
                                                ] ?? plan.billing_cycle}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex flex-col">
                                                <span
                                                    className={`font-medium ${plan.discount_price ? 'text-xs text-gray-400 line-through dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}
                                                >
                                                    {plan.currency}{' '}
                                                    {Number(plan.price).toFixed(
                                                        2,
                                                    )}
                                                </span>
                                                {plan.discount_price && (
                                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                        {plan.currency}{' '}
                                                        {Number(
                                                            plan.discount_price,
                                                        ).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                    <BookOpen className="h-3 w-3" />
                                                    {/* Contamos aproximado desde products_count */}
                                                    {plan.products_count ?? 0}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                <Users className="h-3 w-3" />
                                                {plan.memberships_count ?? 0}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    plan.is_active
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                                                        : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                                                }`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${plan.is_active ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-red-400 dark:bg-red-500'}`}
                                                />
                                                {plan.is_active
                                                    ? 'Activo'
                                                    : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <button
                                                onClick={() =>
                                                    setViewPlanId(plan.id)
                                                }
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-blue-800 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                                                title="Ver / editar plan"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {paginated.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="p-10 text-center text-gray-400 dark:text-gray-500"
                                        >
                                            <Search className="mx-auto mb-2 h-8 w-8 opacity-30" />
                                            <p>
                                                No se encontraron planes
                                                {search
                                                    ? ` para "${search}"`
                                                    : ''}
                                                .
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between dark:text-gray-400">
                        <span>
                            Mostrando{' '}
                            {sorted.length === 0
                                ? 0
                                : (page - 1) * pageSize + 1}
                            –{Math.min(page * pageSize, sorted.length)} de{' '}
                            {sorted.length} resultados
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(1)}
                                disabled={page === 1}
                                className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-800"
                            >
                                «
                            </button>
                            <button
                                onClick={() => setPage((p) => p - 1)}
                                disabled={page === 1}
                                className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-800"
                            >
                                ‹
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(
                                    (p) =>
                                        p === 1 ||
                                        p === totalPages ||
                                        Math.abs(p - page) <= 1,
                                )
                                .reduce<(number | '...')[]>(
                                    (acc, p, idx, arr) => {
                                        if (
                                            idx > 0 &&
                                            typeof arr[idx - 1] === 'number' &&
                                            (p as number) -
                                                (arr[idx - 1] as number) >
                                                1
                                        )
                                            acc.push('...');
                                        acc.push(p);
                                        return acc;
                                    },
                                    [],
                                )
                                .map((p, idx) =>
                                    p === '...' ? (
                                        <span key={`e-${idx}`} className="px-1">
                                            …
                                        </span>
                                    ) : (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p as number)}
                                            className={`rounded-lg border px-3 py-1.5 text-xs transition ${page === p ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800'}`}
                                        >
                                            {p}
                                        </button>
                                    ),
                                )}

                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={page === totalPages}
                                className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-800"
                            >
                                ›
                            </button>
                            <button
                                onClick={() => setPage(totalPages)}
                                disabled={page === totalPages}
                                className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-800"
                            >
                                »
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <PlanFormModal
                open={showCreate}
                onClose={() => setShowCreate(false)}
                products={products}
            />
            <PlanViewModal
                planId={viewPlanId}
                onClose={() => setViewPlanId(null)}
                products={products}
            />
        </AppLayout>
    );
}
