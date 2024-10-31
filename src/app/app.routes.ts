import { Routes } from '@angular/router';
import { AuthGuard } from './shared/services/auth.guard';
export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./ally/login/login.component'),  // Página de inicio de sesión
        pathMatch: 'full',
    },
    {
        path: 'registro',
        loadComponent: () => import('./ally/registro/registro.component'),  // Página de registro
    },

    {
        path: '',
        loadComponent: () => import('./shared/components/layout/layout.component'),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./ally/dashboard/dashboard.component'),
                canActivate: [AuthGuard]
            },
            {
                path: 'weather',
                loadComponent: () => import('./ally/weather/weather.component'),
                canActivate: [AuthGuard]
            },
            {
                path: 'usuarios',
                loadComponent: () => import('./ally/usuarios/usuarios.component'),
                canActivate: [AuthGuard]
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            }
        ]
    },
    {
        path: '**',
        redirectTo: '',
    }
];
