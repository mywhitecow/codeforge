// src/app/shared/components/profile-dropdown/profile-dropdown.component.ts
import { Component, Output, EventEmitter, HostListener, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PermissionService } from '../../../core/services/permission.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.scss'],
})
export class ProfileDropdownComponent {
  @Output() close = new EventEmitter<void>();

  private auth = inject(AuthService);
  private router = inject(Router);
  private permissions = inject(PermissionService);

  // Usuario actual desde AuthService
  currentUser = this.auth.currentUser;

  // Calcula iniciales (máximo 2 letras)
  userInitials = computed(() => {
    const user = this.currentUser();
    if (!user?.name) return 'U';
    const parts = user.name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  });

  // Genera un username a partir del email o nombre
  computedUsername = computed(() => {
    const user = this.currentUser();
    if (user?.email) {
      return '@' + user.email.split('@')[0];
    }
    if (user?.name) {
      return '@' + user.name.toLowerCase().replace(/\s/g, '');
    }
    return '@usuario';
  });

  // Estado del submenú de moneda
  showCurrencyMenu = false;

  // Opciones del menú con rutas REALES de tu aplicación (calculado dinámicamente según permisos)
  menuItems = computed(() => {
    const items = [
      { label: 'Tu perfil',     icon: '👤', route: '/profile' },
      { label: 'Tus estudios',  icon: '🎓', route: '/paths' },
      { label: 'Tus cursos',    icon: '📚', route: '/my-courses' },
      { label: 'Tus apuntes',   icon: '✏️', route: '/notes' },
    ];

    if (this.permissions.isAdmin()) {
      items.push({ label: 'Panel de Admin', icon: '⚙️', route: '/admin' });
    } else if (this.permissions.isInstructor()) {
      items.push({ label: 'Panel Instructor', icon: '🏫', route: '/instructor' });
    }

    items.push({ label: 'Ayuda', icon: '❓', route: '/help' });
    return items;
  });

  // Navegar y cerrar menú
  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.closeMenu();
  }

  // Botón premium
  upgradeToPremium(): void {
    this.router.navigate(['/premium']); // ruta ya existe (placeholder)
    this.closeMenu();
  }

  // Cerrar sesión
  logout(): void {
    this.auth.logout(); // Este método ya redirige a /auth/login
    this.closeMenu();
  }

  // Submenú de moneda
  toggleCurrencyMenu(event: Event): void {
    event.stopPropagation();
    this.showCurrencyMenu = !this.showCurrencyMenu;
  }

  changeCurrency(currency: string): void {
    console.log(`Moneda cambiada a ${currency}`);
    // Aquí puedes implementar un servicio de moneda
    this.showCurrencyMenu = false;
  }

  closeMenu(): void {
    this.close.emit();
  }

  @HostListener('click', ['$event'])
  onClickInside(event: Event): void {
    event.stopPropagation();
  }
}