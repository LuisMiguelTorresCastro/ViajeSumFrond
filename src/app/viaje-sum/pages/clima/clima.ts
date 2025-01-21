import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenWeatherService {
  private apiKey = '4a290428b9225740a189614b562f68b4'; // Reemplaza con tu clave
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) {}

  // Método para obtener el clima por ciudad
  getWeatherByCity(city: string): Observable<any> {
    const url = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`;
    return this.http.get(url);
  }
  getWeatherByCoords(lat: number, lon: number) {
    return this.http.get(
      `${this.apiUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
    );
  }
}
