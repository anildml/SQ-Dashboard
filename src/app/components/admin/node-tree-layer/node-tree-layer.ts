import {
  Component,
  input,
  InputSignal, Signal, viewChildren
} from '@angular/core';
import {NodeComponent} from '../node/node';
import {Node} from '../../../models/interfaces/view/node';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {toObservable} from '@angular/core/rxjs-interop';

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
  viewNodeList: Signal<readonly NodeComponent[]> = viewChildren("node");
  viewNodeList_ = toObservable(this.viewNodeList);
  layerIndex: InputSignal<number> = input.required<number>();

}
