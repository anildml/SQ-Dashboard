import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-node-tree',
  imports: [],
  templateUrl: './node-tree.html',
  styleUrl: './node-tree.scss',
})
export class NodeTreeComponent {

  @Input('rootNode')
  rootNode!: Node

}
