import { useState } from "react";
import { Head } from "@inertiajs/react";
import PublicLayout from "@/layouts/public-layout";
import { CreditCard, Lock } from "lucide-react";

export default function cardPayment() {
    const [form, setForm] = useState({
        name: "",
        number: "",
        expiry: "",
        cvc: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Datos enviados:", form);

        // Aquí luego conectarás tu pasarela
        alert("Procesando pago...");
    };

    return (
        <PublicLayout title="Pago con Tarjeta - AulaFutura">
            <Head title="Pago con Tarjeta" />

            <div className="min-h-screen bg-slate-50 py-24 dark:bg-slate-950">
                <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 shadow-xl dark:bg-slate-900">

                    {/* Header */}
                    <div className="mb-8 flex items-center gap-3">
                        <div className="rounded-xl bg-blue-100 p-3 dark:bg-slate-800">
                            <CreditCard className="text-blue-600" size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">
                                Pago Seguro
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Ingresa los datos de tu tarjeta
                            </p>
                        </div>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Nombre */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Nombre en la tarjeta
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                            />
                        </div>

                        {/* Número */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Número de tarjeta
                            </label>
                            <input
                                type="text"
                                name="number"
                                maxLength={16}
                                value={form.number}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 tracking-widest focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                                placeholder="1234 5678 9012 3456"
                            />
                        </div>

                        {/* Expiración + CVC */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Expiración
                                </label>
                                <input
                                    type="text"
                                    name="expiry"
                                    placeholder="MM/YY"
                                    value={form.expiry}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    CVC
                                </label>
                                <input
                                    type="text"
                                    name="cvc"
                                    maxLength={4}
                                    value={form.cvc}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
                                />
                            </div>
                        </div>

                        {/* Botón */}
                        <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-700 active:scale-95"
                        >
                            <Lock size={18} />
                            Pagar Ahora
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                        Tus datos están protegidos con encriptación SSL.
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
