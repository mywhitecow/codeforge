// features/learning/services/exam.service.ts
import { Injectable } from '@angular/core';

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

const MOCK_EXAMS: Record<string, ExamQuestion[]> = {
  'angular-avanzado': [
    {
      id: 'q1', question: '¿Qué función de Angular Signals permite derivar un valor de otros signals?',
      options: ['effect()', 'computed()', 'signal()', 'inject()'],
      correctIndex: 1,
    },
    {
      id: 'q2', question: '¿Cuál es el operador RxJS usado para cancelar observables previos al recibir uno nuevo?',
      options: ['mergeMap()', 'concatMap()', 'switchMap()', 'exhaustMap()'],
      correctIndex: 2,
    },
    {
      id: 'q3', question: '¿Qué estrategia de Change Detection evita chequeos innecesarios en Angular?',
      options: ['Default', 'OnPush', 'Detach', 'Reattach'],
      correctIndex: 1,
    },
    {
      id: 'q4', question: '¿Qué patrón separa la lógica de estado de los componentes presentacionales?',
      options: ['Singleton', 'Facade', 'Observer', 'Repository'],
      correctIndex: 1,
    },
    {
      id: 'q5', question: '¿Cuál es la forma correcta de cargar un módulo de manera diferida (lazy)?',
      options: [
        'import() en el componente',
        'loadComponent() en rutas',
        'LazyModule en @NgModule',
        'defer() en el template',
      ],
      correctIndex: 1,
    },
  ],
  'react-hooks': [
    {
      id: 'q1', question: '¿Qué hook de React maneja el estado local de un componente funcional?',
      options: ['useRef', 'useEffect', 'useState', 'useMemo'],
      correctIndex: 2,
    },
    {
      id: 'q2', question: '¿Cuándo se ejecuta useEffect sin array de dependencias?',
      options: ['Solo al montar', 'Nunca', 'En cada render', 'Solo al desmontar'],
      correctIndex: 2,
    },
    {
      id: 'q3', question: '¿Qué hook previene re-renders innecesarios de funciones costosas?',
      options: ['useCallback', 'useRef', 'useState', 'useLayoutEffect'],
      correctIndex: 0,
    },
    {
      id: 'q4', question: '¿Qué hook comparte estado global sin Redux?',
      options: ['useReducer', 'useContext', 'useRef', 'useMemo'],
      correctIndex: 1,
    },
    {
      id: 'q5', question: '¿Cuál es la regla principal de los Hooks en React?',
      options: [
        'Solo en componentes de clase',
        'Solo llamarlos al nivel superior',
        'Pueden estar en bucles',
        'No se pueden encadenar',
      ],
      correctIndex: 1,
    },
  ],
  'python': [
    {
      id: 'q1', question: '¿Cuál es la sintaxis correcta para definir una función en Python?',
      options: ['function miFuncion():', 'def miFuncion():', 'void miFuncion():', 'func miFuncion():'],
      correctIndex: 1,
    },
    {
      id: 'q2', question: '¿Qué estructura de datos en Python es mutable y ordenada?',
      options: ['Tupla', 'Set', 'Lista', 'Frozenset'],
      correctIndex: 2,
    },
    {
      id: 'q3', question: '¿Cómo se hereda de una clase en Python?',
      options: ['class Hijo extends Padre:', 'class Hijo(Padre):', 'class Hijo inherits Padre:', 'class Hijo implements Padre:'],
      correctIndex: 1,
    },
    {
      id: 'q4', question: '¿Qué método se llama automáticamente al crear un objeto?',
      options: ['__create__', '__new__', '__init__', '__start__'],
      correctIndex: 2,
    },
    {
      id: 'q5', question: '¿Qué operador se usa para potencias en Python?',
      options: ['^', '**', 'pow()', 'Math.pow()'],
      correctIndex: 1,
    },
  ],
  'typescript': [
    {
      id: 'q1', question: '¿Qué es un tipo genérico en TypeScript?',
      options: [
        'Un tipo que solo acepta string',
        'Un tipo parametrizable que funciona con cualquier tipo',
        'Un tipo de la librería estándar',
        'Un tipo que siempre es any',
      ],
      correctIndex: 1,
    },
    {
      id: 'q2', question: '¿Cuál es el Utility Type que hace todas las propiedades opcionales?',
      options: ['Required<T>', 'Readonly<T>', 'Partial<T>', 'Pick<T,K>'],
      correctIndex: 2,
    },
    {
      id: 'q3', question: '¿Qué palabra clave permite inferir el tipo de retorno en una función genérica?',
      options: ['typeof', 'infer', 'keyof', 'extends'],
      correctIndex: 1,
    },
    {
      id: 'q4', question: '¿Cuál de estos es un tipo condicional válido?',
      options: [
        'T if string else number',
        'T extends string ? A : B',
        'T is string ? A : B',
        'typeof T === string ? A : B',
      ],
      correctIndex: 1,
    },
    {
      id: 'q5', question: '¿Qué hace keyof en TypeScript?',
      options: [
        'Extrae los valores de un objeto',
        'Obtiene las claves de un tipo como unión',
        'Define una clave primaria',
        'Convierte un tipo a string',
      ],
      correctIndex: 1,
    },
  ],
  'nodejs-microservicios': [
    {
      id: 'q1', question: '¿Qué es el event loop en Node.js?',
      options: [
        'Un bucle que ejecuta código síncrono',
        'Un mecanismo para manejar operaciones asíncronas sin bloquear el hilo principal',
        'Una librería para eventos de usuario',
        'Un método de Express para rutas',
      ],
      correctIndex: 1,
    },
    {
      id: 'q2', question: '¿Qué middleware de Express parsea el body de las peticiones JSON?',
      options: ['express.text()', 'express.urlencoded()', 'express.json()', 'express.raw()'],
      correctIndex: 2,
    },
    {
      id: 'q3', question: '¿Cuál es la principal ventaja de los microservicios sobre el monolito?',
      options: [
        'Son más simples de desarrollar',
        'Escalan y despliegan de forma independiente',
        'No necesitan base de datos',
        'Son más seguros por defecto',
      ],
      correctIndex: 1,
    },
    {
      id: 'q4', question: '¿Qué comando de Docker levanta múltiples servicios definidos en un archivo YAML?',
      options: ['docker run', 'docker build', 'docker-compose up', 'docker start'],
      correctIndex: 2,
    },
    {
      id: 'q5', question: '¿Para qué se usa RabbitMQ en una arquitectura de microservicios?',
      options: [
        'Almacenamiento de datos',
        'Comunicación asíncrona entre servicios mediante colas de mensajes',
        'Autenticación de usuarios',
        'Servir archivos estáticos',
      ],
      correctIndex: 1,
    },
  ],
};

