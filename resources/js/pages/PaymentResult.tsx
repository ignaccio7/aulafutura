import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

interface Props {
    status: 'success' | 'failure' | 'pending';
    message: string;
}

export default function PaymentResult() {
    const { status, message } = usePage<{ props: Props }>()
        .props as unknown as Props;

    const config = {
        success: {
            icon: CheckCircle,
            color: 'text-green-500',
            bg: 'bg-green-50',
            title: '¡Pago exitoso!',
        },
        failure: {
            icon: XCircle,
            color: 'text-red-500',
            bg: 'bg-red-50',
            title: 'Pago fallido',
        },
        pending: {
            icon: Clock,
            color: 'text-yellow-500',
            bg: 'bg-yellow-50',
            title: 'Pago pendiente',
        },
    }[status];

    const Icon = config.icon;

    return (
        <PublicLayout title="Resultado del pago">
            <Head title="Resultado del pago" />
            <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div
                    className={`w-full max-w-md rounded-3xl p-10 text-center shadow-xl ${config.bg}`}
                >
                    <Icon
                        size={64}
                        className={`mx-auto mb-4 ${config.color}`}
                    />
                    <h1 className="mb-2 text-2xl font-bold">{config.title}</h1>
                    <p className="mb-6 text-slate-600">{message}</p>
                    <Link
                        href="/suscripciones"
                        className="inline-block rounded-2xl bg-blue-600 px-8 py-3 font-bold text-white hover:bg-blue-700"
                    >
                        Ver planes
                    </Link>
                </div>
            </div>
        </PublicLayout>
    );
}
