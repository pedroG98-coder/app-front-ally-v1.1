import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('accessToken');
    console.log('Verificando acceso al dashboard...');
    console.log('Token encontrado:', token);
    if (token) {
      console.log('Acceso permitido');
      return true; // permitir el acceso si hay un token
    } else {
      console.log('Acceso denegado, redirigiendo a login');
      this.router.navigate(['/login']); // nos regresa al login si no encuentra el token
      return false;
    }
  }
  
}