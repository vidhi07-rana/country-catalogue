import { Routes } from '@angular/router';
import { CountryDetailComponent } from './country-detail/country-detail.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'country/:name', component: CountryDetailComponent },
];
