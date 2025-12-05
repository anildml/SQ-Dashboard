import {Component, Input, output} from '@angular/core';
import {Node} from '../../../models/interfaces/node';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-node',
  imports: [
    MatIconModule
  ],
  templateUrl: './node.html',
  styleUrl: './node.scss',
})
export class NodeComponennt {

  @Input('node')
  node!: Node

  expandChildNodeClick = output<string>();

  expandChildNodes() {
    this.expandChildNodeClick.emit(this.node.id);
  }

}
