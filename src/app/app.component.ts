import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FlightDetailsComponent } from './flight-details/flight-details.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FlightDetailsComponent, RouterModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'mrgInterview';
}
