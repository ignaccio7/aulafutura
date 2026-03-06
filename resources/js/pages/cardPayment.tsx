import { useState } from "react";
import { Head } from "@inertiajs/react";
import PublicLayout from "@/layouts/public-layout";
import { CreditCard, Lock, User, ChevronRight, ChevronLeft, Check } from "lucide-react";

export default function CheckoutMultiStep() {
    const [step, setStep] = useState(1);

    const [account, setAccount] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [payment, setPayment] = useState({
        name: "",
        number: "",
        expiry: "",
        cvc: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAccount({ ...account, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPayment({ ...payment, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        if (!account.name) newErrors.name = "El nombre es requerido";
        if (!account.email) newErrors.email = "El correo es requerido";
        if (!account.password) newErrors.password = "La contraseña es requerida";
        else if (account.password.length < 8) newErrors.password = "Mínimo 8 caracteres";
        if (account.password !== account.password_confirmation)
            newErrors.password_confirmation = "Las contraseñas no coinciden";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep1()) setStep(2);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Account:", account);
        console.log("Payment:", payment);
        alert("¡Registro y pago procesados!");
    };

    const steps = [
        { number: 1, label: "Cuenta", icon: User },
        { number: 2, label: "Pago", icon: CreditCard },
    ];

    return (
        <PublicLayout title="Registro y Pago - AulaFutura">
            <Head title="Crear Cuenta" />

            <div className="min-h-screen bg-slate-50 py-24 dark:bg-slate-950">
                <div className="mx-auto max-w-xl">

                    {/* Step Indicator */}
                    <div className="mb-8 flex items-center justify-center gap-4">
                        {steps.map((s, i) => {
                            const Icon = s.icon;
                            const isCompleted = step > s.number;
                            const isActive = step === s.number;
                            return (
                                <div key={s.number} className="flex items-center gap-4">
                                    <div className="flex flex-col items-center gap-1">
                                        <div
                                            className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                                                isCompleted
                                                    ? "border-green-500 bg-green-500 text-white"
                                                    : isActive
                                                    ? "border-blue-600 bg-blue-600 text-white"
                                                    : "border-slate-300 bg-white text-slate-400 dark:border-slate-600 dark:bg-slate-800"
                                            }`}
                                        >
                                            {isCompleted ? <Check size={18} /> : <Icon size={18} />}
                                        </div>
                                        <span
                                            className={`text-xs font-medium ${
                                                isActive ? "text-blue-600" : "text-slate-400"
                                            }`}
                                        >
                                            {s.label}
                                        </span>
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div
                                            className={`mb-5 h-0.5 w-16 transition-all duration-300 ${
                                                step > s.number ? "bg-green-500" : "bg-slate-200 dark:bg-slate-700"
                                            }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="rounded-3xl bg-white p-10 shadow-xl dark:bg-slate-900">

                        {/* STEP 1: Cuenta */}
                        {step === 1 && (
                            <>
                                <div className="mb-8 flex items-center gap-3">
                                    <div className="rounded-xl bg-blue-100 p-3 dark:bg-slate-800">
                                        <User className="text-blue-600" size={28} />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold">Crea tu cuenta</h1>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Paso 1 de 2 — Datos personales
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">Nombre completo</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={account.name}
                                            onChange={handleAccountChange}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                                            placeholder="Juan Pérez"
                                        />
                                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">Correo electrónico</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={account.email}
                                            onChange={handleAccountChange}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                                            placeholder="juan@ejemplo.com"
                                        />
                                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">Contraseña</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={account.password}
                                            onChange={handleAccountChange}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                                            placeholder="Mínimo 8 caracteres"
                                        />
                                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">Confirmar contraseña</label>
                                        <input
                                            type="password"
                                            name="password_confirmation"
                                            value={account.password_confirmation}
                                            onChange={handleAccountChange}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                                            placeholder="Repite tu contraseña"
                                        />
                                        {errors.password_confirmation && (
                                            <p className="mt-1 text-xs text-red-500">{errors.password_confirmation}</p>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleNext}
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-700 active:scale-95"
                                    >
                                        Continuar al pago
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </>
                        )}

                        {/* STEP 2: Pago */}
                        {step === 2 && (
                            <>
                                <div className="mb-8 flex items-center gap-3">
                                    <div className="rounded-xl bg-blue-100 p-3 dark:bg-slate-800">
                                        <CreditCard className="text-blue-600" size={28} />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold">Pago Seguro</h1>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Paso 2 de 2 — Datos de tarjeta
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* <div>
                                        <label className="mb-2 block text-sm font-medium">Nombre en la tarjeta</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={payment.name}
                                            onChange={handlePaymentChange}
                                            required
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                                        />
                                    </div> */}

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">Número de tarjeta</label>
                                        <input
                                            type="text"
                                            name="number"
                                            maxLength={16}
                                            value={payment.number}
                                            onChange={handlePaymentChange}
                                            required
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 tracking-widest focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                                            placeholder="1234 5678 9012 3456"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Expiración</label>
                                            <input
                                                type="text"
                                                name="expiry"
                                                placeholder="MM/YY"
                                                value={payment.expiry}
                                                onChange={handlePaymentChange}
                                                required
                                                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">CVC</label>
                                            <input
                                                type="text"
                                                name="cvc"
                                                maxLength={4}
                                                value={payment.cvc}
                                                onChange={handlePaymentChange}
                                                required
                                                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="flex items-center gap-2 rounded-2xl border border-slate-200 px-6 py-4 font-medium text-slate-600 transition hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                        >
                                            <ChevronLeft size={18} />
                                            Volver
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-700 active:scale-95"
                                        >
                                            <Lock size={18} />
                                            Pagar Ahora
                                        </button>
                                    </div>
                                </form>

                                <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                                    Tus datos están protegidos con encriptación SSL.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
