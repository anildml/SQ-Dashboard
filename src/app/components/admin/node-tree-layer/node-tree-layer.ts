import {Component, Input, output} from '@angular/core';
import {NodeComponennt} from '../node/node';
import {Node} from '../../../models/interfaces/node';

@Component({
  selector: 'app-node-tree-layer',
  imports: [
    NodeComponennt
  ],
  templateUrl: './node-tree-layer.html',
  styleUrl: './node-tree-layer.scss',
})
export class NodeTreeLayerComponennt {

  @Input('nodeList')
  nodeList!: Node[];

  expandChildNodeClick = output<string>();

  expandChildNodeClicked(id: string) {
    this.expandChildNodeClick.emit(id);
  }

}
