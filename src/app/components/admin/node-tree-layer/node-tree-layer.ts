import {
  Component,
  input,
  InputSignal
} from '@angular/core';
import {NodeComponent} from '../node/node';
import {Node} from '../../../models/interfaces/node';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-node-tree-layer',
  imports: [
    NodeComponent,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './node-tree-layer.html',
  styleUrl: './node-tree-layer.scss',
})
export class NodeTreeLayerComponent {

  nodeList: InputSignal<Node[]> = input.required<Node[]>()

}
