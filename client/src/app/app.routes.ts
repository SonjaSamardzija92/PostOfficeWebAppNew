import { Routes } from '@angular/router';
import { LoginPageComponent } from './components/auth/login-page/login-page.component';
import { RegistrationComponent } from './components/auth/registration/registration.component';
import { HomePage } from './components/home-pages/home/home.component';
import { HomePostOfficeComponent } from './components/home-pages/home-post-office/home-post-office.component';
import { PostOfficeFormComponent } from './components/post-office/post-office-form/post-office-form.component';
import { PostOfficeListComponent } from './components/post-office/post-office-list/post-office-list.component';
import { ShipmentFormComponent } from './components/shipment/shipment-form/shipment-form.component';
import { ShipmentListComponent } from './components/shipment/shipment-list/shipment-list.component';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegistrationComponent },
    { path: 'home', component: HomePostOfficeComponent },
    { path: 'postOffice/create', component: PostOfficeFormComponent },
    { path: 'postOffices', component: PostOfficeListComponent },
    { path: 'postOffices/:zipCode/edit', component: PostOfficeFormComponent },
    { path: 'shipment/create', component: ShipmentFormComponent },
    { path: 'shipments', component: ShipmentListComponent },
    { path: 'shipments/:shipmentNumber/edit', component: ShipmentListComponent },
];
