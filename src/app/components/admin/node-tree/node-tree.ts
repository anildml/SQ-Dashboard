import {Component, Input, OnInit} from '@angular/core';
import {Node} from '../../../models/interfaces/node';
import {NodeTreeLayerComponennt} from '../node-tree-layer/node-tree-layer';

@Component({
  selector: 'app-node-tree',
  imports: [
    NodeTreeLayerComponennt
  ],
  templateUrl: './node-tree.html',
  styleUrl: './node-tree.scss',
})
export class NodeTreeComponent implements OnInit{

  @Input('rootNode')
  rootNode!: Node

  activeLayerNodes: Node[] = [];

  ngOnInit(): void {
    this.activeLayerNodes.push(this.rootNode);
    let c1: Node = this.rootNode.children.at(0) ?? this.rootNode;
    this.activeLayerNodes.push(c1);

    let c2: Node = c1.children.at(0) ?? this.rootNode;
    this.activeLayerNodes.push(c2);

    let c3: Node = c2.children.at(0) ?? this.rootNode;
    this.activeLayerNodes.push(c3);

  }

}
