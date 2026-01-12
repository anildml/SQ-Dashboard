import {Component} from '@angular/core';
import {NodeTreeComponent} from './node-tree/node-tree';

@Component({
  selector: 'app-admin',
  imports: [
    NodeTreeComponent
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AdminComponent {

}
