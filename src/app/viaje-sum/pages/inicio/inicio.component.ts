import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet'; // Importar Leaflet
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Paquete } from '../../../auth/pages.adm/Paquetes/Paquete.interface';
import { AuthService } from '../../auth-service/auth-service';
import { OpenWeatherService } from '../clima/clima';
import { switchMap } from 'rxjs';

@Component({
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.css'],
    standalone: false
})
export class InicioComponent implements OnInit {
  query: string = '';
  results: any[] = [];
  searchPerformed: boolean = false;
  paquetes: Paquete[] = [];
  messages: { text: string; user: boolean }[] = [];
  userMessage: string = '';
  weatherData: any;
  city: string = 'Madrid';
  filtrosVisibles = false;
  filtroCostoMin: number | undefined;
  filtroCostoMax: number | undefined;
  filtroValoracion: number | undefined;
  filtroTipo: string | undefined;
  filtroDescuento: number | undefined; // Añadido filtroDescuento
  filtroCategoria: string | undefined;
  tiposDisponibles: string[] = [];  //para almacenar los tipos unicos
  categoriasDisponibles: string[]=[]; //

  private apiKey: string = 'AIzaSyBvNvglP7o-lrZgF-UOsvp6kIuozxowfmc';
  private searchEngineId: string = '5395e56e7b3eb4ab0';
  paquetesFiltrados: Paquete[] | undefined;

  private map: L.Map | undefined; // Declaración de la propiedad map
  private doloresHidalgoCoords = { lat: 21.1579, lon: -100.9343 };
  weatherSubscription: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private weatherService: OpenWeatherService
  ) {}

  ngOnInit() {
    this.initMap();
    this.loadPaquetes();
    this.fetchWeather();
  }

  // Función para cargar los paquetes desde la API
    //Carga los paquetes y ademas extrae los tipos y categorias disponibles
    private loadPaquetes() {
      this.http.get<Paquete[]>('https://viajesumback.onrender.com/Paquetes').subscribe(
          (data) => {
              this.paquetes = data;
              this.paquetesFiltrados = data; // Inicialmente, los paquetes filtrados son todos
              this.extractUniqueTypesAndCategories();
              this.aplicarFiltros(); // Aplicar filtros iniciales (si los hay)
          },
          (error) => {
              console.error('Error al cargar los paquetes:', error);
          }
      );
  }

  // Extrae los tipos y categorias únicos de los paquetes cargados.
  private extractUniqueTypesAndCategories() {
      const tipos = new Set<string>();
      const categorias = new Set<string>();

      this.paquetes.forEach(paquete => {
          if (paquete.tipo) {
              tipos.add(paquete.tipo);
          }
          if(paquete.categoria){
              categorias.add(paquete.categoria);
          }
      });
       // Convertir el Set a un array
      this.tiposDisponibles = Array.from(tipos);
      this.categoriasDisponibles = Array.from(categorias);
  }


  toggleFiltros() {
      this.filtrosVisibles = !this.filtrosVisibles;
  }

aplicarFiltros() {
  this.paquetesFiltrados = this.paquetes.filter(paquete => {
      // Si el filtro es undefined, no se aplica
      if (this.filtroCostoMin !== undefined && paquete.costo < this.filtroCostoMin) return false;
      if (this.filtroCostoMax !== undefined && paquete.costo > this.filtroCostoMax) return false;
      if (this.filtroValoracion !== undefined && (paquete.valoracion === undefined || paquete.valoracion < this.filtroValoracion)) return false; // Comprobacion si es undefined
      if (this.filtroTipo && paquete.tipo !== this.filtroTipo) return false;
      if (this.filtroDescuento !== undefined && (paquete.descuento === undefined || paquete.descuento < this.filtroDescuento)) return false;// Comprobacion si es undefined
      if (this.filtroCategoria && paquete.categoria !== this.filtroCategoria) return false;


      return true; // Si pasa todos los filtros, se incluye
  });
}

limpiarFiltros() {
  this.filtroCostoMin = undefined;
  this.filtroCostoMax = undefined;
  this.filtroValoracion = undefined;
  this.filtroTipo = undefined;
  this.filtroDescuento = undefined;
  this.filtroCategoria = undefined;
  this.aplicarFiltros(); // Volver a aplicar los filtros (que ahora están limpios)
}

  getStars(valoracion: number): string {
    const maxStars = 5;
    const roundedValoracion = Math.round(valoracion); // Redondear al entero más cercano
    let stars = '';
    for (let i = 0; i < maxStars; i++) {
        if (i < roundedValoracion) {
            stars += '★'; // Estrella llena
        } else {
            stars += '☆'; // Estrella vacía
        }
    }
    return stars;
  } 
  private initMap() {
    this.map = L.map('map').setView(
        [this.doloresHidalgoCoords.lat, this.doloresHidalgoCoords.lon],
        12
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(this.map);
}

fetchWeather() {
    this.weatherSubscription = this.weatherService.getWeatherByCoords(this.doloresHidalgoCoords.lat, this.doloresHidalgoCoords.lon)
        .pipe(
            switchMap((data: any) => {
                this.weatherData = data;
                return this.weatherService.getWeatherDescription(data.weather[0].description);
            })
        )
        .subscribe(translatedDescription => {
            const customIcon = L.icon({
                iconUrl: 'https://cdn.jsdelivr.net/npm/@mdi/svg/svg/map-marker.svg',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
            });

            L.marker([this.doloresHidalgoCoords.lat, this.doloresHidalgoCoords.lon], { icon: customIcon })
                .addTo(this.map!)
                .bindPopup(`
                    <h3>${this.weatherData.name}</h3>
                    <p>Temperatura: ${this.weatherData.main.temp}°C</p>
                    <p>Clima: ${translatedDescription}</p>
                `)
                .openPopup();
        });
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
