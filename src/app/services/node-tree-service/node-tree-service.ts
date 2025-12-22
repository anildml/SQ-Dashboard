import {EventEmitter, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {Node} from '../../models/interfaces/node';

interface LayerData {
  nodeList: Node[];
  selectedNode?: Node | null;
  lines?: any[];
}

@Injectable({
  providedIn: 'root',
})
export class NodeTreeService {

  rootNode!: Node

  treePath: WritableSignal<LayerData[]> = signal([]);

  expandChildNodeClicked: EventEmitter<string> = new EventEmitter<string>();

  initNodeTree(node: Node) {
    this.rootNode = node;
    this.treePath.update(tp => {
      tp.push({
        nodeList: [this.rootNode],
        selectedNode: null
      });
      return [...tp];
    })
  }

  getNodeData(id: string) {
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

    return {
      layerIndex,
      clickedNode
    };
  }

  growTreePath(lastSelectedNode: Node) {
    this.treePath.update(tp => {
      tp.at(-1)!.selectedNode = lastSelectedNode;
      tp.push({
        nodeList: lastSelectedNode.children ?? [],
        selectedNode: null
      });
      return [...tp];
    });
  }

  shortenTreePath(layerIndex: number) {
    this.treePath.update(tp => {
      tp = tp.slice(0, layerIndex + 1);
      tp.at(-1)!.selectedNode = null;
      return [...tp];
    });
  }

  isNewBranch(layerIndex: number, clickedNode: Node): boolean {
    return !(this.treePath().at(layerIndex)?.selectedNode?.id === clickedNode.id);
  }

  isLastLayer(layerIndex: number): boolean {
    return layerIndex === this.treePath().length - 1;
  }

  addLinesToLayer(lines: any[]) {
    this.treePath.update(tp => {
      tp.at(-2)!.lines = lines;
      return [...tp];
    })
  }

  updateNode(node: Node) {
    let parentnode = this.findParentNode(this.rootNode, node);
    let i = parentnode?.children?.findIndex(c => c.id == node.id) ?? -1;
    parentnode!.children![i] = node;
    this.treePath.update(tp => [...tp]);
  }

  findParentNode(parent: Node, search: Node): (Node | null) {
    for (let child of parent.children!) {
      if (search.id == child.id) {
        return parent;
      }
      let result = this.findParentNode(child, search);
      if (result) {
        return result;
      }
    }
    return null;
  }

}
