import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile Settings</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Profile information"

                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{ preserveScroll: true }}
                        className="mx-auto w-full max-w-md space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                {/* HEADER */}
                                <header className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        className="text-xl font-bold"
                                    >
                                        ←
                                    </button>

                                    <h2 className="text-lg font-semibold">Perfil</h2>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                    >
                                        Guardar
                                    </Button>
                                </header>

                                {/* USER INFO */}
                                <section className="flex flex-col items-center gap-2">
                                    <div className="relative flex flex-col items-end justify-end">
                                        <img
                                            src="/gipsy.jpg"
                                            alt="Avatar"
                                            className="h-[100px] w-[100px] rounded-full object-cover object-center"
                                        />

                                        <button
                                            type="button"
                                            className="absolute bottom-0 right-0 rounded-full bg-neutral-800 px-2 py-1 text-xs text-white"
                                        >
                                            ✎
                                        </button>
                                    </div>

                                    <h2 className="text-lg font-semibold">
                                        {auth.user.name}
                                    </h2>

                                    <span className="text-sm text-muted-foreground">
                                        Miembro desde 2021
                                    </span>
                                </section>

                                {/* PLAN */}
                                <section className="space-y-2 rounded-lg border border-neutral-300 p-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Plan actual</span>
                                        <span className="font-medium text-green-600">
                                            Activo
                                        </span>
                                    </div>

                                    <h2 className="text-lg font-semibold">
                                        Premium Pro
                                    </h2>

                                    <span className="text-sm text-muted-foreground">
                                        Renueva el 25 de noviembre del 2026
                                    </span>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Gestionar suscripción
                                    </Button>
                                </section>

                                {/* PERSONAL INFO */}
                                <section className="space-y-4">
                                    <h3 className="font-semibold">
                                        Información personal
                                    </h3>

                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nombre completo</Label>

                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={auth.user.name}
                                            required
                                        />

                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Correo</Label>

                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            defaultValue={auth.user.email}
                                            required
                                        />

                                        <InputError message={errors.email} />
                                    </div>
                                </section>

                                {/* SECURITY */}
                                <section className="space-y-4">
                                    <h3 className="font-semibold">Seguridad</h3>

                                    <div className="grid gap-2">
                                        <Label>Nueva contraseña</Label>
                                        <Input type="password" />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Confirmar contraseña</Label>
                                        <Input type="password" />
                                    </div>

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        className="w-full"
                                    >
                                        Cerrar sesión
                                    </Button>
                                </section>

                                {/* FEEDBACK */}
                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition-opacity"
                                    enterFrom="opacity-0"
                                    leave="transition-opacity"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-green-600">
                                        Guardado correctamente
                                    </p>
                                </Transition>
                            </>
                        )}
                    </Form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
