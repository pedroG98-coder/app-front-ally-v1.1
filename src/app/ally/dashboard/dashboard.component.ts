import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export default class DashboardComponent {

  tareas: any[] = []; // Arreglo para almacenar las tareas
  currentPage: number = 1; // Página actual
  totalPages: number = 0; // Total de páginas
  taksPerPage: number = 5; // Taks por página
  intervalId: any; // Variable para el intervalo


  constructor(private authService: AuthService) { }


  ngOnInit(): void {
    this.cargarTareas(); // Cargamos las tareas al iniciar el componente
    this.intervalId = setInterval(() => this.actualizarTiempoRestante(), 1000); // Actualizamos cada segundo
  }


  // Limpiamos el intervalo al destruir el componente
  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }



  // Método para cargar las tareas
  private async cargarTareas(page: number = 1) {
    try {
      const response = await this.authService.getTareas(page, this.taksPerPage);
      this.tareas = response.data.results;
      this.totalPages = Math.ceil(response.data.count / this.taksPerPage);

      // Obtenemos tiempo restante para cada tarea
      this.tareas.forEach(tarea => {
        tarea.tiempoRestante = this.calcularTiempoRestante(tarea.fecha_vencimiento);
      });
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
    }
  }



  // Método para calcular el tiempo restante
  private calcularTiempoRestante(fechaVencimiento: string): string {
    const tiempoRestanteEnSegundos = Math.max((new Date(fechaVencimiento).getTime() - new Date().getTime()) / 1000, 0);

    const dias = Math.floor(tiempoRestanteEnSegundos / 86400);
    const horas = Math.floor((tiempoRestanteEnSegundos % 86400) / 3600);
    const minutos = Math.floor((tiempoRestanteEnSegundos % 3600) / 60);
    const segundos = Math.floor(tiempoRestanteEnSegundos % 60);

    return `${dias}d ${horas}h ${minutos}m ${segundos}s`;
  }


  // Método para actualizar el tiempo restante de las tareas
  private actualizarTiempoRestante(): void {
    this.tareas.forEach(tarea => {
      tarea.tiempoRestante = this.calcularTiempoRestante(tarea.fecha_vencimiento);
    });
  }



  // Método para cambiar de página
  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.currentPage = pagina;
      this.cargarTareas(pagina); // Cargar los usuarios de la nueva página
    }
  }



  // Método para convertir prioridad numérica a cadena
  obtenerPrioridadTarea(prioridad: number): string {
    switch (prioridad) {
      case 1:
        return 'Baja';
      case 2:
        return 'Media';
      case 3:
        return 'Alta';
      default:
        return '';
    }
  }
}