import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface GridCourse {
  id: string;
  title: string;
  subtitle: string;
  fullDescription: string;
  thumbnailUrl: string;
  hasGreenBadge?: boolean;
  instructor?: string;
}

@Component({
  selector: 'app-course-grid',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
            <div class="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 h-full flex flex-col transition-all duration-300 group-hover:border-slate-500 cursor-pointer">

              <!-- Thumbnail -->
              <div class="relative overflow-hidden h-36">
                <img [src]="course.thumbnailUrl"
                     [alt]="course.title"
                     class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                     loading="lazy" />
                @if (course.hasGreenBadge) {
                  <div class="absolute top-2 right-2 w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                }
              </div>

              <div class="p-5 flex flex-col flex-grow">
                <!-- Badge and Title -->
                <h3 class="text-base font-bold text-white leading-tight uppercase mb-1">{{ course.title }}</h3>
                <!-- Subtitle -->
                <p class="text-slate-400 text-xs mb-4 uppercase tracking-wider font-medium line-clamp-2">
                  {{ course.subtitle }}
                </p>

                <!-- Footer -->
                <div class="mt-auto pt-3">
                  <span class="inline-block bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-1 rounded mb-3">
                    Incluido en Premium
                  </span>
                  <a [routerLink]="['/courses', course.id]"
                     class="w-full bg-slate-700 hover:bg-sky-500 text-slate-200 hover:text-white font-semibold py-2.5 rounded-lg transition-all duration-200 text-sm text-center flex items-center justify-center gap-1">
                    Más información →
                  </a>
                </div>
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

              <div class="mb-4">
                <span class="text-emerald-400 text-xs font-bold">Disponible con Premium</span>
              </div>

              <a [routerLink]="['/courses', course.id]"
                 class="w-full bg-sky-500 hover:bg-sky-400 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm text-center block">
                Más información
              </a>
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
      id: 'cursor',
      title: 'CURSOR',
      subtitle: 'PROGRAMACIÓN ASISTIDA CON IA AVANZADA',
      fullDescription: 'Domina el uso de Cursor, el editor de código potenciado por IA. Aprende a integrar agentes, autocompletado avanzado y refactorización inteligente para multiplicar tu productividad como desarrollador.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80',
      hasGreenBadge: true,
      instructor: 'Carlos Dev'
    },
    {
      id: 'affinity-studio',
      title: 'AFFINITY STUDIO',
      subtitle: 'DISEÑO GRÁFICO PROFESIONAL',
      fullDescription: 'Aprende a dominar Affinity Designer, Photo y Publisher. Crea ilustraciones vectoriales, edita fotografías y maqueta documentos profesionales sin suscripciones mensuales.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80',
      instructor: 'Laura Design'
    },
    {
      id: 'nextjs',
      title: 'NEXT.JS',
      subtitle: 'DESARROLLO WEB REACT FULL-STACK',
      fullDescription: 'Aprende a construir aplicaciones web ultra rápidas y escalables con Next.js 14. Incluye Server Components, Server Actions, enrutamiento avanzado y optimización SEO.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
      hasGreenBadge: true,
      instructor: 'Fernando Tech'
    },
    {
      id: 'figma-avanzado',
      title: 'FIGMA AVANZADO',
      subtitle: 'SISTEMAS DE DISEÑO Y PROTOTIPADO',
      fullDescription: 'Crea interfaces escalables usando Design Systems en Figma. Domina los auto layouts, variables, componentes interactivos y prototipado de alta fidelidad.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80'
    },
    {
      id: 'docker-kubernetes',
      title: 'DOCKER & KUBERNETES',
      subtitle: 'DESPLIEGUE Y ORQUESTACIÓN DE CONTENEDORES',
      fullDescription: 'Aprende a contenerizar tus aplicaciones con Docker y orquestarlas a gran escala con Kubernetes. Ideal para perfiles DevOps y Backend.',
      thumbnailUrl: 'https://sysarmy.com/blog/assets/docker-thumbnail.png',
      hasGreenBadge: true
    },
    {
      id: 'angular-18',
      title: 'ANGULAR 18',
      subtitle: 'DESARROLLO DE SPAS MODERNAS',
      fullDescription: 'Domina el nuevo Angular con Signals, Standalone Components, y el nuevo control flow. Construye aplicaciones reactivas empresariales desde cero.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=600&q=80',
      instructor: 'Maria Coder'
    },
    {
      id: 'node-nestjs',
      title: 'NODE.JS CON NESTJS',
      subtitle: 'BACKEND ESCALABLE CON TYPESCRIPT',
      fullDescription: 'Desarrolla APIs robustas usando NestJS, TypeORM, y bases de datos relacionales. Implementa autenticación, microservicios y WebSockets de forma profesional.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&q=80'
    },
    {
      id: 'machine-learning',
      title: 'MACHINE LEARNING',
      subtitle: 'FUNDAMENTOS Y APLICACIÓN CON PYTHON',
      fullDescription: 'Iníciate en la inteligencia artificial. Crea modelos predictivos utilizando Scikit-Learn, Pandas y TensorFlow. Comprende cómo la IA está cambiando la industria.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&q=80',
      hasGreenBadge: true
    },
    {
      id: 'tailwindcss',
      title: 'TAILWINDCSS',
      subtitle: 'DISEÑO WEB RÁPIDO Y MODERNO',
      fullDescription: 'Olvídate del CSS tradicional. Aprende a crear interfaces complejas y responsivas en tiempo récord directamente en tu HTML utilizando clases utilitarias.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600&q=80'
    },
    {
      id: 'cybersecurity',
      title: 'CYBERSECURITY',
      subtitle: 'PENTESTING Y DEFENSA DE REDES',
      fullDescription: 'Conviértete en un experto en ciberseguridad. Aprende a detectar vulnerabilidades en sistemas y aplicaciones web, y descubre cómo proteger infraestructuras digitales.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
      hasGreenBadge: true
    },
    {
      id: 'react-native',
      title: 'REACT NATIVE',
      subtitle: 'DESARROLLO DE APPS MÓVILES',
      fullDescription: 'Usa tus conocimientos de React para construir aplicaciones móviles nativas para iOS y Android con una sola base de código.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80'
    },
    {
      id: 'rust',
      title: 'RUST PROGRAMMING',
      subtitle: 'SISTEMAS SEGUROS Y CONCURRENTES',
      fullDescription: 'Descubre el lenguaje que está revolucionando la programación de sistemas. Aprende sobre el ownership, borrow checker y concurrencia sin miedo.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80'
    }
  ];
}

