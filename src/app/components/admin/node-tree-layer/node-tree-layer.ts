import {Component, Input, output} from '@angular/core';
import {NodeComponent} from '../node/node';
import {Node} from '../../../models/interfaces/node';

@Component({
  selector: 'app-node-tree-layer',
  imports: [
    NodeComponent
  ],
  templateUrl: './node-tree-layer.html',
  styleUrl: './node-tree-layer.scss',
})
export class NodeTreeLayerComponent {

  @Input('nodeList')
  nodeList!: Node[];

  expandChildNodeClick = output<string>();

  @Input('isLastLayer')
  isLastLayer!: boolean;

  expandChildNodeClicked(id: string) {
    this.expandChildNodeClick.emit(id);
  }

}
