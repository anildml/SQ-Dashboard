import { Routes } from '@angular/router';
import {AdminComponent} from '../components/admin/admin';
import {DashboardComponent} from '../components/dashboard/dashboard';

export const routes: Routes = [
  {
    path: "",
    component: AdminComponent
  },
  {
    path: "admin",
    component: AdminComponent
  },
  {
    path: "dashboard",
    component: DashboardComponent
  },
  {
    path: "**",
    redirectTo: ""
  },
];