// Preguntas genéricas para cualquier curso sin mock específico
const DEFAULT_QUESTIONS: ExamQuestion[] = [
  {
    id: 'q1', question: '¿Cuál es la mejor práctica para nombrar variables en programación?',
    options: ['Nombres cortos de 1 letra', 'Nombres descriptivos en camelCase', 'Números al inicio', 'Caracteres especiales'],
    correctIndex: 1,
  },
  {
    id: 'q2', question: '¿Qué es el control de versiones (Git)?',
    options: [
      'Un lenguaje de programación',
      'Una base de datos',
      'Un sistema para rastrear cambios en el código',
      'Un framework de frontend',
    ],
    correctIndex: 2,
  },
  {
    id: 'q3', question: '¿Qué significa DRY en programación?',
    options: ["Don't Repeat Yourself", 'Do Run Yourself', 'Define Route Yourself', 'Design Render Yield'],
    correctIndex: 0,
  },
  {
    id: 'q4', question: '¿Qué es una API REST?',
    options: [
      'Un framework de JavaScript',
      'Una base de datos relacional',
      'Una interfaz de programación que usa HTTP y sigue principios REST',
      'Un sistema operativo',
    ],
    correctIndex: 2,
  },
  {
    id: 'q5', question: '¿Qué es el testing unitario?',
    options: [
      'Probar la app completa de punta a punta',
      'Verificar unidades individuales de código de forma aislada',
      'Hacer pruebas manuales de UI',
      'Probar el servidor en producción',
    ],
    correctIndex: 1,
  },
];

@Injectable({ providedIn: 'root' })
export class ExamService {

  getQuestions(courseId: string): ExamQuestion[] {
    return MOCK_EXAMS[courseId] ?? DEFAULT_QUESTIONS;
  }

  calculateScore(answers: number[], questions: ExamQuestion[]): number {
    if (!questions.length) return 0;
    const correct = answers.filter((ans, i) => ans === questions[i]?.correctIndex).length;
    return Math.round((correct / questions.length) * 100);
  }

  isPassed(score: number): boolean {
    return score >= 51;
  }
}
