import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {

  router: Router = inject(Router);

  protected async toDashboard() {
    await this.router.navigate(['/dashboard']);
  }

  protected async toAdminPage() {
    await this.router.navigate(['/admin']);
  }

}
