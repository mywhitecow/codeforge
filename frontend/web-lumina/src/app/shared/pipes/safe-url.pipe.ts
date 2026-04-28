// shared/pipes/safe-url.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Sanitiza una URL para uso seguro en iframes (bypass de Angular security).
 * Uso: [src]="url | safeUrl"
 */
@Pipe({ name: 'safeUrl', standalone: true, pure: true })
export class SafeUrlPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
