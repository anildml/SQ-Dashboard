import {
  Component,
  Input,
  OnInit,
  QueryList, signal,
  ViewChildren, WritableSignal
} from '@angular/core';
import {Node} from '../../../models/interfaces/node';
import {NodeTreeLayerComponent} from '../node-tree-layer/node-tree-layer';
import {MatExpansionModule, MatExpansionPanel} from '@angular/material/expansion';
import {firstValueFrom} from 'rxjs';

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

  @Input('rootNode')
  rootNode!: Node

  treePath: WritableSignal<LayerData[]> = signal([]);

  @ViewChildren("layer")
  layers!: QueryList<MatExpansionPanel>;

  constructor() {

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
    this.drawLines();
    await firstValueFrom(this.layers.last.afterExpand);
  }

  drawLines() {
    let parentNodeID = this.treePath().at(-2)?.selectedNode!?.id;
    let childNodeIDs = this.treePath().at(-1)?.nodeList!.map(n => n.id)!;
    let lines: any[] = [];
    for (let childNodeID of childNodeIDs) {
      let parentNode = document.getElementById("node_" + parentNodeID);
      let parentNodeExpandButton = parentNode?.getElementsByClassName("node__expand__child__nodes")?.item(0);
      let childNode = document.getElementById("node_" + childNodeID);
      let childNodeContent = childNode?.getElementsByClassName("node__container__content")?.item(0);
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
    this.treePath.update(tp => {
      tp.at(-2)!.lines = lines;
      return tp;
    });
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
    let linesToRemove: any[] = [];
    for (let i = layerIndex + 1; i < this.treePath().length; i++) {
      let layerData = this.treePath().at(i - 1);
      linesToRemove = linesToRemove.concat(layerData?.lines);
      let layer = this.layers.get(i)!;
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
