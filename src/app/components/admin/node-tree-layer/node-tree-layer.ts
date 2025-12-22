import {Component, Input, OnChanges, output, signal, SimpleChanges, WritableSignal} from '@angular/core';
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

  @Input('nodeList')
  nodeList!: Node[];

}
