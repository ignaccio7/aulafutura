import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Book, Download, Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Mi Dashboard', href: '/user/dashboard' },
  { title: 'Mis Libros', href: '/user/books' },
];

export default function UserBooks() {
  // Datos de ejemplo
  const books = [
    {
      id: 1,
      title: 'Chips y el Largo Camino a Primavera',
      author: 'A. Futura',
      cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
      purchaseDate: '2024-02-28',
      format: 'PDF / EPUB',
    },
    {
      id: 2,
      title: 'Aventuras en el Aula Digital',
      author: 'Eduardo Tech',
      cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
      purchaseDate: '2024-01-15',
      format: 'PDF',
    }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Mis Libros - Aula Futura" />

      <div className="flex flex-col gap-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Mis Libros</h1>
            <p className="mt-1 text-muted-foreground">Accede a tu biblioteca personal de libros digitales.</p>
          </div>
          <div className="hidden md:block">
            <Book className="h-12 w-12 text-blue-500/20" />
          </div>
        </div>

        {books.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
              <div key={book.id} className="group relative overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="aspect-[3/4] overflow-hidden bg-muted">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100 flex items-end justify-center p-4">
                    <button className="w-full flex items-center justify-center gap-2 bg-white text-black py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                      <Eye className="h-4 w-4" /> Leer ahora
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg leading-tight mb-1">{book.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{book.author}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs px-2 py-1 bg-muted rounded-full font-medium">{book.format}</span>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Descargar">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-3xl">
            <Book className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold">Aún no tienes libros</h2>
            <p className="text-muted-foreground mt-2 max-w-sm">Explora nuestro catálogo y comienza a construir tu biblioteca digital hoy mismo.</p>
            <a href="/books" className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors">
              Explorar Catálogo
            </a>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
