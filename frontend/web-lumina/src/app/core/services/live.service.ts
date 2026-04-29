import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, timer, of } from 'rxjs';
import { switchMap, shareReplay, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface LiveStatus {
  isLive: boolean;
  session?: any;
}

@Injectable({ providedIn: 'root' })
export class LiveService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = `${environment.apiUrl}/live/status`;

  // Polling cada 30 segundos (o mediante websockets si prefieres)
  // IMPORTANTE: Solo habilitamos el polling en el navegador para evitar colgar el SSR
  private status$ = isPlatformBrowser(this.platformId) 
    ? timer(0, 30_000).pipe(
        switchMap(() => this.http.get<LiveStatus>(this.apiUrl)),
        catchError(() => of({ isLive: false })),
        shareReplay(1)
      )
    : this.http.get<LiveStatus>(this.apiUrl).pipe(
        catchError(() => of({ isLive: false })),
        shareReplay(1)
      );

  getStatus(): Observable<LiveStatus> {
    return this.status$;
  }
}