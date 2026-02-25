import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="flex flex-col gap-6 p-4">
                {/* FILTROS */}
                <div className="flex gap-2">
                    {['Last 30 Days', 'Last 7 Days', 'This Year', 'Custom'].map(
                        (label, i) => (
                            <button
                                key={label}
                                className={`rounded-full px-4 py-2 text-sm ${
                                    i === 0
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                {label}
                            </button>
                        ),
                    )}
                </div>

                {/* TOTAL REVENUE */}
                <div className="rounded-2xl border bg-gradient-to-b from-background to-muted p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm text-muted-foreground">
                            Ingresos totales
                        </h3>
                        {/* <span className="rounded bg-green-500/10 px-2 py-1 text-xs text-green-500">
                            +15.2%
                        </span> */}
                    </div>

                    <p className="mt-2 text-3xl font-bold">S 45,200</p>

                    {/* Placeholder gráfico */}
                    <div className="mt-4 h-24 rounded-lg bg-gradient-to-r from-blue-600/20 via-blue-500/40 to-blue-600/20" />
                </div>

                {/* STATS */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border p-4">
                        <h4 className="text-sm text-muted-foreground">
                            Suscripciones activas
                        </h4>
                        <p className="mt-2 text-2xl font-semibold">
                            480
                            {/* <span className="text-sm text-green-500">+12%</span> */}
                        </p>
                    </div>

                    <div className="rounded-xl border p-4">
                        <h4 className="text-sm text-muted-foreground">
                            Libros vendidos
                        </h4>
                        <p className="mt-2 text-2xl font-semibold">
                            289
                            {/* <span className="text-sm text-green-500">+0.5%</span> */}
                        </p>
                        {/* <div className="mt-3 h-2 rounded-full bg-muted">
                            <div className="h-full w-1/3 rounded-full bg-cyan-400" />
                        </div> */}
                    </div>
                </div>

                {/* MONTHLY SALES */}
                {
                    <div className="rounded-2xl border bg-gradient-to-b from-background to-muted/40 p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium">Monthly Sales Trend</h3>
                            {/* <span className="text-sm text-red-500">
            -2.4% vs prev.
        </span> */}
                        </div>

                        {/* Chart */}
                        <div className="mt-6 grid grid-cols-7 gap-4">
                            {[
                                { day: 'MON', value: 40 },
                                { day: 'TUE', value: 65 },
                                { day: 'WED', value: 30 },
                                { day: 'THU', value: 80 },
                                { day: 'FRI', value: 55 },
                                { day: 'SAT', value: 95 },
                                { day: 'SUN', value: 70 },
                            ].map((item, i) => (
                                <div
                                    key={item.day}
                                    className="flex flex-col items-center gap-2"
                                >
                                    {/* Bar */}
                                    <div className="flex h-32 items-end">
                                        <div
                                            className={`w-10 rounded-xl transition-all duration-300 ${
                                                item.day === 'SAT'
                                                    ? 'bg-gradient-to-t from-blue-600 to-blue-400 shadow-lg shadow-blue-500/30'
                                                    : 'bg-gradient-to-t from-blue-600/40 to-blue-400/20'
                                            } hover:scale-y-105`}
                                            style={{ height: `${item.value}%` }}
                                        />
                                    </div>

                                    {/* Label */}
                                    <span className="text-xs text-muted-foreground">
                                        {item.day}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                }

                {/* TOP SELLING */}
                <div className="content grid grid-cols-2 gap-4">
                    <div className="rounded-xl border p-6">
                        <h3 className="mb-4 font-semibold">
                            Libros más vendidos
                        </h3>

                        {[
                            ['Fullstack React Mastery', 'S 4.2k', '94%'],
                            ['UI Design Principles', 'S 3.8k', '60%'],
                            ['Marketing Automation', 'S 3.1k', '48%'],
                        ].map(([name, value, percent], i) => (
                            <div key={name} className="mb-4">
                                <div className="flex justify-between text-sm">
                                    <span>
                                        {i + 1}. {name}
                                    </span>
                                    <span>{value}</span>
                                </div>
                                <div className="mt-2 h-2 rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-blue-600"
                                        style={{ width: percent }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="rounded-xl border p-6">
                        <h3 className="mb-4 font-semibold">
                            Cursos más vendidos
                        </h3>

                        {[
                            ['Curso completo de física escolar', 'S 2k', '76%'],
                            [
                                'Arquitectura de sistemas para entornos de salud',
                                'S 1.8k',
                                '32%',
                            ],
                            [
                                'Matemática básica para secundaria',
                                'S 1.1k',
                                '20%',
                            ],
                        ].map(([name, value, percent], i) => (
                            <div key={name} className="mb-4">
                                <div className="flex justify-between text-sm">
                                    <span>
                                        {i + 1}. {name}
                                    </span>
                                    <span>{value}</span>
                                </div>
                                <div className="mt-2 h-2 rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-blue-600"
                                        style={{ width: percent }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
