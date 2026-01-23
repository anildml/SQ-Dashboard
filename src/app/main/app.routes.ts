import { Routes } from '@angular/router';
import {SessionComponent} from '../components/dashboard/session/session';
import {AdminComponent} from '../components/admin/admin';

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
    component: SessionComponent
  },
  {
    path: "**",
    redirectTo: ""
  },
];
