import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TwitchService {
  private baseUrl = 'https://viajesumback.onrender.com/twitch'; // URL del backend

  constructor(private http: HttpClient) {}

  /**
   * Redirige al usuario a iniciar sesión con Twitch.
   */
  login(): void {
    window.location.href = `${this.baseUrl}/login`;
  }

  /**
   * Inicia un stream con el título y el ID del juego.
   * @param accessToken Token de acceso de Twitch.
   * @param title Título del stream.
   * @param gameId ID del juego.
   */
  startStream(accessToken: string, title: string, gameId: string): Observable<any> {
    const body = { accessToken, title, game_id: gameId };
    return this.http.post(`${this.baseUrl}/start-stream`, body);
  }

  /**
   * Obtiene el título y el juego actuales del stream.
   * @param accessToken Token de acceso de Twitch.
   */
  getStreamTitle(accessToken: string): Observable<any> {
    const params = new HttpParams().set('access_token', accessToken);
    return this.http.get(`${this.baseUrl}/stream-title`, { params });
  }
}
