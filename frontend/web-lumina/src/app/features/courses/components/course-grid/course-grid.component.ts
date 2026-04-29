import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface GridCourse {
  id: number;
  title: string;
  subtitle: string;
  fullDescription: string;
  currentPrice: number;
  originalPrice?: number;
  discountPercent?: number;
  currency: string;
  hasGreenBadge?: boolean;
  instructor?: string;
}

@Component({
  selector: 'app-course-grid',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-12">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-bold text-white flex items-center">
          <span class="w-2 h-8 bg-sky-500 rounded-full mr-3"></span>
          Todos nuestros cursos
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        @for (course of courses; track course.id) {
          <div class="relative group h-full">
            <!-- Normal Card Content -->
            <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 h-full flex flex-col justify-between transition-all duration-300 group-hover:border-slate-500 cursor-pointer">
              
              <div>
                <!-- Badge and Title -->
                <div class="flex justify-between items-start mb-2">
                  <h3 class="text-xl font-bold text-white leading-tight uppercase">{{ course.title }}</h3>
                  @if (course.hasGreenBadge) {
                    <div class="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                  }
                </div>
                <!-- Subtitle -->
                <p class="text-slate-400 text-sm mb-6 uppercase tracking-wider font-medium line-clamp-2">
                  {{ course.subtitle }}
                </p>
              </div>

              <!-- Footer (reemplazo de precios) -->
              <div class="mt-auto pt-4">
                <span class="inline-block bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-1 rounded">
                  Incluido en Premium
                </span>
              </div>
            </div>

            <!-- Hover Popup (Hidden by default, shown on group-hover) -->
            <div class="absolute left-0 top-0 w-full min-h-full bg-slate-800 rounded-xl border border-sky-500/50 shadow-2xl p-6 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform scale-95 group-hover:scale-100 flex flex-col origin-top">
              <h3 class="text-xl font-bold text-white mb-2 uppercase">{{ course.title }}</h3>
              <p class="text-slate-300 text-sm flex-grow mb-6">
                {{ course.fullDescription }}
              </p>
              
              @if (course.instructor) {
                <p class="text-slate-400 text-xs mb-4">
                  Instructor: <span class="text-white">{{ course.instructor }}</span>
                </p>
              }

              <!-- Omitimos precio en popup -->
              <div class="mb-4">
                <span class="text-emerald-400 text-xs font-bold">Disponible con Premium</span>
              </div>

              <button class="w-full bg-sky-500 hover:bg-sky-400 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
                Más información
              </button>
            </div>

          </div>
        }
      </div>
    </div>
  `
})
export class CourseGridComponent {
  courses: GridCourse[] = [
    {
      id: 1,
      title: "CURSOR",
      subtitle: "PROGRAMACIÓN ASISTIDA CON IA AVANZADA",
      fullDescription: "Domina el uso de Cursor, el editor de código potenciado por IA. Aprende a integrar agentes, autocompletado avanzado y refactorización inteligente para multiplicar tu productividad como desarrollador.",
      currentPrice: 157.99,
      originalPrice: 249.99,
      discountPercent: 37,
      currency: "BS",
      hasGreenBadge: true,
      instructor: "Carlos Dev"
    },
    {
      id: 2,
      title: "AFFINITY STUDIO",
      subtitle: "DISEÑO GRÁFICO PROFESIONAL",
      fullDescription: "Aprende a dominar Affinity Designer, Photo y Publisher. Crea ilustraciones vectoriales, edita fotografías y maqueta documentos profesionales sin suscripciones mensuales.",
      currentPrice: 120.00,
      originalPrice: 180.00,
      discountPercent: 33,
      currency: "BS",
      instructor: "Laura Design"
    },
    {
      id: 3,
      title: "NEXT.JS",
      subtitle: "DESARROLLO WEB REACT FULL-STACK",
      fullDescription: "Aprende a construir aplicaciones web ultra rápidas y escalables con Next.js 14. Incluye Server Components, Server Actions, enrutamiento avanzado y optimización SEO.",
      currentPrice: 210.50,
      originalPrice: 299.99,
      discountPercent: 30,
      currency: "BS",
      hasGreenBadge: true,
      instructor: "Fernando Tech"
    },
    {
      id: 4,
      title: "FIGMA AVANZADO",
      subtitle: "SISTEMAS DE DISEÑO Y PROTOTIPADO",
      fullDescription: "Crea interfaces escalables usando Design Systems en Figma. Domina los auto layouts, variables, componentes interactivos y prototipado de alta fidelidad.",
      currentPrice: 99.99,
      originalPrice: 150.00,
      discountPercent: 33,
      currency: "BS"
    },
    {
      id: 5,
      title: "DOCKER & KUBERNETES",
      subtitle: "DESPLIEGUE Y ORQUESTACIÓN DE CONTENEDORES",
      fullDescription: "Aprende a contenerizar tus aplicaciones con Docker y orquestarlas a gran escala con Kubernetes. Ideal para perfiles DevOps y Backend.",
      currentPrice: 180.00,
      currency: "BS",
      hasGreenBadge: true
    },
    {
      id: 6,
      title: "ANGULAR 18",
      subtitle: "DESARROLLO DE SPAS MODERNAS",
      fullDescription: "Domina el nuevo Angular con Signals, Standalone Components, y el nuevo control flow. Construye aplicaciones reactivas empresariales desde cero.",
      currentPrice: 145.00,
      originalPrice: 200.00,
      discountPercent: 27,
      currency: "BS",
      instructor: "Maria Coder"
    },
    {
      id: 7,
      title: "NODE.JS CON NESTJS",
      subtitle: "BACKEND ESCALABLE CON TYPESCRIPT",
      fullDescription: "Desarrolla APIs robustas usando NestJS, TypeORM, y bases de datos relacionales. Implementa autenticación, microservicios y WebSockets de forma profesional.",
      currentPrice: 160.00,
      currency: "BS"
    },
    {
      id: 8,
      title: "MACHINE LEARNING",
      subtitle: "FUNDAMENTOS Y APLICACIÓN CON PYTHON",
      fullDescription: "Iníciate en la inteligencia artificial. Crea modelos predictivos utilizando Scikit-Learn, Pandas y TensorFlow. Comprende cómo la IA está cambiando la industria.",
      currentPrice: 250.00,
      originalPrice: 350.00,
      discountPercent: 28,
      currency: "BS",
      hasGreenBadge: true
    },
    {
      id: 9,
      title: "TAILWINDCSS",
      subtitle: "DISEÑO WEB RÁPIDO Y MODERNO",
      fullDescription: "Olvídate del CSS tradicional. Aprende a crear interfaces complejas y responsivas en tiempo récord directamente en tu HTML utilizando clases utilitarias.",
      currentPrice: 85.00,
      originalPrice: 120.00,
      discountPercent: 29,
      currency: "BS"
    },
    {
      id: 10,
      title: "CYBERSECURITY",
      subtitle: "PENTESTING Y DEFENSA DE REDES",
      fullDescription: "Conviértete en un experto en ciberseguridad. Aprende a detectar vulnerabilidades en sistemas y aplicaciones web, y descubre cómo proteger infraestructuras digitales.",
      currentPrice: 300.00,
      currency: "BS",
      hasGreenBadge: true
    },
    {
      id: 11,
      title: "REACT NATIVE",
      subtitle: "DESARROLLO DE APPS MÓVILES",
      fullDescription: "Usa tus conocimientos de React para construir aplicaciones móviles nativas para iOS y Android con una sola base de código.",
      currentPrice: 195.00,
      originalPrice: 250.00,
      discountPercent: 22,
      currency: "BS"
    },
    {
      id: 12,
      title: "RUST PROGRAMMING",
      subtitle: "SISTEMAS SEGUROS Y CONCURRENTES",
      fullDescription: "Descubre el lenguaje que está revolucionando la programación de sistemas. Aprende sobre el ownership, borrow checker y concurrencia sin miedo.",
      currentPrice: 175.00,
      currency: "BS"
    }
  ];
}
