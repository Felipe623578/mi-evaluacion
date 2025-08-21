import { Routes } from '@angular/router';
import { RegistroComponent } from './pages/registro/registro-persona.component';
import { HomeComponent } from './pages/home/home.component';
import { ApiTestComponent } from './components/api-test/api-test.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home'
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home'
  },
  {
    path: 'registro',
    component: RegistroComponent,
    title: 'Registro'
  },
  {
    path: 'api-test',
    component: ApiTestComponent,
    title: 'API Test'
  },
  {
    path: '**',
    redirectTo: ''
  }
];



