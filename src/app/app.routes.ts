import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FlightDetailsComponent } from './flight-details/flight-details.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' }, 
  { path: 'login', component: LoginComponent },
  { path: 'flight-details', component: FlightDetailsComponent,
    canActivate: [AuthGuard]
   },
  
];
