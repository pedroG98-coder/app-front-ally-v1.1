import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core'; // Importación de dependencias necesarias para crear el componente y manipular el DOM.
import { WeatherService } from '../../shared/services/weather.service'; // Servicio de Weather
import { CommonModule } from '@angular/common'; // Módulo común de Angular




// Componente de Angular
@Component({
  selector: 'app-weather',
  standalone: true,
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
  imports: [CommonModule] // Agregar esta línea
})




export default class WeatherComponent implements OnInit {
  location: string = 'Mexico'; // Localización por defecto
  weatherData: any; // Almacena los datos del clima obtenidos desde la API.


  // Lista de países disponibles
  availableCountries: string[] = ['Mexico', 'France', 'Colombia', 'Canada'];
  selectedCountry: string = 'Mexico';
  tasks: string[] = []; // Lista de tareas (almacenadas en LocalStorage)




  /**
   * Estructura de zonas horarias disponibles por país.
   * Cada país contiene una lista de zonas horarias y la URL de su bandera.
   */
  timeZones: { [key: string]: { zones: string[], flag: string } } = {
    Mexico: {
      zones: ['America/Mexico_City', 'America/Tijuana', 'America/Monterrey', 'America/Merida', 'America/Cancun', 'America/Chihuahua', 'America/Matamoros', 'America/Hermosillo'],
      flag: 'https://flagcdn.com/w320/mx.png'
    },
    France: {
      zones: ['Europe/Paris', 'Europe/Marseille', 'Europe/Lyon', 'Europe/Toulouse', 'Europe/Strasbourg'],
      flag: 'https://flagcdn.com/w320/fr.png'
    },
    Colombia: {
      zones: ['America/Bogota'],
      flag: 'https://flagcdn.com/w320/co.png'
    },
    Canada: {
      zones: ['America/Toronto', 'America/Vancouver', 'America/Calgary', 'America/Winnipeg', 'America/Moncton'],
      flag: 'https://flagcdn.com/w320/ca.png'
    },
    USA: {
      zones: ['America/Los_Angeles', 'America/Denver', 'America/New_York', 'America/Chicago', 'America/Anchorage'],
      flag: 'https://flagcdn.com/w320/us.png'
    },
  };

  selectedTimeZone: string = 'America/Mexico_City'; // Zona horaria seleccionada por defecto.
  availableTimeZones: { timeZone: string, flag: string }[] = []; // Arreglo que almacena las zonas horarias disponibles según el país seleccionado.


  constructor(private weatherService: WeatherService, private el: ElementRef, private renderer: Renderer2) { }




  /**
   * Inicializa el componente al cargarse.
   * Obtiene los datos del clima y las tareas almacenadas.
   */

  ngOnInit() {
    this.fetchWeather(); // Obtiene los datos del clima.
    this.loadTasks(); // Carga las tareas desde LocalStorage.
    this.setupModalHandlers(); // Configura los eventos del modal para agregar tareas.
  }




  /**
   * Metodo asincrono para Obtener los datos del clima desde el servicio WeatherService para el país seleccionado.
   */
  async fetchWeather() {
    try {
      this.weatherData = await this.weatherService.getWeather(this.selectedCountry);
    } catch (error) {
      console.error('Error al obtener los datos del clima:', error);
    }
  }




  /**
   * Metodo para actualizar la zona horaria seleccionada y actualiza la hora local.
   */
  onTimeZoneChange(timeZone: string) {
    this.selectedTimeZone = timeZone;
    this.updateLocalTime(); // Actualiza la hora local según la zona horaria seleccionada.
  }





  /**
   * Metodo para formatear la hora de la zona horaria seleccionada.
   */
  updateLocalTime() {
    const update = () => {
        const localTime = new Date().toLocaleString('en-US', { timeZone: this.selectedTimeZone });
        this.weatherData.location.localtime = localTime;
    };

    // Llamamos la función una vez para establecer el tiempo inicial
    update();

    // Configuramos un intervalo para actualizar cada segundo
    setInterval(update, 1000);
}




  /**
   * Metodo para cambiar el país seleccionado y actualiza las zonas horarias disponibles.
   */
  onCountryChange(country: string) {
    this.selectedCountry = country;
    this.availableTimeZones = this.timeZones[country].zones.map(zone => ({
      timeZone: zone,
      flag: this.timeZones[country].flag
    }));
    this.fetchWeather(); // Obtiene los datos del clima para el nuevo país.
  }





  /**
   * Configura los eventos para abrir y cerrar el modal de tareas y para guardar una nueva tarea.
   */
  setupModalHandlers() {
    const openModalBtn = this.el.nativeElement.querySelector('#openTaskModalBtn');
    const closeModalBtn = this.el.nativeElement.querySelector('#closeTaskModalBtn');
    const saveTaskBtn = this.el.nativeElement.querySelector('#saveTaskBtn');
    const taskModal = this.el.nativeElement.querySelector('#taskModal');

    // Mostrar el modal
    this.renderer.listen(openModalBtn, 'click', () => {
      this.renderer.removeClass(taskModal, 'hidden');
    });

    // Cerrar el modal
    this.renderer.listen(closeModalBtn, 'click', () => {
      this.renderer.addClass(taskModal, 'hidden');
    });

    // Guardar la tarea
    this.renderer.listen(saveTaskBtn, 'click', () => {
      const taskInput = this.el.nativeElement.querySelector('#taskInput').value.trim();
      if (taskInput) {
        this.addTask(taskInput); // Añade la tarea a la lista
      }
      this.renderer.addClass(taskModal, 'hidden'); // Oculta el modal después de guardar.
    });
  }



  /**
   * Metodo para Agregar una tarea a la lista  y la guarda en LocalStorage.
   */
  addTask(task: string) {
    const taskList = this.el.nativeElement.querySelector('#taskList');

    // Creamos un nuevo elemento de lista
    const taskItem = this.renderer.createElement('li');
    const text = this.renderer.createText(task);

    this.renderer.appendChild(taskItem, text);
    this.renderer.appendChild(taskList, taskItem);

    // Guardamos la tarea en el array y en LocalStorage
    this.tasks.push(task);
    this.saveTasks();

    // Limpiamos la caja de texto
    const taskInput = this.el.nativeElement.querySelector('#taskInput');
    this.renderer.setProperty(taskInput, 'value', '');
  }



  /**
   * Guardamos las tareas en LocalStorage.
   */
  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }





  /**
   * Metodo para carga las tareas desde LocalStorage y las pintamos en el DOM.
   */
  loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);

      // Pintamos las tareas almacenadas
      const taskList = this.el.nativeElement.querySelector('#taskList');
      this.tasks.forEach((task: string) => {
        const taskItem = this.renderer.createElement('li');
        const text = this.renderer.createText(task);
        this.renderer.appendChild(taskItem, text);
        this.renderer.appendChild(taskList, taskItem);
      });
    }
  }




  /**
   * Metodo para limpiar todas las tareas de la lista y del DOM.
   */
  clearTasks() {
    this.tasks = [];
    localStorage.removeItem('tasks'); // Elimina las tareas de LocalStorage.
    // Limpia los elementos del DOM.
    const taskList = this.el.nativeElement.querySelector('#taskList');
    while (taskList.firstChild) {
      this.renderer.removeChild(taskList, taskList.firstChild);
    }
  }




  /**
   * Formateamos la hora en un formato  AM/PM.
   */
  formatTime(localtime: string): string {
    const date = new Date(localtime);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${formattedHours}:${formattedMinutes} ${period}`;
  }
}
