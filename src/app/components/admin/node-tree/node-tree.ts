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
      let layer = this.treePath().at(-1)!;
      layer.selectedNode = lastSelectedNode;
      this.treePath.update(tp => {
        tp.push({
          nodeList: lastSelectedNode.children ?? [],
          selectedNode: null
        });
        return tp;
      });
      await firstValueFrom(this.layers.changes);
      console.log("layers changed");
      setTimeout(() => this.layers.last.open(), 250); // timeout added for animation
    } else {
      let layersCollapsed: Promise<any>[] = [];
      let layersToCollapse: MatExpansionPanel[] = [];
      for (let i = layerIndex + 1; i < this.treePath().length; i++) {
        let layer = this.layers.get(i)!;
        layersCollapsed.push(firstValueFrom(layer.afterCollapse.asObservable()));
        layersToCollapse.push(layer);
      }
      layersToCollapse.forEach(layer => layer.close());
      await Promise.all(layersCollapsed).then();
      this.treePath.update(tp => {
        return tp.slice(0, layerIndex + 1);
      });
      let isClickedNodeActive: boolean = this.isClickedNodeActive(layerIndex, lastSelectedNode);
      this.treePath.update(tp => {
        tp.at(-1)!.selectedNode = null;
        return tp;
      })
      this.treePath().at(-1)!.selectedNode = null;
      if (!isClickedNodeActive) {
        this.treePath.update(tp => {
          tp.push({
            nodeList: lastSelectedNode.children ?? [],
            selectedNode: lastSelectedNode
          });
          return tp;
        });
        await firstValueFrom(this.layers.changes);
        setTimeout(() => this.layers.last.open(), 250); // timeout added for animation

      }
    }
  }

  isLastLayer(layerIndex: number): boolean {
    return layerIndex === this.treePath().length - 1;
  }

  isClickedNodeActive(layerIndex: number, clickedNode: Node): boolean {
    return this.treePath().at(layerIndex)?.selectedNode?.id === clickedNode.id;
  }

}
