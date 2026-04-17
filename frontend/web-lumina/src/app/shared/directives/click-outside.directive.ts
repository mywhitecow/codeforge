import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({ selector: '[clickOutside]', standalone: true })
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  onClick(target: EventTarget | null): void {
    // Verificar que target sea un elemento HTML y que no sea nulo
    if (target instanceof HTMLElement && !this.el.nativeElement.contains(target)) {
      this.clickOutside.emit();
    }
  }
}