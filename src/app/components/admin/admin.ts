import {Component, inject} from '@angular/core';
import {Node} from '../../models/interfaces/node';
import {NodeTreeComponent} from './node-tree/node-tree';
import {NodeTreeService} from '../../services/node-tree-service/node-tree-service';

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
