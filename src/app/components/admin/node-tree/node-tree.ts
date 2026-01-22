import {
  ChangeDetectorRef,
  Component, inject,
  Signal, viewChild, viewChildren
} from '@angular/core';
import {NodeTreeLayerComponent} from '../node-tree-layer/node-tree-layer';
import {MatExpansionModule, MatExpansionPanel} from '@angular/material/expansion';
import {NodeTreeService} from '../../../services/node-tree-service/node-tree-service';
import {OperationComponent} from '../operation/operation';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-node-tree',
  imports: [
    NodeTreeLayerComponent,
    MatExpansionModule,
    MatButtonModule,
    OperationComponent
  ],
  templateUrl: './node-tree.html',
  styleUrl: './node-tree.scss',
})
export class NodeTreeComponent {

  layerPanels: Signal<readonly MatExpansionPanel[]> = viewChildren("layer");
  viewTreeLayers: Signal<readonly NodeTreeLayerComponent[]> = viewChildren("nodeTreeLayer");
  viewOperationDialog: Signal<OperationComponent | undefined> = viewChild("operationDialog");

  nodeTreeService: NodeTreeService = inject(NodeTreeService);
  changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  constructor() {
    this.nodeTreeService.viewTreePath = this.viewTreeLayers;
    this.nodeTreeService.viewTreePathLayerPanels = this.layerPanels;
    this.nodeTreeService.viewOperationDialog = this.viewOperationDialog;
    this.nodeTreeService.nodeTreeChangeDetectorRef = this.changeDetectorRef;
  }

  async finalizeEditOperation(saveValue: boolean) {
    await this.nodeTreeService.finalizeUpdateOperation(saveValue);
  }

}
