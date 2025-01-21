import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet'; // Importar Leaflet
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Paquete } from '../../../auth/pages.adm/Paquetes/Paquete.interface';
import { AuthService } from '../../auth-service/auth-service';
import { OpenWeatherService } from '../clima/clima';

@Component({
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.css'],
    standalone: false
})
export class InicioComponent implements OnInit {
  private map!: L.Map; // Usa `!` para indicar que se inicializará antes de su uso
  query: string = '';
  results: any[] = [];
  searchPerformed: boolean = false;
  paquetes: Paquete[] = [];
  messages: { text: string; user: boolean }[] = [];
  userMessage: string = '';
  weatherData: any;
  city: string = 'Madrid';

  private apiKey: string = 'AIzaSyBvNvglP7o-lrZgF-UOsvp6kIuozxowfmc';
  private searchEngineId: string = '5395e56e7b3eb4ab0';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private weatherService: OpenWeatherService
  ) {}

  ngOnInit() {
    this.initMap();
    this.loadTouristLocations(); // Inicializar el mapa y cargar ubicaciones al iniciar
    this.loadPaquetes();
    this.fetchWeather();
  }

  // Función para cargar los paquetes desde la API
  private loadPaquetes() {
    this.http.get<Paquete[]>('https://viajesumback.onrender.com/Paquetes').subscribe(
      (data) => {
        console.log('Paquetes:', data);
        this.paquetes = data;
      },
      (error) => {
        console.error('Error al cargar los paquetes:', error);
      }
    );
  }

  private doloresHidalgoCoords = { lat: 21.1579, lon: -100.9343 };

  private initMap() {
    // Inicializar el mapa centrado en Dolores Hidalgo
    this.map = L.map('map').setView(
      [this.doloresHidalgoCoords.lat, this.doloresHidalgoCoords.lon],
      12
    );

    // Cargar capas de mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);
  }

  fetchWeather() {
    // Consultar el clima para las coordenadas de Dolores Hidalgo
    this.weatherService
      .getWeatherByCoords(
        this.doloresHidalgoCoords.lat,
        this.doloresHidalgoCoords.lon
      )
      .subscribe((data: any) => {
        this.weatherData = data;

        // Agregar un marcador con información del clima
        const customIcon = L.icon({
          iconUrl: 'https://cdn.jsdelivr.net/npm/@mdi/svg/svg/map-marker.svg',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        L.marker(
          [this.doloresHidalgoCoords.lat, this.doloresHidalgoCoords.lon],
          { icon: customIcon }
        )
          .addTo(this.map)
          .bindPopup(`
            <h3>${data.name}</h3>
            <p>Temperatura: ${data.main.temp}°C</p>
            <p>Clima: ${data.weather[0].description}</p>
          `)
          .openPopup();
      });
  }

  // Cargar ubicaciones turísticas en el mapa
  private loadTouristLocations() {
    this.http.get<any>('/location').subscribe(
      (data) => {
        if (this.map) { // Asegurarse de que el mapa esté inicializado
          data.locations.forEach((location: any) => {
            L.marker([location.lat, location.lon]).addTo(this.map)
              .bindPopup(`<strong>${location.name}</strong><br>Tipo: ${location.type}`);
          });
        }
      },
      (error) => {
        console.error('Error al cargar ubicaciones:', error);
      }
    );
  }

  // Función para redirigir a la vista de detalles de un paquete
  viewPaqueteDetails(paqueteId?: number | string) {
    if (!this.authService.isAuthenticated()) {
        console.error('El usuario no está autenticado');
        this.router.navigate(['/Login/login']);
        return;
    }

    if (paqueteId) {
        this.router.navigate([`/Viajes/paypal/${paqueteId}`]);
    } else {
        console.error('Paquete ID is undefined');
    }
}
  selectOption(option: string) {
    // Añadir el mensaje del usuario (selección de opción) a la lista de mensajes
    this.messages.push({ text: `Seleccionaste: ${option}`, user: true });

    // Preparar el cuerpo de la solicitud
    const requestBody = { query: option };

    // Llamar a la API para obtener la respuesta del chatbot
    this.http.post<any>('https://viajesumback.onrender.com/Paquetes/Paquetes', requestBody)
      .subscribe(
        (response) => {
          // Verificar si la respuesta contiene un mensaje válido y agregarlo a la lista
          const botMessage = response.message || 'Aquí están los paquetes disponibles.';
          this.messages.push({ text: botMessage, user: false });
        },
        (error) => {
          // Manejar errores y notificar al usuario
          console.error('Error al comunicarse con la API:', error);
          this.messages.push({ text: 'Hubo un error procesando tu solicitud. Por favor, inténtalo de nuevo.', user: false });
        }
      );
  }
}