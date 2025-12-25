import {
  Component, inject,
  Signal, viewChildren
} from '@angular/core';
import {Node} from '../../../models/interfaces/node';
import {NodeTreeLayerComponent} from '../node-tree-layer/node-tree-layer';
import {MatExpansionModule, MatExpansionPanel} from '@angular/material/expansion';
import {firstValueFrom} from 'rxjs';
import {NodeTreeService} from '../../../services/node-tree-service/node-tree-service';

interface LayerData {
  nodeList: Node[];
  selectedNode?: Node | null;
  lines?: any[];
}

@Component({
  selector: 'app-node-tree',
  imports: [
    NodeTreeLayerComponent,
    MatExpansionModule
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

  async updateTree(layerIndex: number, lastSelectedNode: Node) {
    if (this.nodeTreeService.isLastLayer(layerIndex)) {
      this.nodeTreeService.growTreePath(lastSelectedNode);
      await this.expandLayer();
    } else {
      let isNewBranch: boolean = this.nodeTreeService.isNewBranch(layerIndex, lastSelectedNode);
      await this.collapseLayers(layerIndex);
      this.nodeTreeService.shortenTreePath(layerIndex);
      if (isNewBranch) {
        this.nodeTreeService.growTreePath(lastSelectedNode);
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
    this.drawLines();
    await firstValueFrom(this.layerPanels().at(-1)!.afterExpand);
  }

  drawLines() {
    let parentNodeID = this.nodeTreeService.treePath().at(-2)?.selectedNode!?.id;
    let childNodeIDs = this.nodeTreeService.treePath().at(-1)?.nodeList!.map(n => n.id)!;
    let lines: any[] = [];
    for (let childNodeID of childNodeIDs) {
      let parentNode = document.getElementById("node_" + parentNodeID);
      let parentNodeExpandButton = parentNode?.getElementsByClassName("expand_button")?.item(0);

      let childNode = document.getElementById("node_" + childNodeID);
      let childNodeContent = childNode?.getElementsByClassName("node")?.item(0);

      let line = new LeaderLine(LeaderLine.pointAnchor(parentNodeExpandButton), childNodeContent, {
        hide: true,
        path: "fluid",
        startPlug: "square",
        startPlugSize: 2,
        startSocket: "bottom",
        endSocket: "top",
        endPlug: "disc"
      });
      line.show("draw", {duration: 200});
      lines.push(line);
    }
    this.nodeTreeService.addLinesToLayer(lines);
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
    linesToRemove.forEach(async (line) => {
      line.hide("draw", {duration: 200});
      await new Promise(resolve => setTimeout(resolve, 200));
      line.remove();
    });
    layersToCollapse.forEach(layer => layer.close());
    await Promise.all(layersCollapsed).then();
  }

}
