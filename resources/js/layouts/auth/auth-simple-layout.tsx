import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-white px-6 py-4 text-[#1b1b18] lg:justify-center dark:bg-gray-900 dark:text-white">
            <header className="absolute top-0 mx-auto mb-6 flex w-full justify-between gap-2 px-6 py-2 text-sm not-has-[nav]:hidden lg:max-w-7xl lg:px-8">
                <Link href={'/'}>
                    <img src="/logo.png" alt="logo IPB" className="w-12" />
                </Link>
                <nav className="flex items-center justify-end gap-4">
                    <Link
                        href={home().url}
                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal font-bold text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                    >
                        Volver atras
                    </Link>
                </nav>
            </header>

            <div className="flex h-full w-full grow items-center justify-center">
                <div className="flex h-auto w-full gap-6 overflow-hidden rounded-lg shadow-xl md:max-w-2xl lg:max-w-4xl dark:bg-[#000d2e]/90">
                    <div className="logo hidden w-full items-center justify-center bg-[#000d2e]/70 md:flex dark:bg-white">
                        <img
                            src="/logo.png"
                            alt="Logo ipb"
                            className="h-auto w-full max-w-48"
                        />
                    </div>
                    <div className="w-full p-6 md:p-10">
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col items-center gap-4">
                                <div className="space-y-2 text-center">
                                    <h1 className="text-xl font-medium">
                                        {title}
                                    </h1>
                                    <p className="text-center text-sm text-muted-foreground">
                                        {description}
                                    </p>
                                </div>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
