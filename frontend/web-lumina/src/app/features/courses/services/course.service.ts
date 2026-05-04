// features/courses/services/course.service.ts
import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Course, CourseDetail } from '../../../core/models/course.model';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const MOCK_COURSES: Course[] = [
  {
    id: 'angular-avanzado',
    title: 'Angular Avanzado: Patrones y RxJS',
    shortDescription: 'Domina Angular con patrones avanzados y programación reactiva con RxJS.',
    description: 'En este curso aprenderás a estructurar aplicaciones Angular escalables, implementar patrones de diseño modernos y dominar el uso de RxJS para el manejo de flujos asíncronos complejos. Incluye proyectos reales y best practices de la industria.',
    instructor: 'Ana García',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=600&q=80',
    price: 49.99,
    rating: 4.8,
    totalReviews: 1240,
    durationHours: 12,
    level: 'advanced',
    tags: ['Angular', 'RxJS', 'Frontend'],
    category: undefined,
    schoolId: 'school-1',
    isPremium: false,
  },
  {
    id: 'react-hooks',
    title: 'Introducción a React y Hooks',
    shortDescription: 'Crea tu primera aplicación con React desde cero.',
    description: 'Descubre el ecosistema de React, aprende a crear componentes reutilizables, manejar el estado con Hooks y gestionar efectos secundarios. Ideal para quienes inician en el mundo del desarrollo frontend moderno.',
    instructor: 'Carlos López',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
    price: 29.99,
    rating: 4.6,
    totalReviews: 890,
    durationHours: 8,
    level: 'beginner',
    tags: ['React', 'JavaScript', 'Frontend'],
    category: undefined,
    schoolId: 'school-1',
    isPremium: false,
  },
  {
    id: 'nodejs-microservicios',
    title: 'Node.js y Microservicios',
    shortDescription: 'Construye backends escalables con Node y arquitectura de microservicios.',
    description: 'Aprende a diseñar y construir APIs robustas con Node.js, Express y MongoDB. Descubre cómo dividir un monolito en microservicios, comunicarlos a través de eventos y desplegarlos usando Docker.',
    instructor: 'María Rodríguez',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&q=80',
    price: 59.99,
    rating: 4.9,
    totalReviews: 2100,
    durationHours: 20,
    level: 'advanced',
    tags: ['Node.js', 'Backend', 'Microservices'],
    category: undefined,
    schoolId: 'school-1',
    isPremium: true,
  },
  {
    id: 'python',
    title: 'Fundamentos de Python',
    shortDescription: 'El lenguaje de mayor crecimiento en el mundo.',
    description: 'Aprende a programar desde cero con Python. Veremos estructuras de datos, control de flujo, funciones, programación orientada a objetos y una introducción al análisis de datos.',
    instructor: 'David Torres',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&q=80',
    price: 19.99,
    rating: 4.5,
    totalReviews: 3200,
    durationHours: 10,
    level: 'beginner',
    tags: ['Python', 'Programming'],
    category: undefined,
    schoolId: 'school-3',
    isPremium: false,
  },
  {
    id: 'ux-ui',
    title: 'Diseño UX/UI para Desarrolladores',
    shortDescription: 'Mejora el aspecto visual y la experiencia de tus aplicaciones.',
    description: 'Curso práctico donde aprenderás los principios del diseño de interfaces y experiencia de usuario. Aprenderás a usar Figma y a implementar sistemas de diseño para que tus apps se vean profesionales.',
    instructor: 'Laura Méndez',
    thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
    price: 39.99,
    rating: 4.7,
    totalReviews: 450,
    durationHours: 6,
    level: 'intermediate',
    tags: ['UX', 'UI', 'Design'],
    category: undefined,
    schoolId: 'school-2',
    isPremium: false,
  },
  {
    id: 'devops',
    title: 'DevOps y CI/CD con GitHub Actions',
    shortDescription: 'Automatiza tus flujos de trabajo y despliegues.',
    description: 'Aprende las mejores prácticas de integración y entrega continua (CI/CD) utilizando GitHub Actions. Veremos cómo correr tests automáticos, hacer linting de código y desplegar a producción sin esfuerzo.',
    instructor: 'Javier Ruiz',
    thumbnailUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&q=80',
    price: 54.99,
    rating: 4.8,
    totalReviews: 670,
    durationHours: 15,
    level: 'intermediate',
    tags: ['DevOps', 'CI/CD', 'GitHub'],
    category: undefined,
    schoolId: 'school-4',
    isPremium: true,
  },
  {
    id: 'typescript',
    title: 'Mastering TypeScript',
    shortDescription: 'Eleva tu código JavaScript a otro nivel con tipos fuertes.',
    description: 'Domina los conceptos avanzados de TypeScript: genéricos, tipos condicionales, decoradores y utility types. Aprende a escribir código más seguro y mantenible.',
    instructor: 'Elena Silva',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&q=80',
    price: 44.99,
    rating: 4.9,
    totalReviews: 1100,
    durationHours: 9,
    level: 'intermediate',
    tags: ['TypeScript', 'JavaScript'],
    category: undefined,
    schoolId: 'school-5',
    isPremium: false,
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning Básico',
    shortDescription: 'Introducción a la inteligencia artificial y algoritmos de ML.',
    description: 'Un curso introductorio donde aprenderás a entrenar tus primeros modelos de regresión y clasificación usando Scikit-Learn y Python. Ideal para dar tus primeros pasos en IA.',
    instructor: 'Roberto Castro',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&q=80',
    price: 69.99,
    rating: 4.7,
    totalReviews: 890,
    durationHours: 25,
    level: 'advanced',
    tags: ['AI', 'Machine Learning', 'Python'],
    category: undefined,
    schoolId: 'school-3',
    isPremium: true,
  },
  // ── Cursos del grid (previamente sin detalle en el servicio) ──────────────
  {
    id: 'cursor',
    title: 'Cursor',
    shortDescription: 'Programación asistida con IA avanzada.',
    description: 'Domina el uso de Cursor, el editor de código potenciado por IA. Aprende a integrar agentes, autocompletado avanzado y refactorización inteligente para multiplicar tu productividad como desarrollador.',
    instructor: 'Carlos Dev',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80',
    price: 0,
    rating: 4.9,
    totalReviews: 540,
    durationHours: 10,
    level: 'intermediate',
    tags: ['IA', 'Productividad', 'Editor'],
    category: undefined,
    schoolId: 'school-5',
    isPremium: true,
  },
  {
    id: 'affinity-studio',
    title: 'Affinity Studio',
    shortDescription: 'Diseño gráfico profesional sin suscripciones.',
    description: 'Aprende a dominar Affinity Designer, Photo y Publisher. Crea ilustraciones vectoriales, edita fotografías y maqueta documentos profesionales sin suscripciones mensuales.',
    instructor: 'Laura Design',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80',
    price: 0,
    rating: 4.7,
    totalReviews: 310,
    durationHours: 12,
    level: 'intermediate',
    tags: ['Diseño', 'Affinity', 'Vectorial'],
    category: undefined,
    schoolId: 'school-2',
    isPremium: true,
  },
  {
    id: 'nextjs',
    title: 'Next.js',
    shortDescription: 'Desarrollo web React full-stack ultra rápido.',
    description: 'Aprende a construir aplicaciones web ultra rápidas y escalables con Next.js 14. Incluye Server Components, Server Actions, enrutamiento avanzado y optimización SEO.',
    instructor: 'Fernando Tech',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
    price: 0,
    rating: 4.8,
    totalReviews: 980,
    durationHours: 18,
    level: 'intermediate',
    tags: ['Next.js', 'React', 'SSR'],
    category: undefined,
    schoolId: 'school-1',
    isPremium: true,
  },
  {
    id: 'figma-avanzado',
    title: 'Figma Avanzado',
    shortDescription: 'Sistemas de diseño y prototipado de alta fidelidad.',
    description: 'Crea interfaces escalables usando Design Systems en Figma. Domina los auto layouts, variables, componentes interactivos y prototipado de alta fidelidad.',
    instructor: 'Andrea Figma',
    thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
    price: 0,
    rating: 4.8,
    totalReviews: 420,
    durationHours: 9,
    level: 'advanced',
    tags: ['Figma', 'UI', 'Design Systems'],
    category: undefined,
    schoolId: 'school-2',
    isPremium: true,
  },
  {
    id: 'docker-kubernetes',
    title: 'Docker & Kubernetes',
    shortDescription: 'Despliegue y orquestación de contenedores.',
    description: 'Aprende a contenerizar tus aplicaciones con Docker y orquestarlas a gran escala con Kubernetes. Ideal para perfiles DevOps y Backend.',
    instructor: 'Javier Ruiz',
    thumbnailUrl: 'https://images.unsplash.com/photo-1667372393913-5d5f89e62394?w=600&q=80',
    price: 0,
    rating: 4.9,
    totalReviews: 760,
    durationHours: 20,
    level: 'advanced',
    tags: ['Docker', 'Kubernetes', 'DevOps'],
    category: undefined,
    schoolId: 'school-4',
    isPremium: true,
  },
  {
    id: 'angular-18',
    title: 'Angular 18',
    shortDescription: 'Desarrollo de SPAs modernas con Signals y Standalone.',
    description: 'Domina el nuevo Angular con Signals, Standalone Components, y el nuevo control flow. Construye aplicaciones reactivas empresariales desde cero.',
    instructor: 'Maria Coder',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=600&q=80',
    price: 0,
    rating: 4.8,
    totalReviews: 630,
    durationHours: 16,
    level: 'intermediate',
    tags: ['Angular', 'Signals', 'Frontend'],
    category: undefined,
    schoolId: 'school-1',
    isPremium: true,
  },
  {
    id: 'node-nestjs',
    title: 'Node.js con NestJS',
    shortDescription: 'Backend escalable con TypeScript y NestJS.',
    description: 'Desarrolla APIs robustas usando NestJS, TypeORM, y bases de datos relacionales. Implementa autenticación, microservicios y WebSockets de forma profesional.',
    instructor: 'Roberto Backend',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&q=80',
    price: 0,
    rating: 4.7,
    totalReviews: 510,
    durationHours: 22,
    level: 'advanced',
    tags: ['NestJS', 'Node.js', 'TypeScript'],
    category: undefined,
    schoolId: 'school-1',
    isPremium: true,
  },
  // ── 4 cursos nuevos ────────────────────────────────────────────────────────
  {
    id: 'tailwindcss',
    title: 'TailwindCSS',
    shortDescription: 'Diseño web rápido y moderno con clases utilitarias.',
    description: 'Olvídate del CSS tradicional. Aprende a crear interfaces complejas y responsivas en tiempo récord directamente en tu HTML utilizando clases utilitarias de TailwindCSS.',
    instructor: 'Carlos Dev',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600&q=80',
    price: 0,
    rating: 4.8,
    totalReviews: 320,
    durationHours: 8,
    level: 'beginner',
    tags: ['TailwindCSS', 'CSS', 'Frontend'],
    category: undefined,
    schoolId: 'school-2',
    isPremium: true,
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    shortDescription: 'Pentesting y defensa de redes y aplicaciones.',
    description: 'Conviértete en un experto en ciberseguridad. Aprende a detectar vulnerabilidades en sistemas y aplicaciones web, y descubre cómo proteger infraestructuras digitales.',
    instructor: 'Hector Sec',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
    price: 0,
    rating: 4.9,
    totalReviews: 450,
    durationHours: 30,
    level: 'advanced',
    tags: ['Seguridad', 'Pentesting', 'Redes'],
    category: undefined,
    schoolId: 'school-4',
    isPremium: true,
  },
  {
    id: 'react-native',
    title: 'React Native',
    shortDescription: 'Desarrollo de apps móviles con React para iOS y Android.',
    description: 'Usa tus conocimientos de React para construir aplicaciones móviles nativas para iOS y Android con una sola base de código. Aprende navegación, APIs nativas y publicación en tiendas.',
    instructor: 'Carlos López',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
    price: 0,
    rating: 4.7,
    totalReviews: 560,
    durationHours: 20,
    level: 'intermediate',
    tags: ['React Native', 'Mobile', 'iOS', 'Android'],
    category: undefined,
    schoolId: 'school-1',
    isPremium: true,
  },
  {
    id: 'rust',
    title: 'Rust Programming',
    shortDescription: 'Sistemas seguros y concurrentes con Rust.',
    description: 'Descubre el lenguaje que está revolucionando la programación de sistemas. Aprende sobre el ownership, borrow checker y concurrencia sin miedo. Ideal para desarrolladores que quieren máximo rendimiento.',
    instructor: 'Elena Silva',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    price: 0,
    rating: 4.8,
    totalReviews: 280,
    durationHours: 24,
    level: 'advanced',
    tags: ['Rust', 'Sistemas', 'Concurrencia'],
    category: undefined,
    schoolId: 'school-5',
    isPremium: true,
  },
];

