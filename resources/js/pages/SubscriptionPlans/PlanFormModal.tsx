// resources/js/Pages/SubscriptionPlans/PlanFormModal.tsx
import { useForm } from '@inertiajs/react';
import {
    X,
    Plus,
    Trash2,
    BookOpen,
    PlayCircle,
    Tag,
    Rocket,
    Star,
    Crown,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export interface Product {
    id: number;
    title: string;
    type: 'book' | 'course';
    thumbnail: string | null;
    price: number;
}

export interface PlanForEdit {
    id: number;
    name: string;
    icon: 'star' | 'rocket' | 'crown';
    billing_cycle: string;
    price: number;
    discount_price: number | null;
    currency: string;
    features: string[] | null;
    is_active: boolean | number;
    products?: Product[];
}

interface Props {
    open: boolean;
    onClose: () => void;
    products: Product[];
    plan?: PlanForEdit | null;
}

const BILLING_CYCLES = [
    { value: 'semanal', label: 'Semanal' },
    { value: 'mensual', label: 'Mensual' },
    { value: 'trimestral', label: 'Trimestral' },
    { value: 'semestral', label: 'Semestral' },
    { value: 'anual', label: 'Anual' },
];

const ICON_OPTIONS = [
    {
        value: 'star',
        label: 'Estrella',
        Icon: Star,
        color: 'text-amber-500',
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        border: 'border-amber-300 dark:border-amber-700',
    },
    {
        value: 'rocket',
        label: 'Cohete',
        Icon: Rocket,
        color: 'text-blue-500',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-300 dark:border-blue-700',
    },
    {
        value: 'crown',
        label: 'Corona',
        Icon: Crown,
        color: 'text-purple-500',
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-300 dark:border-purple-700',
    },
] as const;

export default function PlanFormModal({
    open,
    onClose,
    products,
    plan,
}: Props) {
    const isEdit = !!plan;

    const [selectedProductIds, setSelectedProductIds] = useState<number[]>(
        plan?.products?.map((p) => p.id) ?? [],
    );
    const [productSearch, setProductSearch] = useState('');
    const [featureInput, setFeatureInput] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        icon: string;
        billing_cycle: string;
        price: string;
        features: string[];
        is_active: boolean;
        product_ids: number[];
    }>({
        name: plan?.name ?? '',
        icon: plan?.icon ?? 'star',
        billing_cycle: plan?.billing_cycle ?? 'mensual',
        price: plan ? String(plan.price) : '',
        features:
            plan?.features?.map((f) =>
                typeof f === 'string' ? f : ((f as any).text ?? ''),
            ) ?? [],
        is_active: plan ? Boolean(plan.is_active) : true,
        product_ids: plan?.products?.map((p) => p.id) ?? [],
    });

    useEffect(() => {
        if (open) {
            const ids = plan?.products?.map((p) => p.id) ?? [];
            setSelectedProductIds(ids);
            setData({
                name: plan?.name ?? '',
                icon: plan?.icon ?? 'star',
                billing_cycle: plan?.billing_cycle ?? 'mensual',
                price: plan ? String(plan.price) : '',
                features:
                    plan?.features?.map((f) =>
                        typeof f === 'string' ? f : ((f as any).text ?? ''),
                    ) ?? [],
                is_active: plan ? Boolean(plan.is_active) : true,
                product_ids: ids,
            });
            setProductSearch('');
            setFeatureInput('');
        }
    }, [open, plan?.id]);

    useEffect(() => {
        setData('product_ids', selectedProductIds);
    }, [selectedProductIds]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEdit
            ? `/admin/subscription-plans/${plan!.id}`
            : '/admin/subscription-plans';
        post(url, { onSuccess: () => handleClose() });
    };

    const addFeature = () => {
        const trimmed = featureInput.trim();
        if (trimmed && !data.features.includes(trimmed)) {
            setData('features', [...data.features, trimmed]);
        }
        setFeatureInput('');
    };

    const removeFeature = (idx: number) =>
        setData(
            'features',
            data.features.filter((_, i) => i !== idx),
        );

    const toggleProduct = (id: number) =>
        setSelectedProductIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );

    const filteredProducts = products.filter((p) =>
        p.title.toLowerCase().includes(productSearch.toLowerCase()),
    );
    const books = filteredProducts.filter((p) => p.type === 'book');
    const courses = filteredProducts.filter((p) => p.type === 'course');

    if (!open) return null;

    const inputClass = (field: keyof typeof errors) =>
        `w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-blue-100 dark:bg-gray-800 dark:text-gray-100 ${
            errors[field]
                ? 'border-red-400 focus:border-red-400'
                : 'border-gray-200 dark:border-gray-700 focus:border-blue-400'
        }`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div
                className="absolute inset-0 backdrop-blur-sm"
                onClick={handleClose}
            />

            <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <Tag className="h-5 w-5 text-blue-600" />
                        <h2 className="text-lg font-semibold dark:text-white">
                            {isEdit ? 'Editar Plan' : 'Nuevo Plan'}
                        </h2>
                        {isEdit && (
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                #{plan!.id}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleClose}
                        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="max-h-[75vh] space-y-5 overflow-y-auto px-6 py-5">
                        {/* Nombre */}
                        <div>
                            <label className="mb-1 block text-sm font-medium dark:text-gray-200">
                                Nombre <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Ej: Plan Básico"
                                className={inputClass('name')}
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Selector de icono */}
                        <div>
                            <label className="mb-2 block text-sm font-medium dark:text-gray-200">
                                Icono del plan{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-3">
                                {ICON_OPTIONS.map(
                                    ({
                                        value,
                                        label,
                                        Icon,
                                        color,
                                        bg,
                                        border,
                                    }) => {
                                        const selected = data.icon === value;
                                        return (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() =>
                                                    setData('icon', value)
                                                }
                                                className={`flex flex-1 flex-col items-center gap-2 rounded-xl border-2 py-3 text-xs font-medium transition ${
                                                    selected
                                                        ? `${bg} ${border}`
                                                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                                                }`}
                                            >
                                                <Icon
                                                    className={`h-6 w-6 ${color}`}
                                                />
                                                <span
                                                    className={
                                                        selected
                                                            ? 'text-gray-800 dark:text-gray-200'
                                                            : 'text-gray-500 dark:text-gray-400'
                                                    }
                                                >
                                                    {label}
                                                </span>
                                                {selected && (
                                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                                )}
                                            </button>
                                        );
                                    },
                                )}
                            </div>
                            {errors.icon && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.icon}
                                </p>
                            )}
                        </div>

                        {/* Ciclo + Precio */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium dark:text-gray-200">
                                    Ciclo de facturación{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.billing_cycle}
                                    onChange={(e) =>
                                        setData('billing_cycle', e.target.value)
                                    }
                                    className={inputClass('billing_cycle')}
                                >
                                    {BILLING_CYCLES.map((c) => (
                                        <option key={c.value} value={c.value}>
                                            {c.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.billing_cycle && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.billing_cycle}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium dark:text-gray-200">
                                    Precio{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm dark:text-gray-400">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) =>
                                            setData('price', e.target.value)
                                        }
                                        placeholder="0.00"
                                        className={`w-full rounded-lg border py-2 pr-3 pl-7 text-sm transition outline-none focus:ring-2 focus:ring-blue-100 dark:bg-gray-800 dark:text-gray-100 ${errors.price ? 'border-red-400' : 'border-gray-200 focus:border-blue-400 dark:border-gray-700'}`}
                                    />
                                </div>
                                {errors.price && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.price}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Features */}
                        <div>
                            <label className="mb-1 block text-sm font-medium dark:text-gray-200">
                                Beneficios del plan
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={featureInput}
                                    onChange={(e) =>
                                        setFeatureInput(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addFeature();
                                        }
                                    }}
                                    placeholder="Ej: Acceso ilimitado a cursos..."
                                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                />
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    <Plus className="h-4 w-4" /> Agregar
                                </button>
                            </div>
                            {data.features.length > 0 && (
                                <ul className="mt-2 space-y-1">
                                    {data.features.map((f, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-1.5 text-sm text-gray-700 dark:bg-gray-800/60 dark:text-gray-300"
                                        >
                                            <span>✓ {f}</span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeFeature(idx)
                                                }
                                                className="text-red-400 hover:text-red-600"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Selector de productos */}
                        <div>
                            <label className="mb-1 block text-sm font-medium dark:text-gray-200">
                                Contenido incluido en el plan
                                <span className="ml-1 text-xs font-normal text-gray-400">
                                    ({selectedProductIds.length} seleccionado
                                    {selectedProductIds.length !== 1 ? 's' : ''}
                                    )
                                </span>
                            </label>
                            <input
                                type="text"
                                value={productSearch}
                                onChange={(e) =>
                                    setProductSearch(e.target.value)
                                }
                                placeholder="Buscar libros o cursos..."
                                className="mb-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                            />

                            <div className="max-h-56 space-y-3 overflow-y-auto rounded-xl border border-gray-200 p-3 dark:border-gray-700">
                                {books.length > 0 && (
                                    <div>
                                        <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-gray-500">
                                            <BookOpen className="h-3 w-3" />{' '}
                                            Libros
                                        </p>
                                        <div className="space-y-1">
                                            {books.map((product) => {
                                                const selected =
                                                    selectedProductIds.includes(
                                                        product.id,
                                                    );
                                                return (
                                                    <label
                                                        key={product.id}
                                                        className={`flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition ${selected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selected}
                                                            onChange={() =>
                                                                toggleProduct(
                                                                    product.id,
                                                                )
                                                            }
                                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        {product.thumbnail ? (
                                                            <img
                                                                src={`/storage/${product.thumbnail}`}
                                                                alt={
                                                                    product.title
                                                                }
                                                                className="h-8 w-8 flex-shrink-0 rounded object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-gray-100 dark:bg-gray-700">
                                                                <BookOpen className="h-4 w-4 text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                                                                {product.title}
                                                            </p>
                                                            <p className="text-xs text-gray-400">
                                                                $
                                                                {Number(
                                                                    product.price,
                                                                ).toFixed(2)}
                                                            </p>
                                                        </div>
                                                        {selected && (
                                                            <span className="flex-shrink-0 rounded-full bg-blue-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
                                                                ✓
                                                            </span>
                                                        )}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {courses.length > 0 && (
                                    <div>
                                        <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-gray-500">
                                            <PlayCircle className="h-3 w-3" />{' '}
                                            Cursos
                                        </p>
                                        <div className="space-y-1">
                                            {courses.map((product) => {
                                                const selected =
                                                    selectedProductIds.includes(
                                                        product.id,
                                                    );
                                                return (
                                                    <label
                                                        key={product.id}
                                                        className={`flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition ${selected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selected}
                                                            onChange={() =>
                                                                toggleProduct(
                                                                    product.id,
                                                                )
                                                            }
                                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        {product.thumbnail ? (
                                                            <img
                                                                src={`/storage/${product.thumbnail}`}
                                                                alt={
                                                                    product.title
                                                                }
                                                                className="h-8 w-8 flex-shrink-0 rounded object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-gray-100 dark:bg-gray-700">
                                                                <PlayCircle className="h-4 w-4 text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                                                                {product.title}
                                                            </p>
                                                            <p className="text-xs text-gray-400">
                                                                $
                                                                {Number(
                                                                    product.price,
                                                                ).toFixed(2)}
                                                            </p>
                                                        </div>
                                                        {selected && (
                                                            <span className="flex-shrink-0 rounded-full bg-blue-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
                                                                ✓
                                                            </span>
                                                        )}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {filteredProducts.length === 0 && (
                                    <p className="py-4 text-center text-sm text-gray-400 dark:text-gray-500">
                                        No se encontraron productos
                                        {productSearch
                                            ? ` para "${productSearch}"`
                                            : ''}
                                        .
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Estado toggle */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setData('is_active', !data.is_active)
                                }
                                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${data.is_active ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${data.is_active ? 'translate-x-4' : 'translate-x-0'}`}
                                />
                            </button>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {data.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                        >
                            {processing && (
                                <svg
                                    className="h-4 w-4 animate-spin"
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
                            )}
                            {processing
                                ? 'Guardando...'
                                : isEdit
                                  ? 'Guardar cambios'
                                  : 'Crear Plan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
