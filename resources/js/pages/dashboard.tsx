import { Head } from '@inertiajs/react';
import ReactEcharts from 'echarts-for-react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
];

export default function Dashboard() {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <ReactEcharts
                        option={optionMemberShips}
                        style={{ height: 400 }}
                    />
                    <ReactEcharts
                        option={optionOrders}
                        style={{ height: 400 }}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
