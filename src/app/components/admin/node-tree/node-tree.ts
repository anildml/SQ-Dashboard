import {Component, Input, OnInit} from '@angular/core';
import {Node} from '../../../models/interfaces/node';
import {NodeTreeLayerComponennt} from '../node-tree-layer/node-tree-layer';

interface LayerData {
  nodeList: Node[];
  selectedNode: string | null;
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

  ngOnInit_OLD(): void {
//    let c0: Node = this.rootNode;
//    let c1: Node = (c0.children ?? []).at(0) ?? this.rootNode;
//    let c2: Node = (c1.children ?? []).at(0) ?? this.rootNode;
//    let c3: Node = (c2.children ?? []).at(0) ?? this.rootNode;
//
//    this.treePath.push({
//      nodeList: [c0],
//      selectedNode: c1.id
//    });
//
//    this.treePath.push({
//      nodeList: (c0.children ?? []),
//      selectedNode: c2.id
//    });
//
//    this.treePath.push({
//      nodeList: (c1.children ?? []),
//      selectedNode: c3.id
//    });
//
//    this.treePath.push({
//      nodeList: (c2.children ?? []),
//      selectedNode: null
//    });

  }

  ngOnInit(): void {

    let c0: Node = this.rootNode;
    let c1: Node = (c0.children ?? []).at(0) ?? this.rootNode;

    this.treePath.push({
      nodeList: [c0],
      selectedNode: c1.id
    });

    this.treePath.push({
      nodeList: (c0.children ?? []),
      selectedNode: null
    });

  }

  nodeClicked(event: any) {
    console.log(event);
  }

}
