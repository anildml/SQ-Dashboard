import {
  Component, inject,
  input,
  InputSignal, Signal, viewChildren
} from '@angular/core';
import {NodeComponent} from '../node/node';
import {Node} from '../../../models/interfaces/api/node';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {NodeTreeService} from '../../../services/node-tree-service/node-tree-service';

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

  nodeList: InputSignal<Node[]> = input.required<Node[]>();
  viewNodeList: Signal<readonly NodeComponent[]> = viewChildren("node");
  layerIndex: InputSignal<number> = input.required<number>();
  nodeTreeService: NodeTreeService = inject(NodeTreeService);

  layerScrolled() {
    this.nodeTreeService.refreshLines_.emit();
  }

}