// ─── Mock enriquecido con syllabus para la página de detalle ──────────────────
const MOCK_COURSE_DETAILS: CourseDetail[] = [
  {
    ...MOCK_COURSES[0], // Angular Avanzado: Patrones y RxJS
    enrolledCount: 4850,
    prerequisites: ['Conocimiento básico de Angular', 'Familiaridad con TypeScript', 'Experiencia con HTML y CSS'],
    syllabus: [
      {
        sectionTitle: 'Introducción a RxJS y Observables',
        lessons: [
          { title: 'Bienvenida al curso', durationMinutes: 5 },
          { title: '¿Qué es la programación reactiva?', durationMinutes: 12 },
          { title: 'Observables vs Promises', durationMinutes: 18 },
          { title: 'Operadores esenciales: map, filter, switchMap', durationMinutes: 25 },
        ],
      },
      {
        sectionTitle: 'Patrones Avanzados en Angular',
        lessons: [
          { title: 'Smart & Dumb Components', durationMinutes: 20 },
          { title: 'Facade Pattern con servicios', durationMinutes: 22 },
          { title: 'State Management con Signals', durationMinutes: 30 },
          { title: 'Change Detection OnPush profundo', durationMinutes: 28 },
        ],
      },
      {
        sectionTitle: 'Arquitectura Escalable',
        lessons: [
          { title: 'Módulos vs Standalone Components', durationMinutes: 15 },
          { title: 'Lazy loading avanzado', durationMinutes: 18 },
          { title: 'Micro-frontends con Angular', durationMinutes: 35 },
          { title: 'Proyecto final: App de gestión empresarial', durationMinutes: 60 },
        ],
      },
    ],
  },
  {
    ...MOCK_COURSES[1], // React y Hooks
    enrolledCount: 12300,
    prerequisites: ['Conocimiento básico de JavaScript', 'HTML y CSS básico'],
    syllabus: [
      {
        sectionTitle: 'Todo depende de ti',
        lessons: [
          { title: 'Introducción al curso', durationMinutes: 10 },
          { title: 'Instalación y configuración de entorno', durationMinutes: 15 },
          { title: 'Tu primer componente React', durationMinutes: 20 },
        ],
      },
      {
        sectionTitle: 'Hooks Fundamentales',
        lessons: [
          { title: 'useState — manejo de estado local', durationMinutes: 22 },
          { title: 'useEffect — efectos secundarios', durationMinutes: 25 },
          { title: 'useContext — estado global', durationMinutes: 18 },
          { title: 'useRef y useMemo', durationMinutes: 20 },
        ],
      },
      {
        sectionTitle: 'Proyecto Final: App de Tareas',
        lessons: [
          { title: 'Planificación de la app', durationMinutes: 10 },
          { title: 'Estructura de componentes', durationMinutes: 15 },
          { title: 'Implementación CRUD', durationMinutes: 37 },
          { title: 'Despliegue en Vercel', durationMinutes: 12 },
        ],
      },
    ],
  },
  {
    ...MOCK_COURSES[2], // Node.js y Microservicios
    enrolledCount: 7200,
    prerequisites: ['JavaScript ES6+', 'Conceptos básicos de HTTP/REST', 'Familiaridad con terminal/CLI'],
    syllabus: [
      {
        sectionTitle: 'Fundamentos de Node.js',
        lessons: [
          { title: 'Introducción a Node.js y el event loop', durationMinutes: 18 },
          { title: 'Módulos y CommonJS vs ESModules', durationMinutes: 14 },
          { title: 'Streams y buffers', durationMinutes: 22 },
        ],
      },
      {
        sectionTitle: 'APIs con Express',
        lessons: [
          { title: 'Configuración de Express', durationMinutes: 12 },
          { title: 'Middleware y routing', durationMinutes: 20 },
          { title: 'Autenticación con JWT', durationMinutes: 28 },
          { title: 'Conexión con MongoDB', durationMinutes: 25 },
        ],
      },
      {
        sectionTitle: 'Microservicios y Docker',
        lessons: [
          { title: '¿Qué son los microservicios?', durationMinutes: 15 },
          { title: 'Comunicación con eventos (RabbitMQ)', durationMinutes: 30 },
          { title: 'Contenerización con Docker', durationMinutes: 35 },
          { title: 'Orquestación básica con Docker Compose', durationMinutes: 40 },
        ],
      },
    ],
  },
  {
    ...MOCK_COURSES[3], // Python
    enrolledCount: 18500,
    prerequisites: ['Ninguno — curso para principiantes absolutos'],
    syllabus: [
      {
        sectionTitle: 'Primeros pasos con Python',
        lessons: [
          { title: 'Instalación de Python y VS Code', durationMinutes: 8 },
          { title: 'Variables y tipos de datos', durationMinutes: 15 },
          { title: 'Operadores y expresiones', durationMinutes: 12 },
        ],
      },
      {
        sectionTitle: 'Control de flujo',
        lessons: [
          { title: 'Condicionales if/elif/else', durationMinutes: 14 },
          { title: 'Bucles for y while', durationMinutes: 18 },
          { title: 'Listas, tuplas y diccionarios', durationMinutes: 22 },
        ],
      },
      {
        sectionTitle: 'Programación Orientada a Objetos',
        lessons: [
          { title: 'Clases y objetos', durationMinutes: 20 },
          { title: 'Herencia y polimorfismo', durationMinutes: 25 },
          { title: 'Módulos y paquetes', durationMinutes: 15 },
          { title: 'Proyecto: Análisis de datos básico', durationMinutes: 45 },
        ],
      },
    ],
  },
  {
    ...MOCK_COURSES[4], // UX/UI
    enrolledCount: 3100,
    prerequisites: ['Ninguno — curso accesible para todos'],
    syllabus: [
      {
        sectionTitle: 'Principios de Diseño',
        lessons: [
          { title: 'Jerarquía visual y composición', durationMinutes: 18 },
          { title: 'Teoría del color aplicada a UI', durationMinutes: 20 },
          { title: 'Tipografía para interfaces digitales', durationMinutes: 15 },
        ],
      },
      {
        sectionTitle: 'Figma Desde Cero',
        lessons: [
          { title: 'Interfaz de Figma y herramientas básicas', durationMinutes: 15 },
          { title: 'Componentes y Auto Layout', durationMinutes: 25 },
          { title: 'Sistemas de diseño y Design Tokens', durationMinutes: 30 },
          { title: 'Prototipado interactivo', durationMinutes: 22 },
        ],
      },
    ],
  },
  {
    ...MOCK_COURSES[5], // DevOps
    enrolledCount: 4400,
    prerequisites: ['Git básico', 'Conocimiento de la terminal Linux/Mac'],
    syllabus: [
      {
        sectionTitle: 'Introducción a DevOps',
        lessons: [
          { title: '¿Qué es DevOps y por qué importa?', durationMinutes: 12 },
          { title: 'Cultura DevOps y Agile', durationMinutes: 10 },
        ],
      },
      {
        sectionTitle: 'CI/CD con GitHub Actions',
        lessons: [
          { title: 'Tu primer workflow de GitHub Actions', durationMinutes: 20 },
          { title: 'Tests automáticos en el pipeline', durationMinutes: 25 },
          { title: 'Linting y formateo de código', durationMinutes: 15 },
          { title: 'Despliegue automático a producción', durationMinutes: 30 },
          { title: 'Secrets y variables de entorno en Actions', durationMinutes: 18 },
        ],
      },
      {
        sectionTitle: 'Monitoreo y Alertas',
        lessons: [
          { title: 'Integración con Slack y Discord', durationMinutes: 14 },
          { title: 'Badges y reportes de cobertura', durationMinutes: 12 },
          { title: 'Proyecto: Pipeline completo de producción', durationMinutes: 50 },
        ],
      },
    ],
  },
  {
    ...MOCK_COURSES[6], // TypeScript
    enrolledCount: 6800,
    prerequisites: ['JavaScript ES6+ sólido', 'Experiencia con al menos un framework JS'],
    syllabus: [
      {
        sectionTitle: 'TypeScript Avanzado',
        lessons: [
          { title: 'Tipos literales y uniones', durationMinutes: 15 },
          { title: 'Genéricos profundos', durationMinutes: 28 },
          { title: 'Tipos condicionales e inferencia', durationMinutes: 25 },
          { title: 'Utility Types: Partial, Required, Pick, Omit', durationMinutes: 20 },
        ],
      },
      {
        sectionTitle: 'Decoradores y Metaprogramación',
        lessons: [
          { title: 'Decoradores de clase y método', durationMinutes: 22 },
          { title: 'Reflect Metadata', durationMinutes: 18 },
          { title: 'Construyendo un mini framework IoC', durationMinutes: 40 },
        ],
      },
    ],
  },
  {
    ...MOCK_COURSES[7], // Machine Learning
    enrolledCount: 5600,
    prerequisites: ['Python básico', 'Matemáticas: álgebra lineal y estadística básica'],
    syllabus: [
      {
        sectionTitle: 'Fundamentos de ML',
        lessons: [
          { title: 'Introducción al Machine Learning', durationMinutes: 20 },
          { title: 'Tipos de aprendizaje: supervisado, no supervisado', durationMinutes: 18 },
          { title: 'El pipeline de un proyecto ML', durationMinutes: 15 },
        ],
      },
      {
        sectionTitle: 'Modelos de Regresión y Clasificación',
        lessons: [
          { title: 'Regresión lineal desde cero', durationMinutes: 30 },
          { title: 'Regresión logística', durationMinutes: 28 },
          { title: 'Árboles de decisión y Random Forest', durationMinutes: 35 },
          { title: 'SVM y KNN', durationMinutes: 25 },
        ],
      },
      {
        sectionTitle: 'Redes Neuronales con TensorFlow',
        lessons: [
          { title: 'Introducción a redes neuronales', durationMinutes: 25 },
          { title: 'Construyendo tu primera red con Keras', durationMinutes: 40 },
          { title: 'Optimización y regularización', durationMinutes: 30 },
          { title: 'Proyecto final: Clasificador de imágenes', durationMinutes: 60 },
        ],
      },
    ],
  },
  // ── Cursos del grid ────────────────────────────────────────────────────────
  {
    ...MOCK_COURSES.find(c => c.id === 'cursor')!,
    enrolledCount: 3200,
    prerequisites: ['Conocimiento básico de programación', 'Familiaridad con VS Code o similar'],
    syllabus: [
      {
        sectionTitle: 'Introducción a Cursor',
        lessons: [
          { title: 'Instalación y configuración inicial', durationMinutes: 10 },
          { title: 'Interfaz y atajos esenciales', durationMinutes: 15 },
          { title: 'Chat con el código: conceptos clave', durationMinutes: 20 },
        ],
      },
      {
        sectionTitle: 'Agentes y Autocompletado Avanzado',
        lessons: [
          { title: 'Cómo funcionan los agentes de IA', durationMinutes: 18 },
          { title: 'Autocompletado multi-línea y contexto', durationMinutes: 22 },
          { title: 'Refactorización inteligente con IA', durationMinutes: 25 },
          { title: 'Generación de tests automáticos', durationMinutes: 20 },
        ],
      },
      {
        sectionTitle: 'Flujos de trabajo reales',
        lessons: [
          { title: 'Proyecto: App completa asistida por IA', durationMinutes: 60 },
          { title: 'Integración con Git y revisión de PRs', durationMinutes: 18 },
          { title: 'Tips y trucos de productividad', durationMinutes: 12 },
        ],
      },
    ],
  },
  {
    ...MOCK_COURSES.find(c => c.id === 'affinity-studio')!,
    enrolledCount: 1800,
    prerequisites: ['Ninguno — apto para principiantes en diseño'],
    syllabus: [
      {
        sectionTitle: 'Affinity Designer: Vectores',
        lessons: [
          { title: 'Introducción a la interfaz', durationMinutes: 12 },
          { title: 'Herramientas de trazado y nodos', durationMinutes: 20 },
          { title: 'Rellenos, degradados y efectos', durationMinutes: 18 },
        ],
      },
      {
        sectionTitle: 'Affinity Photo: Edición',
        lessons: [
          { title: 'Capas y máscaras de edición', durationMinutes: 22 },
          { title: 'Ajustes no destructivos', durationMinutes: 18 },
          { title: 'Retoque de retratos profesional', durationMinutes: 28 },
        ],
      },
      {
        sectionTitle: 'Affinity Publisher: Maquetación',
        lessons: [
          { title: 'Configuración de documentos y páginas', durationMinutes: 15 },
          { title: 'Estilos de texto y párrafo', durationMinutes: 18 },
          { title: 'Proyecto: Dossier profesional', durationMinutes: 40 },
        ],
      },
    ],
  },
  {
    ...MOCK_COURSES.find(c => c.id === 'nextjs')!,
    enrolledCount: 5600,
    prerequisites: ['React básico con Hooks', 'JavaScript ES6+', 'HTML y CSS sólido'],
    syllabus: [
      {
        sectionTitle: 'Fundamentos de Next.js 14',
        lessons: [
          { title: 'App Router vs Pages Router', durationMinutes: 15 },
          { title: 'Server y Client Components', durationMinutes: 22 },
          { title: 'Layouts, pages y templates', durationMinutes: 18 },
        ],
      },
      {
        sectionTitle: 'Data Fetching y Server Actions',
        lessons: [
          { title: 'fetch() en el servidor', durationMinutes: 20 },
          { title: 'Server Actions y formularios', durationMinutes: 25 },
          { title: 'Caché y revalidación', durationMinutes: 22 },
          { title: 'Suspense y streaming', durationMinutes: 20 },
        ],
      },
      {
        sectionTitle: 'Despliegue y Optimización',
        lessons: [
          { title: 'next/image y next/font', durationMinutes: 15 },
          { title: 'SEO con Metadata API', durationMinutes: 12 },
          { title: 'Despliegue en Vercel', durationMinutes: 18 },
          { title: 'Proyecto: E-commerce completo', durationMinutes: 70 },
        ],
      },
    ],
  },
  {
    ...MOCK_COURSES.find(c => c.id === 'figma-avanzado')!,
    enrolledCount: 2900,
    prerequisites: ['Figma básico o intermedio', 'Experiencia creando interfaces'],
    syllabus: [
      {
        sectionTitle: 'Variables y Tokens',
        lessons: [
          { title: 'Variables de color y tipografía', durationMinutes: 18 },
          { title: 'Modos claro y oscuro', durationMinutes: 22 },
          { title: 'Design Tokens para devs', durationMinutes: 20 },
        ],
      },
      {
        sectionTitle: 'Componentes Avanzados',
        lessons: [
          { title: 'Variantes y propiedades de componentes', durationMinutes: 25 },
          { title: 'Componentes interactivos', durationMinutes: 28 },
          { title: 'Auto Layout anidado', durationMinutes: 22 },
        ],
      },
      {
        sectionTitle: 'Flujo con Desarrolladores',
        lessons: [
          { title: 'Inspección y handoff profesional', durationMinutes: 15 },
          { title: 'Prototipos de alta fidelidad', durationMinutes: 25 },
          { title: 'Proyecto: Design System completo', durationMinutes: 55 },
        ],
      },
    ],
  },
  {
    ...MOCK_COURSES.find(c => c.id === 'docker-kubernetes')!,
    enrolledCount: 4100,
    prerequisites: ['Linux básico', 'Conocimiento de al menos un lenguaje backend', 'Redes básicas'],
    syllabus: [
      {
        sectionTitle: 'Docker desde Cero',
        lessons: [
          { title: '¿Qué es Docker y cómo funciona?', durationMinutes: 15 },
          { title: 'Imágenes, contenedores y registros', durationMinutes: 20 },
          { title: 'Dockerfile: construyendo imágenes', durationMinutes: 25 },
          { title: 'Docker Compose para desarrollo', durationMinutes: 28 },
        ],
      },
      {
        sectionTitle: 'Kubernetes Fundamentals',
        lessons: [
          { title: 'Arquitectura de Kubernetes', durationMinutes: 18 },
          { title: 'Pods, Deployments y Services', durationMinutes: 25 },
          { title: 'ConfigMaps y Secrets', durationMinutes: 20 },
          { title: 'Ingress y balanceo de carga', durationMinutes: 22 },
        ],
      },
      {
        sectionTitle: 'Producción y CI/CD',
        lessons: [
          { title: 'Helm Charts', durationMinutes: 25 },
          { title: 'Pipeline CI/CD con Kubernetes', durationMinutes: 30 },
          { title: 'Proyecto: Despliegue multi-servicio', durationMinutes: 60 },
        ],
      },
    ],
  },
  {
    ...MOCK_COURSES.find(c => c.id === 'angular-18')!,
    enrolledCount: 3700,
    prerequisites: ['JavaScript/TypeScript básico', 'HTML y CSS sólido'],
    syllabus: [
      {
        sectionTitle: 'Signals y Reactividad',
        lessons: [
          { title: 'Signals vs RxJS: cuándo usar cada uno', durationMinutes: 20 },
          { title: 'computed() y effect()', durationMinutes: 18 },
          { title: 'Interoperabilidad Signal/Observable', durationMinutes: 22 },
        ],
      },
      {
        sectionTitle: 'Standalone Components',
        lessons: [
          { title: 'Componentes, Directivas y Pipes standalone', durationMinutes: 18 },
          { title: 'Lazy loading sin módulos', durationMinutes: 20 },
          { title: 'Nuevo control flow @if, @for, @switch', durationMinutes: 15 },
        ],
      },
      {
        sectionTitle: 'Proyecto Empresarial',
        lessons: [
          { title: 'Arquitectura con feature-based folders', durationMinutes: 22 },
          { title: 'Autenticación con guards y interceptors', durationMinutes: 28 },
          { title: 'Proyecto final: Dashboard completo', durationMinutes: 70 },
        ],
      },
    ],
  },
  {
    ...MOCK_COURSES.find(c => c.id === 'node-nestjs')!,
    enrolledCount: 2800,
    prerequisites: ['TypeScript básico', 'Node.js y npm', 'Conceptos de REST APIs'],
    syllabus: [
      {
        sectionTitle: 'Fundamentos de NestJS',
        lessons: [
          { title: 'Arquitectura modular de NestJS', durationMinutes: 18 },
          { title: 'Controllers, Services y Providers', durationMinutes: 22 },
          { title: 'Decoradores y Metadata', durationMinutes: 15 },
        ],
      },
      {
        sectionTitle: 'Base de Datos con TypeORM',
        lessons: [
          { title: 'Entidades y relaciones', durationMinutes: 25 },
          { title: 'Repositorios y QueryBuilder', durationMinutes: 22 },
          { title: 'Migraciones de base de datos', durationMinutes: 18 },
        ],
      },
      {
        sectionTitle: 'Autenticación y Microservicios',
        lessons: [
          { title: 'Guards y autenticación JWT', durationMinutes: 28 },
          { title: 'WebSockets en tiempo real', durationMinutes: 25 },
          { title: 'Microservicios con TCP/Redis', durationMinutes: 30 },
          { title: 'Proyecto: API completa de producción', durationMinutes: 65 },
        ],
      },
    ],
  },
  // ── 4 cursos nuevos ────────────────────────────────────────────────────────
  {
    ...MOCK_COURSES.find(c => c.id === 'tailwindcss')!,
    enrolledCount: 4200,
    prerequisites: ['HTML básico', 'Conocimiento general de CSS'],
    syllabus: [
      {
        sectionTitle: 'Fundamentos de TailwindCSS',
        lessons: [
          { title: 'Instalación y configuración con Vite/Next', durationMinutes: 12 },
          { title: 'Clases de spacing, colores y tipografía', durationMinutes: 20 },
          { title: 'Flexbox y Grid con Tailwind', durationMinutes: 22 },
          { title: 'Responsive design con breakpoints', durationMinutes: 18 },
        ],
      },
      {
        sectionTitle: 'Componentes y Variantes',
        lessons: [
          { title: 'Estados: hover, focus, active', durationMinutes: 15 },
          { title: 'Dark mode y temas personalizados', durationMinutes: 20 },
          { title: 'tailwind.config.js: extendiendo el diseño', durationMinutes: 18 },
        ],
      },
      {
        sectionTitle: 'Proyecto: UI completa',
        lessons: [
          { title: 'Landing page responsiva desde cero', durationMinutes: 45 },
          { title: 'Dashboard administrativo', durationMinutes: 50 },
          { title: 'Optimización y purge del CSS', durationMinutes: 12 },
        ],
      },
    ],
  },
  {
    ...MOCK_COURSES.find(c => c.id === 'cybersecurity')!,
    enrolledCount: 2600,
    prerequisites: ['Redes básicas (TCP/IP)', 'Linux básico', 'Programación básica (Python recomendado)'],
    syllabus: [
      {
        sectionTitle: 'Fundamentos de Ciberseguridad',
        lessons: [
          { title: 'El panorama actual de amenazas', durationMinutes: 15 },
          { title: 'OWASP Top 10: vulnerabilidades críticas', durationMinutes: 25 },
          { title: 'Fases de un ataque (Kill Chain)', durationMinutes: 20 },
        ],
      },
      {
        sectionTitle: 'Pentesting Web',
        lessons: [
          { title: 'SQL Injection y XSS', durationMinutes: 30 },
          { title: 'CSRF, SSRF y XXE', durationMinutes: 28 },
          { title: 'Herramientas: Burp Suite y OWASP ZAP', durationMinutes: 35 },
          { title: 'Explotación con Metasploit', durationMinutes: 40 },
        ],
      },
      {
        sectionTitle: 'Defensa y Hardening',
        lessons: [
          { title: 'Hardening de servidores Linux', durationMinutes: 25 },
          { title: 'Firewalls y detección de intrusos', durationMinutes: 22 },
          { title: 'Cifrado y gestión de certificados', durationMinutes: 20 },
          { title: 'Proyecto: Informe de auditoría real', durationMinutes: 60 },
        ],
      },
    ],
  },
  {
    ...MOCK_COURSES.find(c => c.id === 'react-native')!,
    enrolledCount: 3400,
    prerequisites: ['React con Hooks (nivel intermedio)', 'JavaScript ES6+'],
    syllabus: [
      {
        sectionTitle: 'Configuración del Entorno',
        lessons: [
          { title: 'Expo vs React Native CLI', durationMinutes: 12 },
          { title: 'Simuladores iOS y Android', durationMinutes: 15 },
          { title: 'Estructura del proyecto', durationMinutes: 10 },
        ],
      },
      {
        sectionTitle: 'Componentes y Navegación',
        lessons: [
          { title: 'Core components: View, Text, Image', durationMinutes: 20 },
          { title: 'StyleSheet y diseño con Flexbox', durationMinutes: 22 },
          { title: 'React Navigation: Stack y Tab', durationMinutes: 28 },
          { title: 'Drawer navigation y modals', durationMinutes: 20 },
        ],
      },
      {
        sectionTitle: 'APIs Nativas y Publicación',
        lessons: [
          { title: 'Cámara, geolocalización y notificaciones', durationMinutes: 30 },
          { title: 'Almacenamiento local con AsyncStorage', durationMinutes: 18 },
          { title: 'Animaciones con Animated API', durationMinutes: 25 },
          { title: 'Publicación en App Store y Google Play', durationMinutes: 35 },
        ],
      },
    ],
  },
  {
    ...MOCK_COURSES.find(c => c.id === 'rust')!,
    enrolledCount: 1600,
    prerequisites: ['Experiencia en al menos un lenguaje de programación', 'Conceptos básicos de memoria'],
    syllabus: [
      {
        sectionTitle: 'Fundamentos de Rust',
        lessons: [
          { title: 'Instalación con rustup y cargo', durationMinutes: 10 },
          { title: 'Variables, tipos y mutabilidad', durationMinutes: 18 },
          { title: 'Funciones, structs y enums', durationMinutes: 22 },
          { title: 'Pattern matching y Option/Result', durationMinutes: 25 },
        ],
      },
      {
        sectionTitle: 'Ownership y Borrowing',
        lessons: [
          { title: 'El sistema de ownership explicado', durationMinutes: 28 },
          { title: 'Referencias y el borrow checker', durationMinutes: 30 },
          { title: 'Lifetimes: concepto y práctica', durationMinutes: 25 },
          { title: 'Smart pointers: Box, Rc, Arc', durationMinutes: 22 },
        ],
      },
      {
        sectionTitle: 'Concurrencia y Proyecto Final',
        lessons: [
          { title: 'Threads y canales (mpsc)', durationMinutes: 28 },
          { title: 'async/await con Tokio', durationMinutes: 35 },
          { title: 'Proyecto: CLI de gestión de archivos', durationMinutes: 55 },
          { title: 'Proyecto: API REST con Axum', durationMinutes: 70 },
        ],
      },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly api = inject(ApiService);

  getAll(filters?: { level?: string; search?: string }): Observable<Course[]> {
    return this.api.get<Course[]>('courses', filters as Record<string, string>).pipe(
      map(data => {
        if (!data || data.length === 0) {
          let result = MOCK_COURSES;
          if (filters?.level) {
            result = result.filter(c => c.level === filters.level);
          }
          return result;
        }
        return data;
      }),
      catchError(() => {
        let result = MOCK_COURSES;
        if (filters?.level) {
          result = result.filter(c => c.level === filters.level);
        }
        return of(result);
      })
    );
  }

  getById(id: string): Observable<CourseDetail> {
    // Primero buscar en el mock local (incluye syllabus completo)
    const mockDetail = MOCK_COURSE_DETAILS.find(c => c.id === id);
    if (mockDetail) {
      return of(mockDetail);
    }

    // Fallback: si existe en MOCK_COURSES pero sin syllabus detallado
    const mockBase = MOCK_COURSES.find(c => c.id === id);
    if (mockBase) {
      const fallback: CourseDetail = {
        ...mockBase,
        enrolledCount: 0,
        prerequisites: [],
        syllabus: [],
      };
      return of(fallback);
    }

    // Si no está en mock, llamar a la API con fallback
    return this.api.get<CourseDetail>(`courses/${id}`).pipe(
      catchError(() => throwError(() => new Error(`Curso con id "${id}" no encontrado`)))
    );
  }

  create(data: any): Observable<{ message: string; course: Course }> {
    return this.api.post<{ message: string; course: Course }>('courses', data);
  }

  update(id: string, data: any): Observable<{ message: string; course: Course }> {
    return this.api.put<{ message: string; course: Course }>(`courses/${id}`, data);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`courses/${id}`);
  }
}