import {
  Component, inject,
  Input,
  OnInit,
  QueryList,
  ViewChildren
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
export class NodeTreeComponent implements OnInit {

  nodeTreeService: NodeTreeService = inject(NodeTreeService);

  @Input('rootNode')
  rootNode!: Node

  @ViewChildren("layer")
  layerPanels!: QueryList<MatExpansionPanel>;

  constructor() {

  }

  async ngOnInit(): Promise<void> {
    this.nodeTreeService.initNodeTree(this.rootNode);
  }

  async nodeClicked(id: string) {
    let nodeData: any = this.nodeTreeService.getNodeData(id);

    await this.updateTree(nodeData.layerIndex, nodeData.clickedNode);
  }

  async updateTree(layerIndex: number, lastSelectedNode: Node) {
    if (this.nodeTreeService.isLastLayer(layerIndex)) {
      this.nodeTreeService.addNewLayerToTreePath(lastSelectedNode);
      await this.expandLayer();
    } else {
      let isNewBranch: boolean = this.nodeTreeService.isNewBranch(layerIndex, lastSelectedNode);
      await this.collapseLayers(layerIndex);
      this.nodeTreeService.shortenTreePath(layerIndex);
      if (isNewBranch) {
        this.nodeTreeService.addNewLayerToTreePath(lastSelectedNode);
        await this.expandLayer();
      }
    }
  }

  async expandLayer() {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        this.layerPanels.last.open();
        resolve();
      }, 250); // timeout added for animation
    });
    this.drawLines();
    await firstValueFrom(this.layerPanels.last.afterExpand);
  }

  drawLines() {
    let parentNodeID = this.nodeTreeService.getLayerData(-2)?.selectedNode!?.id;
    let childNodeIDs = this.nodeTreeService.getLayerData(-1)?.nodeList!.map(n => n.id)!;
    let lines: any[] = [];
    for (let childNodeID of childNodeIDs) {
      let parentNode = document.getElementById("node_" + parentNodeID);
      let parentNodeExpandButton = parentNode?.getElementsByClassName("footer__expand_button")?.item(0);
      let childNode = document.getElementById("node_" + childNodeID);
      let childNodeContent = childNode?.getElementsByClassName("container")?.item(0);
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
    let a = this.nodeTreeService.getTreePathLength();
    for (let i = layerIndex + 1; i < a; i++) {
      let layerData = this.nodeTreeService.getLayerData(i - 1);
      linesToRemove = linesToRemove.concat(layerData?.lines);
      let layer = this.layerPanels.get(i)!;
      layersCollapsed.push(firstValueFrom(layer.afterCollapse));
      layersToCollapse.push(layer);
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
