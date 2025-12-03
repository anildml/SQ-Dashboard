import {Component, Input} from '@angular/core';
import {Node} from '../../../models/interfaces/node';

@Component({
  selector: 'app-node',
  imports: [],
  templateUrl: './node.html',
  styleUrl: './node.scss',
})
export class NodeComponennt {

  @Input('node')
  node!: Node

}
