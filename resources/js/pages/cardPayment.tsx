import { Head, router, usePage } from '@inertiajs/react';
import {
    CreditCard,
    Lock,
    User,
    ChevronRight,
    ChevronLeft,
    Check,
} from 'lucide-react';
import { useState } from 'react';
import PublicLayout from '@/layouts/public-layout';

// Tipamos las props que ahora vienen del controlador
interface Plan {
    id: number;
    name: string;
    price: string;
    discount_price: string | null;
    currency: string;
    billing_cycle: string;
    features: string[];
    slug: string;
}

interface Props {
    plan: Plan;
    publicKey: string;
}

export default function CheckoutMultiStep() {
    const { plan, publicKey } = usePage<{ props: Props }>()
        .props as unknown as Props;

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const [account, setAccount] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const effectivePrice = plan.discount_price ?? plan.price;

    const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAccount({ ...account, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        if (!account.name) newErrors.name = 'El nombre es requerido';
        if (!account.email) newErrors.email = 'El correo es requerido';
        if (!account.password)
            newErrors.password = 'La contraseña es requerida';
        else if (account.password.length < 8)
            newErrors.password = 'Mínimo 8 caracteres';
        if (account.password !== account.password_confirmation)
            newErrors.password_confirmation = 'Las contraseñas no coinciden';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep1()) setStep(2);
    };

    // Aquí ya sí llama al backend real
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setServerError(null);

        try {
            // Leer el CSRF token del cookie que Laravel siempre genera
            const xsrfToken = decodeURIComponent(
                document.cookie
                    .split('; ')
                    .find((row) => row.startsWith('XSRF-TOKEN='))
                    ?.split('=')[1] ?? '',
            );

            const response = await fetch('/payment/preference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': xsrfToken, // ← X-XSRF-TOKEN, no X-CSRF-TOKEN
                },
                body: JSON.stringify({
                    plan_slug: plan.slug,
                    name: account.name,
                    email: account.email,
                    password: account.password,
                    password_confirmation: account.password_confirmation,
                }),
            });

            const data = await response.json();

            if (response.status === 422) {
                // Laravel devuelve { errors: { email: ["mensaje"], ... } }
                const fieldErrors: Record<string, string> = {};

                // Aplanar: { email: ["msg"] } → { email: "msg" }
                Object.entries(data.errors ?? {}).forEach(
                    ([field, messages]) => {
                        fieldErrors[field] = Array.isArray(messages)
                            ? messages[0]
                            : (messages as string);
                    },
                );

                setErrors(fieldErrors);
                setStep(1); // volver al paso 1 donde están los campos

                // Mostrar el primer error como banner general también
                const primerError = Object.values(fieldErrors)[0];
                if (primerError) setServerError(primerError);
                return;
            }
            if (data.url) {
                window.location.href = data.url;
                return;
            }

            setServerError(data.message ?? 'Error al procesar el pago.');
        } catch {
            setServerError('Error de conexión. Intenta nuevamente más tarde.');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { number: 1, label: 'Cuenta', icon: User },
        { number: 2, label: 'Pago', icon: CreditCard },
    ];

    return (
        <PublicLayout title={`Suscribirse a ${plan.name} - AulaFutura`}>
            <Head title={`Plan ${plan.name}`} />

            <div className="min-h-screen bg-slate-50 py-24 dark:bg-slate-950">
                <div className="mx-auto max-w-xl">
                    {/* Resumen del plan arriba */}
                    <div className="mb-6 rounded-2xl bg-blue-600 p-5 text-center text-white">
                        <p className="text-sm font-medium opacity-80">
                            Suscribiéndote a
                        </p>
                        <h2 className="text-2xl font-bold">{plan.name}</h2>
                        <p className="mt-1 text-3xl font-extrabold">
                            {effectivePrice} {plan.currency}
                            <span className="text-base font-normal opacity-80">
                                {' '}
                                / {plan.billing_cycle}
                            </span>
                        </p>
                        {plan.discount_price && (
                            <p className="text-sm line-through opacity-70">
                                Antes: {plan.price} {plan.currency}
                            </p>
                        )}
                    </div>

                    {/* Step Indicator */}
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
                        {serverError && (
                            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                                {serverError}
                            </div>
                        )}

                        {/* STEP 1: Datos de cuenta */}
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
                                    {[
                                        {
                                            label: 'Nombre completo',
                                            name: 'name',
                                            type: 'text',
                                            placeholder: 'Juan Pérez',
                                        },
                                        {
                                            label: 'Correo electrónico',
                                            name: 'email',
                                            type: 'email',
                                            placeholder: 'juan@ejemplo.com',
                                        },
                                        {
                                            label: 'Contraseña',
                                            name: 'password',
                                            type: 'password',
                                            placeholder: 'Mínimo 8 caracteres',
                                        },
                                        {
                                            label: 'Confirmar contraseña',
                                            name: 'password_confirmation',
                                            type: 'password',
                                            placeholder: 'Repite tu contraseña',
                                        },
                                    ].map((field) => (
                                        <div key={field.name}>
                                            <label className="mb-2 block text-sm font-medium">
                                                {field.label}
                                            </label>
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                value={
                                                    account[
                                                        field.name as keyof typeof account
                                                    ]
                                                }
                                                onChange={handleAccountChange}
                                                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                                                placeholder={field.placeholder}
                                            />
                                            {errors[field.name] && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors[field.name]}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        onClick={handleNext}
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-700 active:scale-95"
                                    >
                                        Continuar al pago{' '}
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </>
                        )}

                        {/* STEP 2: Confirmación y pago */}
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
                                            Confirmar suscripción
                                        </h1>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Paso 2 de 2 — Serás redirigido a
                                            Mercado Pago
                                        </p>
                                    </div>
                                </div>

                                {/* Resumen antes de pagar */}
                                <div className="mb-6 space-y-2 rounded-xl bg-slate-50 p-5 dark:bg-slate-800">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">
                                            Usuario
                                        </span>
                                        <span className="font-medium">
                                            {account.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">
                                            Email
                                        </span>
                                        <span className="font-medium">
                                            {account.email}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">
                                            Plan
                                        </span>
                                        <span className="font-medium">
                                            {plan.name}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex justify-between border-t pt-2 text-sm">
                                        <span className="font-bold text-slate-500">
                                            Total
                                        </span>
                                        <span className="text-lg font-bold text-blue-600">
                                            {effectivePrice} {plan.currency}
                                        </span>
                                    </div>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="flex items-center gap-2 rounded-2xl border border-slate-200 px-6 py-4 font-medium text-slate-600 transition hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:text-slate-300"
                                        >
                                            <ChevronLeft size={18} /> Volver
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-700 active:scale-95 disabled:opacity-60"
                                        >
                                            <Lock size={18} />
                                            {loading
                                                ? 'Redirigiendo a Mercado Pago...'
                                                : 'Pagar con Mercado Pago'}
                                        </button>
                                    </div>
                                </form>

                                <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                                    Serás redirigido a Mercado Pago de forma
                                    segura. Tus datos están protegidos.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
