import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import {
    CreditCard,
    Lock,
    User,
    ChevronRight,
    ChevronLeft,
    Check,
    Rocket,
    Star,
    Crown,
} from 'lucide-react';
import payment from '@/routes/payment';

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
    duration_days: number;
    features: Feature[];
}

interface Props {
    plan: Plan;
}

const iconMap: Record<string, React.ReactElement> = {
    basico: <Rocket className="text-blue-500" size={28} />,
    plus: <Star className="fill-yellow-500 text-yellow-500" size={28} />,
    premium: <Crown className="text-purple-500" size={28} />,
};

export default function CardPayment({ plan }: Props) {
    const [step, setStep] = useState(1);

    // useForm de Inertia maneja el estado, errores y el submit
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // Validación del paso 1 en el frontend (el backend también valida)
    const validateStep1 = (): boolean => {
        if (!data.name || !data.email || !data.password) return false;
        if (data.password.length < 8) return false;
        if (data.password !== data.password_confirmation) return false;
        return true;
    };

    const handleNext = () => {
        if (validateStep1()) setStep(2);
    };

    // Al hacer submit en el paso 2, enviamos todo a Laravel
    // Laravel crea la Order en PayPal y redirige al usuario
    const handleSubmit = () => {
        // post(route('payment.checkout', { slug: plan.slug }));
        post(payment.checkout(plan.slug).url);
        // Inertia::location en el backend hará el redirect a PayPal
    };

    const steps = [
        { number: 1, label: 'Cuenta', icon: User },
        { number: 2, label: 'Pago', icon: CreditCard },
    ];

    return (
        <PublicLayout title={`Suscribirse a ${plan.name} - AulaFutura`}>
            <Head title={`Checkout - ${plan.name}`} />

            <div className="min-h-screen bg-slate-50 py-24 dark:bg-slate-950">
                <div className="mx-auto max-w-xl px-4">
                    {/* Resumen del plan seleccionado */}
                    <div className="mb-8 flex items-center justify-between rounded-2xl border border-blue-100 bg-white px-6 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-blue-50 p-2 dark:bg-slate-800">
                                {iconMap[plan.slug] ?? <CreditCard size={28} />}
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Plan seleccionado
                                </p>
                                <p className="font-bold">{plan.name}</p>
                                <p className="text-xs text-slate-500">
                                    {plan.billing_cycle}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-blue-600">
                                S/ {plan.effective_price}
                            </p>
                            {plan.discount_price && (
                                <p className="text-sm text-slate-400 line-through">
                                    S/ {plan.price}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Step indicator */}
                    <div className="mb-8 flex items-center justify-center gap-4">
                        {steps.map((s, i) => {
                            const Icon = s.icon;
                            const isCompleted = step > s.number;
                            const isActive = step === s.number;
                            return (
                                <div
                                    key={s.number}
                                    className="flex items-center gap-4"
                                >
                                    <div className="flex flex-col items-center gap-1">
                                        <div
                                            className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                                                isCompleted
                                                    ? 'border-green-500 bg-green-500 text-white'
                                                    : isActive
                                                      ? 'border-blue-600 bg-blue-600 text-white'
                                                      : 'border-slate-300 bg-white text-slate-400 dark:border-slate-600 dark:bg-slate-800'
                                            }`}
                                        >
                                            {isCompleted ? (
                                                <Check size={18} />
                                            ) : (
                                                <Icon size={18} />
                                            )}
                                        </div>
                                        <span
                                            className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
                                        >
                                            {s.label}
                                        </span>
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div
                                            className={`mb-5 h-0.5 w-16 transition-all duration-300 ${
                                                step > s.number
                                                    ? 'bg-green-500'
                                                    : 'bg-slate-200 dark:bg-slate-700'
                                            }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="rounded-3xl bg-white p-10 shadow-xl dark:bg-slate-900">
                        {/* PASO 1: Datos de cuenta */}
                        {step === 1 && (
                            <>
                                <div className="mb-8 flex items-center gap-3">
                                    <div className="rounded-xl bg-blue-100 p-3 dark:bg-slate-800">
                                        <User
                                            className="text-blue-600"
                                            size={28}
                                        />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold">
                                            Crea tu cuenta
                                        </h1>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Paso 1 de 2 — Datos personales
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">
                                            Nombre completo
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                                            placeholder="Juan Pérez"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">
                                            Correo electrónico
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                                            placeholder="juan@ejemplo.com"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">
                                            Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                                            placeholder="Mínimo 8 caracteres"
                                        />
                                        {errors.password && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">
                                            Confirmar contraseña
                                        </label>
                                        <input
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    'password_confirmation',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                                            placeholder="Repite tu contraseña"
                                        />
                                        {errors.password_confirmation && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.password_confirmation}
                                            </p>
                                        )}
                                    </div>

                                    {/* Error general de PayPal */}
                                    {errors.paypal && (
                                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:bg-red-900/20">
                                            <p className="text-sm text-red-600 dark:text-red-400">
                                                {errors.paypal}
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleNext}
                                        disabled={!validateStep1()}
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Continuar al pago
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </>
                        )}

                        {/* PASO 2: Confirmación y pago con PayPal */}
                        {step === 2 && (
                            <>
                                <div className="mb-8 flex items-center gap-3">
                                    <div className="rounded-xl bg-blue-100 p-3 dark:bg-slate-800">
                                        <CreditCard
                                            className="text-blue-600"
                                            size={28}
                                        />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold">
                                            Confirmar Pago
                                        </h1>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Paso 2 de 2 — Pago seguro con PayPal
                                        </p>
                                    </div>
                                </div>

                                {/* Resumen de la compra */}
                                <div className="mb-6 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800">
                                    <h3 className="mb-3 font-semibold text-slate-700 dark:text-slate-300">
                                        Resumen de tu compra
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">
                                                Plan
                                            </span>
                                            <span className="font-medium">
                                                {plan.name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">
                                                Duración
                                            </span>
                                            <span className="font-medium">
                                                {plan.duration_days} días
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">
                                                Cuenta
                                            </span>
                                            <span className="font-medium">
                                                {data.email}
                                            </span>
                                        </div>
                                        <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 dark:border-slate-600">
                                            <span className="font-bold">
                                                Total a pagar
                                            </span>
                                            <span className="text-lg font-black text-blue-600">
                                                S/ {plan.effective_price}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Explicación de lo que pasará */}
                                <div className="mb-6 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        Al hacer clic en{' '}
                                        <strong>"Pagar con PayPal"</strong>{' '}
                                        serás redirigido a PayPal para completar
                                        el pago de forma segura. Una vez
                                        aprobado, tu cuenta será creada
                                        automáticamente.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        disabled={processing}
                                        className="flex items-center gap-2 rounded-2xl border border-slate-200 px-6 py-4 font-medium text-slate-600 transition hover:bg-slate-50 active:scale-95 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        <ChevronLeft size={18} />
                                        Volver
                                    </button>

                                    {/* Botón PayPal con su color amarillo característico */}
                                    <button
                                        onClick={handleSubmit}
                                        disabled={processing}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#FFC439] py-4 font-bold text-[#003087] transition hover:bg-[#f0b429] active:scale-95 disabled:opacity-60"
                                    >
                                        {processing ? (
                                            <>
                                                <svg
                                                    className="h-5 w-5 animate-spin"
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
                                                Redirigiendo a PayPal...
                                            </>
                                        ) : (
                                            <>
                                                <Lock size={18} />
                                                Pagar con{' '}
                                                <span className="font-black italic">
                                                    Pay
                                                    <span className="text-[#009cde]">
                                                        Pal
                                                    </span>
                                                </span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                                    🔒 Tus datos están protegidos con
                                    encriptación SSL. No almacenamos datos de
                                    tarjeta.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
