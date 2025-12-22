import {Component, inject, Input, OnChanges, output, signal, SimpleChanges, WritableSignal} from '@angular/core';
import {Node} from '../../../models/interfaces/node';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {NodeDialogComponent} from '../node-dialog/node-dialog';
import {NodeTreeService} from '../../../services/node-tree-service/node-tree-service';
import {NodeManagementService} from '../../../services/node-management-service/node-management-service';

@Component({
  selector: 'app-node',
  imports: [
    MatIconModule
  ],
  templateUrl: './node.html',
  styleUrl: './node.scss',
})
export class NodeComponent {

  @Input('node')
  node!: Node;

  nodeTreeService: NodeTreeService = inject(NodeTreeService);
  nodeManagementService: NodeManagementService = inject(NodeManagementService);
  dialog: MatDialog = inject(MatDialog);

  constructor() {}

  expandChildNodeClicked() {
    this.nodeTreeService.expandChildNodeClicked.emit(this.node.id);
  }

  openNodeDialog() {
    this.dialog.open(NodeDialogComponent, {
      data: this.node,
      hasBackdrop: false
    });
  }

  clickedOnState(state: string) {
    this.nodeManagementService.addStateToOperationUpdateSchemaEventEmitter.emit({
      state: state,
      nodeId: this.node.id,
      nodeName: this.node.name
    });
  }

  isModeDefineOperationUpdateSchema() {
    return this.nodeManagementService.MODE.defineOperationUpdateSchema;
  }

}
