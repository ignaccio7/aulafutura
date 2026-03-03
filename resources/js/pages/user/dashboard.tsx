import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Book, Video, CreditCard, ChevronRight, Clock, Award, Star } from 'lucide-react';
import ReactEcharts from 'echarts-for-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Mi Dashboard', href: '/user/dashboard' },
];

interface Props {
  membership: {
    plan: string;
    active: boolean;
    expires_at: string;
    price: string;
  };
  stats: {
    total_books: number;
    total_courses: number;
    completed_lessons: number;
    total_lessons: number;
  };
  courseProgress: { name: string; progress: number }[];
  recentCourses: { id: number; title: string; instructor: string; progress: number; image: string }[];
  purchasedBooks: { id: number; title: string; author: string; image: string }[];
}

export default function UserDashboard({ membership, stats, courseProgress, recentCourses, purchasedBooks }: Props) {

  const progressOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      max: 100,
      axisLabel: { formatter: '{value}%' }
    },
    yAxis: {
      type: 'category',
      data: courseProgress.map(i => i.name),
      axisLabel: {
        fontSize: 12,
        fontWeight: 'bold'
      }
    },
    series: [
      {
        name: 'Progreso',
        type: 'bar',
        data: courseProgress.map(i => i.progress),
        itemStyle: {
          color: '#3b82f6',
          borderRadius: [0, 10, 10, 0]
        },
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.1)',
          borderRadius: [0, 10, 10, 0]
        }
      }
    ]
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Mi Panel - Aula Futura" />

      <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Hola, Bienvenido de nuevo 👋</h1>
            <p className="text-muted-foreground mt-1 text-lg">Aquí tienes un resumen de tu actividad y progreso.</p>
          </div>
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-muted"
                src={`https://i.pravatar.cc/100?u=${i}`}
                alt="User"
              />
            ))}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 ring-2 ring-white text-xs font-bold">
              +12
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 rounded-3xl border bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Book className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mis Libros</p>
                <h4 className="text-2xl font-bold">{stats.total_books}</h4>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-3xl border bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                <Video className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mis Cursos</p>
                <h4 className="text-2xl font-bold">{stats.total_courses}</h4>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-3xl border bg-linear-to-br from-blue-600 to-indigo-700 text-white shadow-lg hover:scale-[1.02] transition-transform col-span-2">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl">
                <Star className="h-6 w-6 fill-white" />
              </div>
              <div>
                <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Plan Activo</p>
                <h4 className="text-xl font-bold">{membership.plan}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Progress Chart */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl border bg-white shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Progreso de Cursos</h3>
                <button className="text-sm text-blue-600 font-semibold hover:underline">Ver detalles</button>
              </div>
              <ReactEcharts option={progressOption} style={{ height: '300px' }} />
            </div>

            {/* Recent Courses */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Continuar Aprendiendo</h3>
                <Link href="/user/courses" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                  Ver todos <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {recentCourses.map((course) => (
                  <div key={course.id} className="group p-4 rounded-2xl border bg-white hover:border-blue-200 transition-colors flex gap-4">
                    <img src={course.image} className="h-20 w-28 rounded-xl object-cover" alt={course.title} />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h5 className="font-bold leading-tight group-hover:text-blue-600 transition-colors">{course.title}</h5>
                        <p className="text-xs text-muted-foreground">{course.instructor}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                          <span>Progreso</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 transition-all duration-700" style={{ width: `${course.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Membership Details */}
            <div className="p-6 rounded-3xl border bg-slate-50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                <CreditCard className="h-24 w-24 text-slate-900" />
              </div>
              <h3 className="text-lg font-bold mb-4">Tu Membresía</h3>
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-sm text-muted-foreground">Estado</span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold uppercase">Activo</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-sm text-muted-foreground">Vence el</span>
                  <span className="text-sm font-semibold">{membership.expires_at}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-sm text-muted-foreground">Pago mensual</span>
                  <span className="text-sm font-semibold">{membership.price}</span>
                </div>
                <button className="w-full mt-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold shadow-sm hover:bg-slate-100 transition-colors">
                  Gestionar Suscripción
                </button>
              </div>
            </div>

            {/* Purchased Books */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Mis Últimos Libros</h3>
                <Link href="/user/books" className="text-sm text-muted-foreground hover:text-foreground">Ver todos</Link>
              </div>
              <div className="space-y-3">
                {purchasedBooks.map((book) => (
                  <div key={book.id} className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-transparent hover:border-blue-100 hover:shadow-sm transition-all">
                    <img src={book.image} className="h-14 w-10 rounded-lg shadow-sm bg-muted object-cover" alt={book.title} />
                    <div className="flex-1 min-w-0">
                      <h6 className="font-bold text-sm truncate">{book.title}</h6>
                      <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                    </div>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                      <Clock className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
