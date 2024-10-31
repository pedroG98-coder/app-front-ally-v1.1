import { Component } from '@angular/core'; // crear el componente.
import { Router } from '@angular/router'; // Router para la navegación



// Componente de Angular
@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})


export default class HeaderComponent {


  // constructor (Router para redireccionamiento.)
  constructor(private router: Router) { }


  /**
   * Método para cerrar sesión del usuario.
   * Este método elimina los tokens de acceso y actualización del almacenamiento local
   * y redirige al usuario a la página de inicio de sesión.
   */

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }
}
