// features/user-profile/profile/profile.component.ts
import {
  Component, inject, signal, OnInit, PLATFORM_ID, ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

const API = `${environment.apiUrl}/auth`;

@Component({
  selector: 'app-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, FormsModule],
  styles: [`
    :host { display: block; }
    .pf-card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 1.25rem;
    }
    .pf-input {
      width: 100%; background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 0.5rem; padding: 0.625rem 0.875rem;
      color: #f1f5f9; font-size: 0.875rem; outline: none;
      box-sizing: border-box; font-family: inherit;
    }
    .pf-input:focus { border-color: #3b82f6; }
    .pf-label { color: #94a3b8; font-size: 0.78rem; display: block; margin-bottom: 0.35rem; }
    .pf-row { display: flex; justify-content: space-between; align-items: center; }
    .pf-section-title { font-size: 1rem; font-weight: 600; color: #e2e8f0; margin: 0; }
    .pf-btn-outline {
      background: rgba(59,130,246,0.15); color: #60a5fa; border: none;
      padding: 0.375rem 0.875rem; border-radius: 0.5rem; font-size: 0.8rem;
      cursor: pointer; font-weight: 500;
    }
    .pf-btn-primary {
      background: linear-gradient(135deg,#3b82f6,#6366f1); color: #fff; border: none;
      padding: 0.625rem 1.5rem; border-radius: 0.625rem; font-size: 0.875rem;
      font-weight: 600; cursor: pointer; margin-top: 0.5rem;
    }
    .pf-btn-danger {
      background: linear-gradient(135deg,#7c3aed,#6366f1); color: #fff; border: none;
      padding: 0.625rem 1.5rem; border-radius: 0.625rem; font-size: 0.875rem;
      font-weight: 600; cursor: pointer; margin-top: 0.5rem;
    }
    .pf-info-row {
      display: flex; justify-content: space-between; padding: 0.6rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 0.85rem;
    }
    .pf-info-row:last-child { border-bottom: none; }
    .pf-info-label { color: #64748b; }
    .pf-info-value { color: #e2e8f0; }
    .pf-success { color: #4ade80; font-size: 0.8rem; text-align: center; margin: 0.25rem 0; }
    .pf-error   { color: #f87171; font-size: 0.8rem; text-align: center; margin: 0.25rem 0; }
    .pf-badge {
      background: rgba(59,130,246,0.15); color: #60a5fa;
      padding: 0.2rem 0.7rem; border-radius: 9999px; font-size: 0.72rem;
      font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;
    }
    .pf-oauth-badge {
      display:inline-flex; align-items:center; gap:0.35rem;
      background: rgba(255,255,255,0.07); border-radius:9999px;
      padding:0.2rem 0.65rem; font-size:0.75rem; color:#94a3b8;
      border:1px solid rgba(255,255,255,0.1);
    }
    .pf-action-btn {
      width:100%; display:flex; align-items:center; justify-content:space-between;
      padding:0.75rem; border-radius:0.75rem; background:transparent; border:none;
      cursor:pointer; text-align:left; transition:background 0.15s;
    }
    .pf-action-btn:hover { background: rgba(255,255,255,0.04); }
  `],
  template: `
    <div style="max-width:800px;margin:0 auto;padding:2rem 1rem;">

      <h1 style="font-size:1.75rem;font-weight:700;color:#f1f5f9;margin:0 0 1.5rem;">Mi perfil</h1>

      @if (auth.currentUser(); as user) {

        <!-- ── Avatar + resumen ───────────────────────────────── -->
        <div class="pf-card" style="display:flex;align-items:center;gap:1.25rem;flex-wrap:wrap;">
          <!-- Avatar -->
          <div style="position:relative;flex-shrink:0;">
            @if (user.avatarUrl) {
              <img [src]="user.avatarUrl" alt="Avatar"
                   style="width:76px;height:76px;border-radius:50%;object-fit:cover;
                          border:2px solid #3b82f6;">
            } @else {
              <div style="width:76px;height:76px;border-radius:50%;
                          background:linear-gradient(135deg,#38bdf8,#3b82f6);
                          display:flex;align-items:center;justify-content:center;
                          font-size:1.9rem;font-weight:700;color:#fff;">
                {{ initial(user.name) }}
              </div>
            }
          </div>
          <!-- Info -->
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;margin-bottom:0.25rem;">
              <h2 style="font-size:1.2rem;font-weight:600;color:#f1f5f9;margin:0;">{{ user.name }}</h2>
              <span class="pf-badge">{{ user.role }}</span>
            </div>
            <p style="color:#94a3b8;font-size:0.875rem;margin:0 0 0.2rem;">{{ user.email }}</p>
            <p style="color:#64748b;font-size:0.75rem;margin:0 0 0.5rem;">
              Miembro desde {{ formatDate(user.createdAt) }}
            </p>
            <!-- Cuentas vinculadas -->
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
              @if (user.hasGoogle) {
                <span class="pf-oauth-badge">
                  <svg width="13" height="13" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.27 9.76A7.08 7.08 0 0 1 12 4.9c1.76 0 3.35.64 4.59 1.68l3.43-3.43A11.97 11.97 0 0 0 12 1C8.2 1 4.87 3 2.9 6.06l2.37 3.7Z"/><path fill="#34A853" d="M16.04 18.01A7.04 7.04 0 0 1 12 19.1a7.08 7.08 0 0 1-6.72-4.85l-3.7 2.86A11.97 11.97 0 0 0 12 23c3.58 0 6.6-1.32 8.83-3.48l-4.79-1.51Z"/><path fill="#FBBC05" d="M19.1 12c0-.65-.06-1.28-.17-1.88H12v3.77h3.97A3.42 3.42 0 0 1 14.41 16l4.79 1.51A11.94 11.94 0 0 0 21 12c0-.99-.13-1.95-.38-2.86L19.1 12Z"/><path fill="#4285F4" d="M12 4.9c1.76 0 3.35.64 4.59 1.68l3.43-3.43A11.97 11.97 0 0 0 12 1C8.2 1 4.87 3 2.9 6.06l3.7 2.86A7.08 7.08 0 0 1 12 4.9Z"/></svg>
                  Google
                </span>
              }
              @if (user.hasGithub) {
                <span class="pf-oauth-badge">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#94a3b8"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48l-.01-1.69c-2.78.61-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85 0 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85l-.01 2.74c0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10Z"/></svg>
                  GitHub
                </span>
              }
            </div>
          </div>
        </div>

        <!-- ── Stats ─────────────────────────────────────────── -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.25rem;">
          <div class="pf-card" style="text-align:center;margin:0;">
            <p style="font-size:2rem;font-weight:700;color:#38bdf8;margin:0 0 0.25rem;">
              {{ user.enrolledCourseIds.length }}
            </p>
            <p style="color:#94a3b8;font-size:0.8rem;margin:0;">Cursos inscritos</p>
          </div>
          <div class="pf-card" style="text-align:center;margin:0;">
            <p style="font-size:2rem;font-weight:700;color:#4ade80;margin:0 0 0.25rem;">0</p>
            <p style="color:#94a3b8;font-size:0.8rem;margin:0;">Completados</p>
          </div>
          <div class="pf-card" style="text-align:center;margin:0;">
            <p style="font-size:2rem;font-weight:700;color:#fbbf24;margin:0 0 0.25rem;">0</p>
            <p style="color:#94a3b8;font-size:0.8rem;margin:0;">Certificados</p>
          </div>
        </div>

        <!-- ── Información personal ──────────────────────────── -->
        <div class="pf-card">
          <div class="pf-row" style="margin-bottom:1.25rem;">
            <h3 class="pf-section-title">Información personal</h3>
            <button class="pf-btn-outline" (click)="editMode.set(!editMode())">
              {{ editMode() ? 'Cancelar' : 'Editar' }}
            </button>
          </div>

          @if (editMode()) {
            <form (ngSubmit)="saveProfile()" style="display:flex;flex-direction:column;gap:1rem;">

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                <div>
                  <label class="pf-label">Nombre completo *</label>
                  <input class="pf-input" [(ngModel)]="form.name" name="name" required>
                </div>
                <div>
                  <label class="pf-label">Teléfono</label>
                  <input class="pf-input" [(ngModel)]="form.phone" name="phone" type="tel"
                         placeholder="+591 7xxxxxxx">
                </div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                <div>
                  <label class="pf-label">Fecha de nacimiento</label>
                  <input class="pf-input" [(ngModel)]="form.dateOfBirth" name="dateOfBirth" type="date">
                </div>
                <div>
                  <label class="pf-label">URL de foto de perfil</label>
                  <input class="pf-input" [(ngModel)]="form.avatarUrl" name="avatarUrl" type="url"
                         placeholder="https://...">
                </div>
              </div>

              <div>
                <label class="pf-label">Biografía (máx. 1000 caracteres)</label>
                <textarea class="pf-input" [(ngModel)]="form.bio" name="bio" rows="3"
                          placeholder="Cuéntanos algo sobre ti..."
                          style="resize:vertical;"></textarea>
              </div>

              <!-- Redes sociales -->
              <div style="border-top:1px solid rgba(255,255,255,0.07);padding-top:1rem;">
                <p style="color:#94a3b8;font-size:0.8rem;margin:0 0 0.75rem;font-weight:500;">
                  Redes sociales (próximamente)
                </p>
                <div style="display:flex;flex-direction:column;gap:0.625rem;">
                  @for (net of networks; track net.key) {
                    <div style="display:flex;align-items:center;gap:0.75rem;">
                      <span style="color:#64748b;font-size:0.82rem;width:80px;flex-shrink:0;">
                        {{ net.label }}
                      </span>
                      <input class="pf-input" [(ngModel)]="socialLinks[net.key]" [name]="net.key"
                             [placeholder]="net.placeholder" style="padding:0.5rem 0.75rem;">
                    </div>
                  }
                </div>
              </div>

              @if (saveMsg()) { <p class="pf-success">{{ saveMsg() }}</p> }
              @if (saveErr()) { <p class="pf-error">{{ saveErr() }}</p> }

              <button type="submit" class="pf-btn-primary" [disabled]="saving()">
                {{ saving() ? 'Guardando...' : 'Guardar cambios' }}
              </button>
            </form>

          } @else {
            <div>
              <div class="pf-info-row">
                <span class="pf-info-label">Nombre</span>
                <span class="pf-info-value">{{ user.name }}</span>
              </div>
              <div class="pf-info-row">
                <span class="pf-info-label">Email</span>
                <span class="pf-info-value">{{ user.email }}</span>
              </div>
              @if (user.phone) {
                <div class="pf-info-row">
                  <span class="pf-info-label">Teléfono</span>
                  <span class="pf-info-value">{{ user.phone }}</span>
                </div>
              }
              @if (user.dateOfBirth) {
                <div class="pf-info-row">
                  <span class="pf-info-label">Nacimiento</span>
                  <span class="pf-info-value">{{ formatDate(user.dateOfBirth) }}</span>
                </div>
              }
              @if (user.bio) {
                <div class="pf-info-row" style="flex-direction:column;align-items:flex-start;gap:0.25rem;">
                  <span class="pf-info-label">Biografía</span>
                  <span class="pf-info-value" style="white-space:pre-wrap;">{{ user.bio }}</span>
                </div>
              }
              @if (!user.phone && !user.bio && !user.dateOfBirth) {
                <p style="color:#475569;font-size:0.85rem;margin:0.5rem 0 0;">
                  Haz clic en "Editar" para completar tu perfil.
                </p>
              }
            </div>
          }
        </div>

        <!-- ── Contraseña ─────────────────────────────────────── -->
        <div class="pf-card">
          <div class="pf-row" style="margin-bottom:1rem;">
            <div>
              <h3 class="pf-section-title">
                {{ user.hasPassword ? 'Cambiar contraseña' : 'Establecer contraseña' }}
              </h3>
              @if (!user.hasPassword) {
                <p style="color:#f59e0b;font-size:0.78rem;margin:0.25rem 0 0;">
                  Tu cuenta fue creada con Google/GitHub — aún no tienes contraseña configurada.
                </p>
              }
            </div>
            <button class="pf-btn-outline" (click)="pwMode.set(!pwMode())">
              {{ pwMode() ? 'Cancelar' : (user.hasPassword ? 'Cambiar' : 'Establecer') }}
            </button>
          </div>

          @if (pwMode()) {
            <form (ngSubmit)="changePassword(user.hasPassword ?? false)"
                  style="display:flex;flex-direction:column;gap:0.875rem;">
              <!-- Solo mostrar "contraseña actual" si el usuario ya tiene una -->
              @if (user.hasPassword) {
                <div>
                  <label class="pf-label">Contraseña actual</label>
                  <input class="pf-input" [(ngModel)]="pw.current" name="currentPw" type="password"
                         autocomplete="current-password">
                </div>
              }
              <div>
                <label class="pf-label">
                  {{ user.hasPassword ? 'Nueva contraseña' : 'Contraseña' }} (mín. 8 caracteres)
                </label>
                <input class="pf-input" [(ngModel)]="pw.new" name="newPw" type="password"
                       autocomplete="new-password">
              </div>
              <div>
                <label class="pf-label">Confirmar contraseña</label>
                <input class="pf-input" [(ngModel)]="pw.confirm" name="confirmPw" type="password"
                       autocomplete="new-password">
              </div>

              @if (pwMsg())   { <p class="pf-success">{{ pwMsg() }}</p> }
              @if (pwErr())   { <p class="pf-error">{{ pwErr() }}</p> }

              <button type="submit" class="pf-btn-danger" [disabled]="savingPw()">
                {{ savingPw() ? 'Actualizando...' : (user.hasPassword ? 'Actualizar contraseña' : 'Establecer contraseña') }}
              </button>
            </form>
          } @else {
            <p style="color:#64748b;font-size:0.85rem;margin:0;">
              {{ user.hasPassword
                ? 'Usa una contraseña segura que no uses en otros sitios.'
                : 'Establece una contraseña para poder acceder también con email y contraseña.' }}
            </p>
          }
        </div>

        <!-- ── Cuenta ─────────────────────────────────────────── -->
        <div class="pf-card">
          <h3 class="pf-section-title" style="margin-bottom:1rem;">Cuenta</h3>
          <div>
            <a routerLink="/courses" style="text-decoration:none;">
              <button class="pf-action-btn">
                <span style="color:#cbd5e1;font-size:0.875rem;">Explorar más cursos</span>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#64748b">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </a>
            <button class="pf-action-btn" (click)="auth.logout()">
              <span style="color:#f87171;font-size:0.875rem;font-weight:500;">Cerrar sesión</span>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f87171">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0
                         01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </div>

      } @else {
        <div style="text-align:center;padding:5rem 0;">
          <p style="color:#94a3b8;margin-bottom:1rem;">No has iniciado sesión.</p>
          <a routerLink="/auth/login" style="color:#3b82f6;text-decoration:none;">Iniciar sesión</a>
        </div>
      }
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  readonly auth       = inject(AuthService);
  private readonly http       = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cdr        = inject(ChangeDetectorRef);

  editMode = signal(false);
  pwMode   = signal(false);
  saving   = signal(false);
  savingPw = signal(false);
  saveMsg  = signal('');
  saveErr  = signal('');
  pwMsg    = signal('');
  pwErr    = signal('');

  form = {
    name: '', phone: '', bio: '', dateOfBirth: '', avatarUrl: '',
  };
  socialLinks: Record<string, string> = {
    github: '', linkedin: '', twitter: '', website: '',
  };
  pw = { current: '', new: '', confirm: '' };

  readonly networks = [
    { key: 'github',   label: 'GitHub',    placeholder: 'https://github.com/usuario' },
    { key: 'linkedin', label: 'LinkedIn',  placeholder: 'https://linkedin.com/in/usuario' },
    { key: 'twitter',  label: 'Twitter/X', placeholder: 'https://twitter.com/usuario' },
    { key: 'website',  label: 'Web',       placeholder: 'https://mipagina.com' },
  ];

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const user = this.auth.currentUser();
    if (user) {
      this.form.name        = user.name        ?? '';
      this.form.phone       = user.phone       ?? '';
      this.form.bio         = user.bio         ?? '';
      this.form.dateOfBirth = user.dateOfBirth ?? '';
      this.form.avatarUrl   = user.avatarUrl   ?? '';
    }
  }

  initial(name: string) { return name?.charAt(0).toUpperCase() ?? '?'; }

  formatDate(iso: string) {
    try { return new Date(iso).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return iso; }
  }

  saveProfile() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.saving.set(true); this.saveErr.set(''); this.saveMsg.set('');

    const body: Record<string, string | null> = {
      name:          this.form.name        || null,
      phone:         this.form.phone       || null,
      bio:           this.form.bio         || null,
      date_of_birth: this.form.dateOfBirth || null,
      avatar_url:    this.form.avatarUrl   || null,
    };

    this.http.put<any>(`${API}/profile`, body).subscribe({
      next: (updatedUser) => {
        this.auth.acceptExternalUser(updatedUser); // actualiza el signal del usuario
        this.saving.set(false);
        this.saveMsg.set('✓ Perfil actualizado correctamente.');
        setTimeout(() => { this.saveMsg.set(''); this.editMode.set(false); }, 2000);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.saving.set(false);
        const msg = err.error?.message ?? Object.values(err.error ?? {})?.[0] ?? 'Error al guardar.';
        this.saveErr.set(typeof msg === 'string' ? msg : (msg as string[])[0]);
        this.cdr.markForCheck();
      },
    });
  }

  changePassword(hasPassword: boolean) {
    if (!isPlatformBrowser(this.platformId)) return;
    this.pwErr.set(''); this.pwMsg.set('');

    if (this.pw.new.length < 8) {
      this.pwErr.set('La contraseña debe tener al menos 8 caracteres.'); return;
    }
    if (this.pw.new !== this.pw.confirm) {
      this.pwErr.set('Las contraseñas no coinciden.'); return;
    }

    this.savingPw.set(true);
    const body: Record<string, string> = {
      new_password:              this.pw.new,
      new_password_confirmation: this.pw.confirm,
    };
    if (hasPassword) body['current_password'] = this.pw.current;

    this.http.put<any>(`${API}/password`, body).subscribe({
      next: () => {
        this.savingPw.set(false);
        this.pwMsg.set('✓ Contraseña actualizada correctamente.');
        this.pw = { current: '', new: '', confirm: '' };
        setTimeout(() => { this.pwMsg.set(''); this.pwMode.set(false); }, 2000);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.savingPw.set(false);
        const msg = err.error?.error
          ?? err.error?.new_password?.[0]
          ?? err.error?.current_password?.[0]
          ?? 'Error al actualizar la contraseña.';
        this.pwErr.set(msg);
        this.cdr.markForCheck();
      },
    });
  }
}