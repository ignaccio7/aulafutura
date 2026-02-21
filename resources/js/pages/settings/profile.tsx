import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { BreadcrumbItem } from '@/types';
import AvatarEditor from './avatar';
import { ChangeEvent, useRef, useState } from 'react';

/* Avatar */
/* import { useForm } from '@inertiajs/react'; */

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

interface verifyInfo {
    mustVerifyEmail: boolean;
    status?: File;
}

export default function Profile({mustVerifyEmail, status}: verifyInfo) {
    const { auth } = usePage().props;
    console.log("mi auth: ",auth)

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string>(
        auth.user?.avatar
            ? `/storage/${auth.user.avatar}`
            : '/usuario.png'
    );

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const onAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6 mx-auto text-center" >
                    <Heading
                        variant="small"
                        title="PERFIL"
                    />

                    <Form
                        {...ProfileController.update.form()}
                        encType="multipart/form-data"
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>

                                {/* AVATAR */}
                                <section className="flex flex-col items-center gap-2">
                                    <div className="relative">
                                        <img
                                            src={preview}
                                            alt="Avatar"
                                            className="h-[100px] w-[100px] rounded-full object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={openFilePicker}
                                            className="absolute bottom-0 right-0 rounded-full bg-neutral-800 px-2 py-1 text-xs text-white"
                                        >
                                            ✎
                                        </button>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            name="avatar"
                                            accept="image/*"
                                            onChange={onAvatarChange}
                                            className="hidden"
                                        />
                                    </div>

                                    <h2 className="text-lg font-semibold">
                                        {auth.user.name}
                                    </h2>
                                </section>
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
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nombre</Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Correo</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Correo electrónico no verificado.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Haga clic aquí para reenviar el
                                                    correo electrónico de verificación..
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    Se ha enviado un nuevo enlace de verificación
                                                    a su dirección de correo electrónico.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                    >
                                        GUARDAR
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            Guardado
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
