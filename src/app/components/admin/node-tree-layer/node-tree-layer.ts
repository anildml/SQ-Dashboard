import {Component, Input} from '@angular/core';
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

  @Input('parentNode')
  parentNode!: Node;

}
