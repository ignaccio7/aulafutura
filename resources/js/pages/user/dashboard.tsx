import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Mi Dashboard', href: '/user/dashboard' },
];

export default function UserDashboard() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Usuario - Dashboard" />

      <div className="flex flex-col gap-6 p-4">
        <div className="rounded-2xl border bg-gradient-to-b from-background to-muted p-6 text-center">
          <h2 className="text-2xl font-bold">¡Bienvenido a tu panel de usuario!</h2>
          <p className="mt-2 text-muted-foreground">Aquí podrás ver tus cursos, libros y suscripciones.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border p-4 bg-white shadow-sm">
            <h4 className="text-sm font-medium text-muted-foreground">Mis Libros</h4>
            <p className="mt-2 text-3xl font-bold text-blue-600">0</p>
          </div>
          <div className="rounded-xl border p-4 bg-white shadow-sm">
            <h4 className="text-sm font-medium text-muted-foreground">Mis Cursos</h4>
            <p className="mt-2 text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="rounded-xl border p-4 bg-white shadow-sm">
            <h4 className="text-sm font-medium text-muted-foreground">Suscripción</h4>
            <p className="mt-2 text-lg font-semibold text-orange-600 font-mono italic">Ninguna</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
