import {
  Component, inject,
  Signal, viewChildren
} from '@angular/core';
import {Node} from '../../../models/interfaces/node';
import {NodeTreeLayerComponent} from '../node-tree-layer/node-tree-layer';
import {MatExpansionModule, MatExpansionPanel} from '@angular/material/expansion';
import {firstValueFrom} from 'rxjs';
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

  nodeTreeService: NodeTreeService = inject(NodeTreeService);

  constructor() {
    this.nodeTreeService.expandChildNodeClicked.subscribe(nodeId => {
      this.nodeClicked(nodeId);
    });
  }

  async nodeClicked(id: string) {
    let nodeData: any = this.nodeTreeService.getNodeData(id);
    await this.updateTree(nodeData.layerIndex, nodeData.clickedNode);
  }

  async updateTree(layerIndex: number, clickedNode: Node) {
    if (this.nodeTreeService.isLastLayer(layerIndex)) {
      this.nodeTreeService.growTreePath(clickedNode);
      await this.expandLayer();
    } else {
      let isNewBranch: boolean = this.nodeTreeService.isNewBranch(layerIndex, clickedNode);
      await this.collapseLayers(layerIndex);
      this.nodeTreeService.shortenTreePath(layerIndex);
      if (isNewBranch) {
        this.nodeTreeService.growTreePath(clickedNode);
        await this.expandLayer();
      }
    }
  }

  async expandLayer() {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        this.layerPanels().at(-1)!.open();
        resolve();
      }, 250); // timeout added for animation
    });
    this.nodeTreeService.drawLinesForLastLayer();
    await firstValueFrom(this.layerPanels().at(-1)!.afterExpand);
  }

  async collapseLayers(layerIndex: number) {
    let layersCollapsed: Promise<any>[] = [];
    let layersToCollapse: MatExpansionPanel[] = [];
    let linesToRemove: any[] = [];
    for (let i = layerIndex + 1; i < this.nodeTreeService.treePath().length; i++) {
      let layerData = this.nodeTreeService.treePath().at(i - 1);
      linesToRemove = linesToRemove.concat(layerData?.lines);
      let layerPanel = this.layerPanels().at(i)!;
      layersCollapsed.push(firstValueFrom(layerPanel.afterCollapse));
      layersToCollapse.push(layerPanel);
    }
    linesToRemove.forEach(async (lineData) => {
      lineData.line.hide("draw", {duration: 200});
      await new Promise(resolve => setTimeout(resolve, 200));
      lineData.line.remove();
    });
    layersToCollapse.forEach(layer => layer.close());
    await Promise.all(layersCollapsed).then();
  }

  finalizeEditOperation(saveValue: boolean) {
    this.nodeTreeService.finalizeUpdateOperation(saveValue);
  }

}
