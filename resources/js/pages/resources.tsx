import { usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import Catalog from '@/components/Catalog';
import { ArrowRight, BookOpen, Star, Video } from 'lucide-react';

export default function Books({}) {
    const { auth, products, filters } = usePage().props;
    
    return (
        <PublicLayout title="Libros">
            {/* --- SECCIÓN DESTACADOS (Libros/Cursos) --- */}
            {products ? (
                <Catalog products={products} filters={filters} />
            ) : (
                <div className="py-24 text-center">Cargando catálogo...</div>
            )}
        </PublicLayout>
    );
}
