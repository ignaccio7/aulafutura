import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { PlayCircle, Award, Clock, BookOpen } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Mi Dashboard', href: '/user/dashboard' },
  { title: 'Mis Cursos', href: '/user/courses' },
];

export default function UserCourses() {
  // Datos de ejemplo
  const courses = [
    {
      id: 1,
      title: 'Matemáticas Divertidas para Primaria',
      instructor: 'Profa. Carmen García',
      thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=400',
      progress: 65,
      lessons: 24,
      totalTime: '12h 30m',
    },
    {
      id: 2,
      title: 'Introducción a la Ciencias Naturales',
      instructor: 'Dr. Roberto Sánchez',
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400',
      progress: 10,
      lessons: 18,
      totalTime: '8h 45m',
    },
    {
      id: 3,
      title: 'Lectoescritura Creativa',
      instructor: 'Elena Martínez',
      thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400',
      progress: 100,
      lessons: 15,
      totalTime: '6h 15m',
    }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Mis Cursos - Aula Futura" />

      <div className="flex flex-col gap-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Mis Cursos</h1>
            <p className="mt-1 text-muted-foreground">Continúa tu aprendizaje donde lo dejaste.</p>
          </div>
          <div className="hidden md:block">
            <BookOpen className="h-12 w-12 text-green-500/20" />
          </div>
        </div>

        {courses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <div key={course.id} className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-md">
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100 hover:bg-black/40 cursor-pointer">
                    <PlayCircle className="h-16 w-16 text-white drop-shadow-lg" />
                  </div>
                  {course.progress === 100 && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Award className="h-3 w-3" /> Completado
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-4">
                    <h3 className="font-bold text-xl leading-tight mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.instructor}</p>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {course.totalTime}
                      </div>
                      <div>{course.progress}% completado</div>
                    </div>

                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${course.progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>

                    <button className="w-full mt-5 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group">
                      {course.progress === 0 ? 'Empezar Curso' : course.progress === 100 ? 'Repasar Contenido' : 'Continuar Aprendizaje'}
                      <PlayCircle className="h-4 w-4 transition-transform group-hover:scale-110" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-3xl">
            <PlayCircle className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold">No tienes cursos activos</h2>
            <p className="text-muted-foreground mt-2 max-w-sm">Descubre cursos increíbles y potencia tus habilidades hoy.</p>
            <a href="/catalog" className="mt-6 px-6 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors">
              Ver Catálogo de Cursos
            </a>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
