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

export default function Dashboard() {

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

    const revenueData = [
        { month: 'Enero', total: 1200 },
        { month: 'Febrero', total: 3200 },
        { month: 'Marzo', total: 5000 },
        { month: 'Abril', total: 8200 },
        { month: 'Mayo', total: 10000 },
    ];

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
            data: revenueData.map(i => i.month)
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Ingresos',
                type: 'line',
                smooth: true,
                data: revenueData.map(i => i.total),
                symbol: 'circle',
                symbolSize: 10,
                lineStyle: {
                    width: 4
                },
                areaStyle: {
                    opacity: 0.2
                }
            }
        ]
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
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <ReactEcharts
                            option={optionMemberShips}
                            style={{ height: 250 }}
                        />
                        <ReactEcharts
                            option={optionOrders}
                            style={{ height: 250 }}
                        />
                    </div>
                </section>
            </main>
        </AppLayout>
    );
}
