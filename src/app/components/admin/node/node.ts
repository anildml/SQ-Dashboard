import {Component, inject, Input, output} from '@angular/core';
import {Node} from '../../../models/interfaces/node';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {NodeDialogComponent} from '../node-dialog/node-dialog';

@Component({
  selector: 'app-node',
  imports: [
    MatIconModule
  ],
  templateUrl: './node.html',
  styleUrl: './node.scss',
})
export class NodeComponent {

  dialog: MatDialog = inject(MatDialog);

  @Input('node')
  node!: Node

  expandChildNodeClick = output<string>();

  expandChildNodeClicked() {
    this.expandChildNodeClick.emit(this.node.id);
  }

  openNodeDialog() {
    this.dialog.open(NodeDialogComponent, {
      data: this.node
    });
  }

}
