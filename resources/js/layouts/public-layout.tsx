import { Head } from '@inertiajs/react';
import { NavBar } from '@/components/nav-bar';

export default function PublicLayout({
    title = 'Aulafutura',
    toolbar = true,
    children,
}: {
    title?: string;
    toolbar?: boolean;
    children: React.ReactNode;
}) {
    return (
        <>
            <Head title={title} />
            {/* --- NAVBAR --- */}
            <NavBar />
            <div className={`toolbar h-20 ${!toolbar ? 'hidden' : 'block'}`} />
            <main className="">
                {/* --- CONTENT --- */}
                {children}
            </main>
        </>
    );
}
