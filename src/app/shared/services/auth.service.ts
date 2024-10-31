import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { Router } from '@angular/router';




/**
 * Servicio de autenticación para gestionar la comunicación con la API relacionada con la autenticación.
 * Utiliza Axios para realizar las peticiones HTTP y gestiona el almacenamiento de tokens.
 */


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api: AxiosInstance;
  private commonAPI: AxiosInstance;
  //private APIUrl = 'http://127.0.0.1:8000'; // URL base de la API (Django)
  private APIUrl = 'https://exquisite-inspiration-production.up.railway.app/'; // URL base de la API (Django)
  //https://exquisite-inspiration-production.up.railway.app/


  constructor(private router: Router) {
    // Creamos instancia de Axios
    this.api = axios.create({
      baseURL: this.APIUrl,
      headers: { 'Content-Type': 'application/json' },
    });

    this.commonAPI = axios.create({
      baseURL: this.APIUrl,
      headers: { 'Content-Type': 'application/json' },
    });



    // Configuramos los interceptores para gestionar autenticación y errores
    this.setupInterceptors();
  }



  /**
     * Configuramos los interceptores para Axios.
     * Se encargan de añadir el token de autorización en las solicitudes
     * y gestionar la renovación del token en caso de recibir un error 401 o 403.
     */

  private setupInterceptors() {
    // Interceptor para añadir el token de autorización
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers['Authorization'] = `JWT ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );


    // Interceptor de respuesta para manejar errores
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          (error.response.status === 401 || error.response.status === 403) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          const newToken = await this.refreshToken();
          if (newToken) {
            originalRequest.headers['Authorization'] = `JWT ${newToken}`;
            return this.api(originalRequest);
          } else {
            this.router.navigate(['/login']); // Redirige a la página de login si es necesario
          }
        }
        return Promise.reject(error);
      }
    );
  }



  /**
   * Obtenemos el token almacenado en localStorage.
   */

  private getToken(): string | null {
    return localStorage.getItem('accessToken');
  }



  /**
   * Refrescamos el token de acceso con el refresh token almacenado.
   */
  private async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const response = await this.commonAPI.post('/app-land/api/token/refresh/', {
          refresh: refreshToken,
        });
        const newAccessToken = response.data.access;
        localStorage.setItem('accessToken', newAccessToken);
        return newAccessToken;
      }
      return null;
    } catch (error) {
      console.error('Error al refrescar el token', error);
      return null;
    }
  }


  /**
   * Obtemos la lista de usuarios desde API.
   */
  public getUsuarios(page: number = 1, limit: number = 5) {
    const offset = (page - 1) * limit;
    return this.api.get(`/app-land/usuario?limit=${limit}&offset=${offset}`);
  }

  /**
     * Obtemos la lista de usuarios desde API.
     */
  public getTareas(page: number = 1, limit: number = 5) {
    const offset = (page - 1) * limit;
    return this.api.get(`/app-land/tarea?limit=${limit}&offset=${offset}`);
  }

  /**
     * Obtemos el tiempo restante desde API.
     */
  public getTiempoRestante(tareaId: number) {
    return this.api.get(`/helpers/get-tiempo-restante/${tareaId}/`);
  }





  /**
   * Métodos para interactuar con la API
   */

  // Realiza la solicitud GET
  public get(endpoint: string, params?: any) {
    return this.api.get(endpoint, { params });
  }
  // Realiza la solicitud POST
  public post(endpoint: string, data: any) {
    return this.api.post(endpoint, data);
  }
  // Realiza la solicitud PUT
  public put(endpoint: string, data: any) {
    return this.api.put(endpoint, data);
  }
  // Realiza la solicitud DELETE
  public delete(endpoint: string) {
    return this.api.delete(endpoint);
  }
}
