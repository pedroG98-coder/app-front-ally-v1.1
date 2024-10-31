import { Component } from '@angular/core'; // crear el componente.
import { RouterLink, RouterLinkActive } from '@angular/router'; // Módulos para el enrutamiento



// Componente de Angular
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

}
