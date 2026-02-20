import { usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

interface Category {
    id: number;
    name: string;
}

interface Lesson {
    id: number;
    duration: number | null;
}

interface Course {
    id: number;
    total_duration: number | null;
    lessons: Lesson[];
}

interface Product {
    id: number;
    title: string;
    category: Category;
    course: Course;
}

interface Filters {
    category: number | null;
}

interface PageProps extends InertiaPageProps {
    products: {
        data: Product[];
    };
    categories: Category[];
    filters: Filters;
}

export default function Courses() {
    const { products } = usePage<PageProps>().props;

    const courseList = products?.data ?? [];

    return (
        <div style={{ padding: '20px' }}>
            <h1>Catálogo de Cursos</h1>

            {courseList.length === 0 ? (
                <p>No hay cursos disponibles.</p>
            ) : (
                courseList.map((producto) => (
                    <div key={producto.id} style={{ marginBottom: '20px' }}>
                        <h2>{producto.title}</h2>
                        <p>Tema: {producto.category?.name}</p>
                    </div>
                ))
            )}
        </div>
    );
}
