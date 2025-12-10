import {
  Component,
  Input,
  OnInit,
  QueryList, signal, viewChild,
  ViewChildren, WritableSignal
} from '@angular/core';
import {Node} from '../../../models/interfaces/node';
import {NodeTreeLayerComponent} from '../node-tree-layer/node-tree-layer';
import {MatExpansionModule, MatExpansionPanel} from '@angular/material/expansion';
import {firstValueFrom} from 'rxjs';

interface LayerData {
  nodeList: Node[];
  selectedNode?: Node | null;
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

  @Input('rootNode')
  rootNode!: Node

  treePath: WritableSignal<LayerData[]> = signal([]);

  @ViewChildren("layer")
  layers!: QueryList<MatExpansionPanel>;

  constructor() {

  }

  drawLines(parentNodeID: string, childNodeIDs: string[]) {
    for (let childNodeID of childNodeIDs) {
      let parentNode = document.getElementById("node_" + parentNodeID);
      let childNode = document.getElementById("node_" + childNodeID);
      let line = new LeaderLine(parentNode, childNode, {
        hide: true,
        path: "fluid",
        startPlug: "square",
        startSocket: "bottom",
        endSocket: "top",
        endPlug: "disc"
      });
      line.show("draw", {duration: 200});
    }
  }

  async ngOnInit(): Promise<void> {
    let c0: Node = this.rootNode;
    this.treePath.update(tp => {
      tp.push({
        nodeList: [c0],
        selectedNode: null
      });
      return tp;
    })
  }

  async nodeClicked(id: string) {
    let layerIndex: number = -1;
    let clickedNode!: Node;

    this.treePath().forEach((layer, i) => {
      layer.nodeList.forEach((node, _) => {
        if (node.id === id) {
          clickedNode = node;
          layerIndex = i;
        }
      });
    });

    await this.updateTree(layerIndex, clickedNode);
  }

  async updateTree(layerIndex: number, lastSelectedNode: Node) {
    if (this.isLastLayer(layerIndex)) {
      this.addNewLayerToTreePath(lastSelectedNode);
      await this.waitForViewRender();
      await this.expandLayer();
    } else {
      let isNewBranch: boolean = this.isNewBranch(layerIndex, lastSelectedNode);
      await this.shortenTreePath(layerIndex);
      if (isNewBranch) {
        this.addNewLayerToTreePath(lastSelectedNode);
        await this.expandLayer();
      }
    }
  }

  isLastLayer(layerIndex: number): boolean {
    return layerIndex === this.treePath().length - 1;
  }

  addNewLayerToTreePath(lastSelectedNode: Node) {
    this.treePath.update(tp => {
      tp.at(-1)!.selectedNode = lastSelectedNode;
      tp.push({
        nodeList: lastSelectedNode.children ?? [],
        selectedNode: null
      });
      return tp;
    });
  }

  async waitForViewRender() {
    await firstValueFrom(this.layers.changes);
  }

  async expandLayer() {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        this.layers.last.open();
        resolve();
      }, 250); // timeout added for animation
    });
    await firstValueFrom(this.layers.last.afterExpand);
    let parentNode = this.treePath().at(-2)?.selectedNode?.id!;
    let childNodes = this.treePath().at(-1)?.nodeList?.map(n => n.id)!;
    this.drawLines(parentNode, childNodes);
  }

  isNewBranch(layerIndex: number, clickedNode: Node): boolean {
    return !(this.treePath().at(layerIndex)?.selectedNode?.id === clickedNode.id);
  }

  async shortenTreePath(layerIndex: number) {
    await this.collapseLayers(layerIndex);
    this.treePath.update(tp => {
      tp = tp.slice(0, layerIndex + 1);
      tp.at(-1)!.selectedNode = null;
      return tp;
    });
  }

  async collapseLayers(layerIndex: number) {
    let layersCollapsed: Promise<any>[] = [];
    let layersToCollapse: MatExpansionPanel[] = [];
    for (let i = layerIndex + 1; i < this.treePath().length; i++) {
      let layer = this.layers.get(i)!;
      layersCollapsed.push(firstValueFrom(layer.afterCollapse));
      layersToCollapse.push(layer);
    }
    layersToCollapse.forEach(layer => layer.close());
    await Promise.all(layersCollapsed).then();
  }

}
