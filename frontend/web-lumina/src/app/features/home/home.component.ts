import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[#0A0F1A] text-slate-200 selection:bg-blue-500/30 font-sans overflow-x-hidden">

      <!-- 1. Hero Section -->
      <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <!-- Glow background -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-blue-400 mb-8 backdrop-blur-sm">
            <span class="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            Impulsado por Lumina
          </div>

          <h1 class="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Domina la tecnología,<br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              forja tu futuro.
            </span>
          </h1>

          <p class="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
            Una academia virtual integral de e-learning diseñada para optimizar tu aprendizaje. Elimina la fricción técnica y concéntrate en escribir código.
          </p>

          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <a routerLink="/auth/register" class="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30">
              Crear cuenta gratis
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </a>
            <a routerLink="/courses" class="inline-flex justify-center items-center px-8 py-4 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-lg transition-all hover:-translate-y-1">
              Explorar cursos
            </a>
          </div>
        </div>
      </section>

      <!-- 2. Tecnologías (Stack) -->
      <section class="py-10 border-y border-white/5 bg-slate-900/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p class="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">Aprende y construye con el mejor stack</p>
          <div class="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <!-- Angular -->
            <div class="flex items-center gap-2 font-bold text-xl text-white">
              <svg class="w-8 h-8" viewBox="0 0 250 250" fill="none"><path fill="#DD0031" d="M125 30L31.9 63.2l14.2 123.1L125 230l78.9-43.7 14.2-123.1z"/><path fill="#C3002F" d="M125 30v200l78.9-43.7 14.2-123.1z"/><path fill="#FFF" d="M125 52.1L66.8 182.6h21.7l11.7-29.2h49.4l11.7 29.2H183L125 52.1zm17 83.3h-34l17-40.9 17 40.9z"/></svg>
              Angular
            </div>
            <!-- Laravel -->
            <div class="flex items-center gap-2 font-bold text-xl text-white">
              <svg class="w-8 h-8" viewBox="0 0 250 250" fill="none"><path fill="#FF2D20" d="M225 125c0 55.2-44.8 100-100 100S25 180.2 25 125 69.8 25 125 25s100 44.8 100 100z"/><path fill="#FFF" d="M125 50L60 162h130L125 50zm0 30l40 69H85l40-69z"/></svg>
              Laravel
            </div>
            <!-- PostgreSQL -->
            <div class="flex items-center gap-2 font-bold text-xl text-white">
              <svg class="w-8 h-8" viewBox="0 0 250 250" fill="none"><path fill="#336791" d="M125 25C69.8 25 25 69.8 25 125s44.8 100 100 100 100-44.8 100-100S180.2 25 125 25z"/><path fill="#FFF" d="M125 60c-35.9 0-65 29.1-65 65s29.1 65 65 65 65-29.1 65-65-29.1-65-65-65zm0 100c-19.3 0-35-15.7-35-35s15.7-35 35-35 35 15.7 35 35-15.7 35-35 35z"/></svg>
              PostgreSQL
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Acerca de CodeForge (Inspirado en README) -->
      <section class="py-24 relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 class="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Disipando las sombras <br/> de la tecnología.
              </h2>
              <blockquote class="border-l-4 border-blue-500 pl-6 my-8">
                <p class="text-xl text-slate-300 italic leading-relaxed">
                  «La tecnología suele ser oscura y difícil de entender. Lumina disipa las sombras iluminando el camino de los futuros profesionales con rutas de aprendizaje claras y directas.»
                </p>
              </blockquote>
              <p class="text-slate-400 text-lg leading-relaxed mb-8">
                Diseñada para optimizar la gestión de cursos para desarrolladores e impulsar el talento en IT. Eliminamos la fricción matemática y técnica entre las suscripciones, los pagos automatizados y tu acceso al contenido de valor.
              </p>
              <ul class="space-y-4">
                <li class="flex items-center gap-3 text-slate-300">
                  <svg class="w-6 h-6 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Modelo de suscripción sin complicaciones.
                </li>
                <li class="flex items-center gap-3 text-slate-300">
                  <svg class="w-6 h-6 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Rutas de aprendizaje estructuradas (Paths).
                </li>
                <li class="flex items-center gap-3 text-slate-300">
                  <svg class="w-6 h-6 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Arquitectura robusta con Angular 21 y Laravel 11.
                </li>
              </ul>
            </div>
            
            <div class="relative">
              <!-- Decoración geométrica en lugar de imagen para mantener el diseño limpio -->
              <div class="aspect-square max-w-md mx-auto relative">
                <div class="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl transform rotate-6 opacity-20 blur-lg"></div>
                <div class="absolute inset-0 bg-slate-800 rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
                  <!-- Falso editor de código -->
                  <div class="h-10 bg-slate-900 border-b border-white/5 flex items-center px-4 gap-2">
                    <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div class="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div class="p-6 font-mono text-sm text-blue-300 flex-1 flex flex-col justify-center">
                    <p><span class="text-pink-400">const</span> <span class="text-blue-200">academy</span> = <span class="text-pink-400">new</span> <span class="text-amber-200">CodeForge</span>();</p>
                    <p class="mt-2"><span class="text-blue-200">academy</span>.<span class="text-amber-200">enroll</span>(&#123;</p>
                    <p class="ml-4 text-slate-400">student: <span class="text-green-300">'You'</span>,</p>
                    <p class="ml-4 text-slate-400">focus: <span class="text-green-300">'Fullstack Mastery'</span>,</p>
                    <p class="ml-4 text-slate-400">passion: <span class="text-pink-400">true</span></p>
                    <p>&#125;);</p>
                    <p class="mt-4"><span class="text-blue-200">academy</span>.<span class="text-amber-200">startLearning</span>(); <span class="text-slate-500">// Success!</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Beneficios (Features) -->
      <section class="py-24 bg-[#05080f]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">La mejor forma de aprender programación</h2>
            <p class="text-slate-400 text-lg">Todo lo que necesitas para llevar tus habilidades al siguiente nivel.</p>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div class="bg-slate-800/50 rounded-2xl p-8 border border-white/5 hover:border-blue-500/30 transition-colors group">
              <div class="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <svg class="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-3">Proyectos del mundo real</h3>
              <p class="text-slate-400 leading-relaxed">No más "Hola Mundo". Construye aplicaciones completas y escalables idénticas a las que usarías en un trabajo real.</p>
            </div>
            <!-- Feature 2 -->
            <div class="bg-slate-800/50 rounded-2xl p-8 border border-white/5 hover:border-indigo-500/30 transition-colors group">
              <div class="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                <svg class="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-3">Rutas estructuradas</h3>
              <p class="text-slate-400 leading-relaxed">Sigue un camino claro de principio a fin. Sin perder el tiempo buscando qué tecnología aprender después.</p>
            </div>
            <!-- Feature 3 -->
            <div class="bg-slate-800/50 rounded-2xl p-8 border border-white/5 hover:border-purple-500/30 transition-colors group">
              <div class="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                <svg class="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-3">A tu propio ritmo</h3>
              <p class="text-slate-400 leading-relaxed">Acceso 24/7 a todos los recursos. Estudia en tus tiempos libres, repite las clases y avanza a la velocidad que necesites.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. CTA Final -->
      <section class="py-24 relative overflow-hidden">
        <div class="absolute inset-0 bg-blue-600/10"></div>
        <div class="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
        <div class="max-w-4xl mx-auto px-4 text-center relative">
          <h2 class="text-3xl md:text-5xl font-bold text-white mb-6">¿Listo para escribir tu primera línea de código profesional?</h2>
          <p class="text-xl text-blue-200/70 mb-10">Únete a CodeForge Academy hoy y transforma tu carrera.</p>
          <a routerLink="/auth/register" class="inline-flex justify-center items-center px-8 py-4 rounded-full bg-white text-blue-600 font-bold text-lg hover:bg-slate-100 transition-all hover:scale-105 hover:shadow-xl hover:shadow-white/20">
            Comienza tu prueba gratuita
          </a>
        </div>
      </section>

      <!-- Footer simple -->
      <footer class="border-t border-white/5 bg-[#0A0F1A] py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-xl font-bold text-white">CodeForge</span>
            <span class="text-slate-500 text-sm">© 2026</span>
          </div>
          <div class="flex gap-6 text-sm text-slate-400">
            <a href="#" class="hover:text-white transition-colors">Términos</a>
            <a href="#" class="hover:text-white transition-colors">Privacidad</a>
            <a href="#" class="hover:text-white transition-colors">Contacto</a>
          </div>
        </div>
      </footer>

    </div>
  `
})
export class HomeComponent {
  auth = inject(AuthService);
  isAuthenticated = this.auth.isAuthenticated;
}
