import { Component } from '@angular/core'; // crear el componente.
import { Router } from '@angular/router'; // Router para la navegación
import { AuthService } from '../../shared/services/auth.service'; // Servicio de autenticación
import { FormsModule } from '@angular/forms'; // Módulo para manejar formularios en Angular
import { CommonModule } from '@angular/common'; // Módulo común de Angular
import { RouterLink, RouterLinkActive } from '@angular/router'; // Módulos para el enrutamiento
import Swal2 from 'sweetalert2';



// Componente de Angular
@Component({
  selector: 'app-registro',
  standalone: true,
  templateUrl: './registro.component.html',
  imports: [FormsModule, CommonModule, RouterLink, RouterLinkActive],
  styleUrls: ['./registro.component.css']
})



export default class RegistroComponent {
  // Variables para el registrar usuarios (nombre completo, username, email, password, confirm_password)
  public nombreCompleto: string = '';
  public username: string = '';
  public email: string = '';
  public password: string = '';
  public confirmPassword: string = '';
  public errorMessage: string = '';


  // constructor (AuthService para la autenticación y Router para redireccionamiento.)
  constructor(private authService: AuthService, private router: Router) { }


  // Método que se ejecuta cuando se envía el formulario del registro.
  onSubmit() {
    // Crea un objeto con los datos del formulario
    const registroData = {
      email: this.email,
      username: this.username,
      nombre_completo: this.nombreCompleto,
      password: this.password,
      confirm_password: this.confirmPassword,
    };


    // Llamamos al servicio de autenticación para registrar un nuevo usuario
    this.authService.post('/app-land/usuario', registroData)
      .then((response: any) => {
        console.log('Registro exitoso', response);
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        // Si ocurre un error, maneja el error mostrando un mensaje apropiado al usuario
        if (error.response && error.response.data && error.response.data.error) {
          this.errorMessage = error.response.data.error;
            Swal2.fire({
              title: 'Verifica los datos.',
              text: this.errorMessage,
              icon: 'info',
              confirmButtonText: 'Aceptar',
            });
        } else {
          this.errorMessage = 'Error al registrar. Inténtalo más tarde.';
          Swal2.fire({
            title: 'Error',
            text: this.errorMessage,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
      });
  }
}
