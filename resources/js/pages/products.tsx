import { Head, Link } from '@inertiajs/react';

import { Product } from '@/types/product';

interface Props {
    products: Product[]
}

export default function Index({ products }: Props) {
    return (
        <>
            <Head title="Products" />

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">
                    Lista de Productos
                </h1>

                <div className="grid gap-4">
                    {products.map(product => (
                        <div
                            key={product.id}
                            className="border p-4 rounded shadow"
                        >
                            <h2 className="font-semibold">
                                {product.name}
                            </h2>
                            <p className="text-gray-600">
                                ${product.price}
                            </p>
                        </div>
                    ))}
                </div>

                <Link
                    href="/"
                    className="inline-block mt-4 text-blue-500"
                >
                    Volver al inicio
                </Link>
            </div>
        </>
    );
}
