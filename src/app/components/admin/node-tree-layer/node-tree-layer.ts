import {
  Component, inject,
  input,
  InputSignal, Signal, viewChildren
} from '@angular/core';
import {NodeComponent} from '../node/node';
import {Node} from '../../../models/interfaces/node';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {NodeManagementService} from '../../../services/node-management-service/node-management-service';
import {toObservable} from '@angular/core/rxjs-interop';
import {firstValueFrom, skip} from 'rxjs';

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
  nodeManagementService: NodeManagementService = inject(NodeManagementService);

  async initDefineNewNode() {
    this.nodeManagementService.initDefineNewNode(this.layerIndex());
    await firstValueFrom(this.viewNodeList_.pipe(skip(1)));
    this.viewNodeList().at(-1)?.viewNodeName()?._enterEditMode();
  }

}
