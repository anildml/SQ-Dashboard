import {Component, Input, OnInit} from '@angular/core';
import {Node} from '../../../models/interfaces/node';
import {NodeTreeLayerComponennt} from '../node-tree-layer/node-tree-layer';

interface LayerData {
  nodeList: Node[];
  selectedNode?: Node | null;
}

@Component({
  selector: 'app-node-tree',
  imports: [
    NodeTreeLayerComponennt
  ],
  templateUrl: './node-tree.html',
  styleUrl: './node-tree.scss',
})
export class NodeTreeComponent implements OnInit {

  @Input('rootNode')
  rootNode!: Node

  treePath: LayerData[] = [];

  ngOnInit(): void {

    let c0: Node = this.rootNode;
    this.treePath.push({
      nodeList: [c0],
      selectedNode: null
    });
  }

  nodeClicked(id: string) {
    let layerIndex: number = -1;
    let clickedNode!: Node;

    this.treePath.forEach((layer, i) => {
      layer.nodeList.forEach((node, _) => {
        if (node.id === id) {
          clickedNode = node;
          layerIndex = i;
        }
      });
    });

    if (this.isLastLayer(layerIndex)) {
      let layer = this.treePath.at(-1)!;
      layer.selectedNode = clickedNode;
      this.treePath.push({
        nodeList: clickedNode.children ?? [],
        selectedNode: null
      });
    } else {
      this.treePath = this.treePath.slice(0, layerIndex + 1);
      let isClickedNodeActive: boolean = this.isClickedNodeActive(layerIndex, clickedNode);
      this.treePath.at(-1)!.selectedNode = null;
      if (!isClickedNodeActive) {
        this.treePath.push({
          nodeList: clickedNode.children ?? [],
          selectedNode: clickedNode
        });
      }
    }
  }

  isLastLayer(layerIndex: number): boolean {
    return layerIndex === this.treePath.length - 1;
  }

  isClickedNodeActive(layerIndex: number, clickedNode: Node): boolean {
    return this.treePath.at(layerIndex)?.selectedNode?.id === clickedNode.id;
  }

}
