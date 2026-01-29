import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {DatePipe} from '@angular/common';
import {NavbarComponent} from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [
    DatePipe
  ]
})
export class App {

  protected readonly title = signal('SQ Dashboard');

}
