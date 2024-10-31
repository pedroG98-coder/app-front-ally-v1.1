import { Component } from '@angular/core'; // crear el componente.
import { SidebarComponent } from '../sidebar/sidebar.component'; // Importa el componente del sidebar.
import { FooterComponent } from '../footer/footer.component'; // Importa el componente footer.
import { RouterOutlet } from '@angular/router'; // Router para la navegación
import HeaderComponent from '../header/header.component'; // Importa el componente header.


// Componente de Angular
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent,SidebarComponent,FooterComponent,RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export default class LayoutComponent {

}
