// src/app/shared/components/footer/footer.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FooterLink {
    label: string;
    route: string;
}

interface FooterSection {
    title: string;
    links: FooterLink[];
}

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
    currentYear = new Date().getFullYear();

    sections: FooterSection[] = [
        {
            title: 'Plataforma',
            links: [
                { label: 'Cursos', route: '/courses' },
                { label: 'Rutas', route: '/paths' },
                { label: 'Escuelas', route: '/schools' },
                { label: 'Empresas', route: '/business' },
            ],
        },
        {
            title: 'Oportunidades',
            links: [
                { label: 'Trabajos', route: '/jobs' },
                { label: 'En vivo', route: '/live' },
                { label: 'Premium', route: '/premium' },
            ],
        },
        {
            title: 'Compañía',
            links: [
                { label: 'Sobre nosotros', route: '/about' },
                { label: 'Contacto', route: '/contact' },
                { label: 'Blog', route: '/blog' },
            ],
        },
        {
            title: 'Legal',
            links: [
                { label: 'Privacidad', route: '/privacy' },
                { label: 'Términos', route: '/terms' },
                { label: 'Cookies', route: '/cookies' },
            ],
        },
    ];

    socialLinks = [
        {
            label: 'GitHub',
            href: 'https://github.com/codeforge',
            icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-1.249-.373-2.566-.625-2.566-.625s1.313-.168 2.654-.168c1.341 0 2.654.168 2.654.168-1.289-.654-2.566-.906-2.566-.906s1.313-.168 2.654-.168c1.341 0 2.654.168 2.654.168z'
        },
        {
            label: 'Twitter',
            href: 'https://twitter.com/codeforge',
            icon: 'M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z'
        },
        {
            label: 'LinkedIn',
            href: 'https://linkedin.com/company/codeforge',
            icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
        },
        {
            label: 'YouTube',
            href: 'https://youtube.com/@codeforge',
            icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
        },
    ];
}