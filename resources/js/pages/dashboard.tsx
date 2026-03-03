import { Head } from '@inertiajs/react';
import ReactEcharts from 'echarts-for-react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { useState } from 'react';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ShoppingBag, BookOpen, Rocket, CreditCard, User } from 'lucide-react';

interface Activity {
    id: number;
    type: 'subscription' | 'book_purchase' | 'book_published' | 'course_published';
    user: string;
    description: string;
    time: string;
}

enum FilterValue {
    LAST_30_DAYS = '30d',
    LAST_7_DAYS = '7d',
    THIS_YEAR = 'year',
    RANGE = 'range'
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
];

export function FilterButton({ children, active, handleClick, value }: { children: React.ReactNode, active: boolean, handleClick: (filter: string) => void, value: string }) {
    return (
        <button
            onClick={() => handleClick(value)}
            className={`px-4 py-2 rounded-full 
            ${active ? 'bg-blue-500 text-white font-bold' : 'bg-gray-200 font-medium text-gray-600'}
            hover:bg-blue-500 hover:text-white transition-colors duration-300 cursor-pointer
        `}>
            {children}
        </button>
    )
}

export default function Dashboard({ revenueData }: { revenueData: { month: string, total: number }[] }) {

    const [activeFilter, setActiveFilter] = useState('30d')

    const handleFilter = (filter: string) => {
        setActiveFilter(filter)
    }


    const membershipsData = [
        { month: 'Enero', active: 10, expired: 2, cancelled: 1 },
        { month: 'Febrero', active: 5, expired: 0, cancelled: 2 },
        { month: 'Marzo', active: 7, expired: 5, cancelled: 1 },
        { month: 'Abril', active: 3, expired: 2, cancelled: 0 },
        { month: 'Mayo', active: 3, expired: 2, cancelled: 0 },
        { month: 'Junio', active: 3, expired: 2, cancelled: 0 },
        { month: 'Julio', active: 3, expired: 2, cancelled: 0 },
    ];

    const optionMemberShips = {
        title: {
            text: 'Memebresias por mes',
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        tooltip: {},
        legend: {
            data: ['Activas', 'Expiradas', 'Canceladas'],
        },
        xAxis: {
            data: membershipsData.map((item) => item.month),
        },
        yAxis: {},
        series: [
            {
                name: 'Activas',
                type: 'bar',
                data: membershipsData.map((item) => item.active),
            },
            {
                name: 'Expiradas',
                type: 'bar',
                data: membershipsData.map((item) => item.expired),
            },
            {
                name: 'Canceladas',
                type: 'bar',
                data: membershipsData.map((item) => item.cancelled),
            },
        ],
    };

    const ordersData = [
        { month: 'Enero', paid: 12, pending: 3, failed: 1 },
        { month: 'Febrero', paid: 20, pending: 5, failed: 2 },
        { month: 'Marzo', paid: 18, pending: 4, failed: 3 },
        { month: 'Abril', paid: 25, pending: 2, failed: 1 },
    ];

    const optionOrders = {
        title: {
            text: 'Compras pagadas por mes',
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            type: 'category',
            data: ordersData.map((item) => item.month),
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: 'Pagadas',
                type: 'line',
                data: ordersData.map((item) => item.paid),
            },
            {
                name: 'Falladas',
                type: 'line',
                data: ordersData.map((item) => item.failed),
            },
        ],
    };

    // const revenueData = [
    //     { month: 'Enero', total: 1200 },
    //     { month: 'Febrero', total: 3200 },
    //     { month: 'Marzo', total: 5000 },
    //     { month: 'Abril', total: 8200 },
    //     { month: 'Mayo', total: 10000 },
    // ];

    const optionRevenue = {
        title: {
            text: 'Total recaudado',
            left: 'center'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line'
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: revenueData?.map(i => i.month) || []
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Ingresos',
                type: 'line',
                smooth: true,
                data: revenueData?.map(i => i.total) || [],
                symbol: 'circle',
                symbolSize: 10,
                lineStyle: {
                    color: '#3b82f6',
                    width: 4
                },
                itemStyle: {
                    color: '#3b82f6'
                },
                areaStyle: {
                    opacity: 0.2,
                    color: '#3b82f6'
                }
            }
        ]
    }

    const activities: Activity[] = [
        { id: 1, type: 'subscription', user: 'Juan Perez', description: 'se unió al Plan Premium', time: 'hace 5 min' },
        { id: 2, type: 'book_purchase', user: 'Maria Garcia', description: 'compró el libro "Aprende React"', time: 'hace 15 min' },
        { id: 3, type: 'book_published', user: 'Tú', description: 'publicaste el libro "Mastering TypeScript"', time: 'hace 1 hora' },
        { id: 4, type: 'course_published', user: 'Tú', description: 'publicaste el curso "Laravel & Inertia"', time: 'hace 3 horas' },
        { id: 5, type: 'subscription', user: 'Carlos Ruiz', description: 'se unió al Plan Básico', time: 'hace 5 horas' },
    ];

    const getIcon = (type: Activity['type']) => {
        switch (type) {
            case 'subscription': return <CreditCard className="w-4 h-4 text-blue-500" />;
            case 'book_purchase': return <ShoppingBag className="w-4 h-4 text-green-500" />;
            case 'book_published': return <BookOpen className="w-4 h-4 text-purple-500" />;
            case 'course_published': return <Rocket className="w-4 h-4 text-orange-500" />;
        }
    }

    const [startDate, setStartDate] = useState<Date | null | undefined>(
        new Date()
    );
    const [endDate, setEndDate] = useState<Date | null | undefined>(new Date());

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <main className='py-6'>

                <section className="filters px-8">
                    <div className='flex flex-row gap-2 items-center'>
                        <FilterButton handleClick={handleFilter} value={FilterValue.LAST_30_DAYS} active={activeFilter === FilterValue.LAST_30_DAYS}>Ultimos 30 dias</FilterButton>
                        <FilterButton handleClick={handleFilter} value={FilterValue.LAST_7_DAYS} active={activeFilter === FilterValue.LAST_7_DAYS}>Ultimos 7 dias</FilterButton>
                        <FilterButton handleClick={handleFilter} value={FilterValue.THIS_YEAR} active={activeFilter === FilterValue.THIS_YEAR}>Este año</FilterButton>
                        <FilterButton handleClick={handleFilter} value={FilterValue.RANGE} active={activeFilter === FilterValue.RANGE}>Seleccionar rango</FilterButton>
                    </div>
                    {
                        FilterValue.RANGE === activeFilter && (
                            <div className='my-4 flex flex-row gap-2'>
                                <div className="flex flex-row items-center gap-1">
                                    <span className="text-xs font-bold text-gray-400 uppercase ml-1">Inicio :</span>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date: Date | null | undefined) => setStartDate(date)}
                                        selectsStart
                                        startDate={startDate ?? undefined}
                                        endDate={endDate ?? undefined}
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-40"
                                        placeholderText="Fecha inicio"
                                    />
                                </div>

                                <div className="flex flex-row items-center gap-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase ml-1">Fin :</span>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date: Date | null | undefined) => setEndDate(date)}
                                        selectsEnd
                                        startDate={startDate ?? undefined}
                                        endDate={endDate ?? undefined}
                                        minDate={startDate ?? undefined}
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-40"
                                        placeholderText="Fecha fin"
                                    />
                                </div>
                            </div>
                        )
                    }
                </section>

                <section className="charts">
                    <div>
                        <ReactEcharts
                            option={optionRevenue}
                            style={{ height: 300 }}
                        />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ReactEcharts
                                option={optionMemberShips}
                                style={{ height: 250 }}
                            />
                            <ReactEcharts
                                option={optionOrders}
                                style={{ height: 250 }}
                            />
                        </div>
                    </div>
                </section>

                <section className="history">
                    <div className="bg-white/50 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 shadow-sm w-full">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                            Actividad Reciente
                        </h3>
                        <div className="space-y-4">
                            {activities.map((activity) => (
                                <div key={activity.id} className="flex gap-4 items-start group">
                                    <div className="mt-1 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform duration-200">
                                        {getIcon(activity.type)}
                                    </div>
                                    <div className="flex-1 border-b border-gray-50 pb-3 group-last:border-0">
                                        <p className="text-sm text-gray-700">
                                            <span className="font-bold text-gray-900">{activity.user}</span> {activity.description}
                                        </p>
                                        <span className="text-xs text-gray-400 font-medium">{activity.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-200 rounded-lg">
                            Ver todo el historial
                        </button>
                    </div>
                </section>
            </main>
        </AppLayout>
    );
}
