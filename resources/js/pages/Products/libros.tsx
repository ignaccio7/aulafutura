import { Link, usePage } from '@inertiajs/react';
import React from 'react';

// 1. Mantenemos tu interfaz intacta
export interface Product {
    id: number;
    category_id: number;
    title: string;
    description: string | null;
    price: string | number;
    type: 'book' | 'course';
    thumbnail: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface IndexProps {
    products: Product[];
    [key: string]: unknown;
}

export default function LibrosLanding() {
    const { products } = usePage<IndexProps>().props;

    return (
        <div className="mx-auto max-w-6xl p-4 md:p-8">
            <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
                Nuestra Colección de Libros
            </h1>

            {/* Grid para las tarjetas de productos */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                        {/* Imagen del libro */}
                        <div className="flex h-56 items-center justify-center bg-gray-100">
                            {product.thumbnail ? (
                                <img
                                    src={`/storage/${product.thumbnail}`}
                                    alt={product.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-gray-400">Sin portada</span>
                            )}
                        </div>

                        {/* Contenido de la tarjeta */}
                        <div className="flex flex-grow flex-col p-4">
                            <h2 className="mb-2 text-lg font-semibold text-gray-800 line-clamp-2">
                                {product.title}
                            </h2>

                            <p className="mb-4 flex-grow text-sm text-gray-600 line-clamp-3">
                                {product.description || 'Sin descripción disponible.'}
                            </p>

                            <div className="mt-auto flex items-center justify-between">
                                <span className="text-xl font-bold text-green-600">
                                    ${product.price}
                                </span>

                                {/* Aquí podrías poner un Link hacia una ruta que muestre el detalle del libro */}
                                <button className="rounded bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700">
                                    Ver Detalles
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mensaje por si no hay libros activos */}
            {products.length === 0 && (
                <div className="mt-12 text-center text-gray-500">
                    <p>No hay libros disponibles en este momento.</p>
                </div>
            )}
        </div>
    );
}
