import {EventEmitter, Injectable, signal, WritableSignal} from '@angular/core';
import {Node} from '../../models/interfaces/node';
import {toObservable} from '@angular/core/rxjs-interop';

interface LayerData {
  nodeList: Node[];
  selectedNode?: Node | null;
  lines?: LineRef[];
}

interface LineRef {
  line: any;
  startNode: Node;
  endNode: Node;
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

  addNewNodeToTree(node: Node) {
    let parentnodeData = this.findParentNode(this.rootNode, node);
    parentnodeData?.node!.children.push(node);
    this.treePath.update(tp => [...tp]);
  }

  updateNode(node: Node) {
    let parentnodeData = this.findParentNode(this.rootNode, node);
    let i = parentnodeData?.node?.children?.findIndex(c => c.id == node.id) ?? -1;
    parentnodeData!.node!.children![i] = node;
    this.treePath.update(tp => [...tp]);
  }

  removeNodeFromTree(node: Node) {
    let parentnodeData = this.findParentNode(this.rootNode, node);
    parentnodeData!.node!.children! = parentnodeData!.node!.children.filter(n => n.id != node.id);
    this.treePath.update(tp => {
      let parentLayer = tp.at(parentnodeData!.index)!;
      let childLayer = tp.at(parentnodeData!.index + 1)!;
      parentLayer.lines!.find(lineData => lineData.endNode == node)!.line.remove();
      childLayer.nodeList = childLayer.nodeList.filter(n => n != node);
      return [...tp]
    });
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

  drawLinesForLastLayer() {
    let parentNode = this.treePath().at(-2)!.selectedNode!;
    let childNodes = this.treePath().at(-1)?.nodeList!;
    let lines: LineRef[] = [];
    for (let childNode of childNodes) {
      let parentNodeEl = document.getElementById("node_" + parentNode.id);
      let parentNodeExpandButton = parentNodeEl?.getElementsByClassName("expand_button")?.item(0);
      let childNodeEl = document.getElementById("node_" + childNode.id);
      let childNodeContent = childNodeEl?.getElementsByClassName("node")?.item(0);
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
      lines.push({
        line: line,
        startNode: parentNode,
        endNode: childNode
      });
    }
    this.treePath.update(tp => {
      tp.at(-2)!.lines = lines;
      return [...tp];
    });
  }

  isNewBranch(layerIndex: number, clickedNode: Node): boolean {
    return !(this.treePath().at(layerIndex)?.selectedNode?.id === clickedNode.id);
  }

  isLastLayer(layerIndex: number): boolean {
    return layerIndex === this.treePath().length - 1;
  }

  findParentNode(parent: Node, search: Node): ({node: Node, index: number} | null) {
    for (let i = 0; i < parent.children.length; i++) {
      let child = parent.children.at(i)!;
      if (search.id == child.id) {
        return {
          node: parent,
          index: i
        };
      }
      let result = this.findParentNode(child, search);
      if (result) {
        return result;
      }
    }
    return null;
  }

}
