import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service'; // Servicio de autenticacion
import { CommonModule } from '@angular/common'; // Módulo común de Angular

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export default class UsuariosComponent implements OnInit {
  usuarios: any[] = []; // Arreglo para almacenar los usuarios
  currentPage: number = 1; // Página actual
  totalPages: number = 0; // Total de páginas
  usersPerPage: number = 5; // Usuarios por página

  constructor(private authService: AuthService) { }


  ngOnInit(): void {
    this.cargarUsuarios(); // Cargamos los usuarios al iniciar el componente
  }

  // Método para cargar los usuarios
  private async cargarUsuarios(page: number = 1) {
    try {
      const response = await this.authService.getUsuarios(page, this.usersPerPage);
      this.usuarios = response.data.results;
      this.totalPages = Math.ceil(response.data.count / this.usersPerPage);
    } catch (error) {
    }
  }

  // Método para cambiar de página
  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPages) {
        this.currentPage = pagina;
        this.cargarUsuarios(pagina); // Cargar los usuarios de la nueva página
    }
}
}
