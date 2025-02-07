import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs'; // Import 'of'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OpenWeatherService {
  private apiKey = '4a290428b9225740a189614b562f68b4'; // Reemplaza con tu clave
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  private weatherTranslations: { [key: string]: string } = {
    'clear sky': 'Cielo despejado',
    'few clouds': 'Pocas nubes',
    'scattered clouds': 'Nubes dispersas',
    'broken clouds': 'Nubes fragmentadas',
    'shower rain': 'Lluvia ligera',
    'rain': 'Lluvia',
    'thunderstorm': 'Tormenta',
    'snow': 'Nieve',
    'mist': 'Neblina',
    'overcast clouds': 'Nublado',
    // Add more translations as needed
  };

  constructor(private http: HttpClient) {}

  getWeatherByCity(city: string): Observable<any> {
    const url = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`;
    return this.http.get(url);
  }

  getWeatherByCoords(lat: number, lon: number): Observable<any> {  // Added return type
    const url = `${this.apiUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    return this.http.get(url);
  }

    getWeatherDescription(description: string): Observable<string> {
        const translation = this.weatherTranslations[description.toLowerCase()];
        return of(translation || description); // Return translated description or original
    }

    // *BETTER* - Combine into a single method:
    getWeatherAndTranslation(lat: number, lon: number): Observable<any> {
        return this.getWeatherByCoords(lat, lon).pipe(
            map((data: any) => {
                const englishDescription = data.weather[0].description;
                const translatedDescription = this.weatherTranslations[englishDescription.toLowerCase()] || englishDescription;
                // Add the translated description to the data object
                data.weather[0].descriptionSpanish = translatedDescription;
                return data;
            })
        );
    }
}
