import {Component, inject, OnDestroy, WritableSignal} from '@angular/core';
import {Node} from '../../../models/interfaces/node';
import {MatIconModule} from "@angular/material/icon";
import {MatDialogContent, MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {OperationComponent} from '../operation/operation';
import {NodeManagementService} from '../../../services/node-management-service/node-management-service';

@Component({
  selector: 'app-node-dialog',
  imports: [
    MatIconModule,
    MatDialogContent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    OperationComponent
  ],
  standalone: true,
  templateUrl: './node-dialog.html',
  styleUrl: './node-dialog.scss'
})
export class NodeDialogComponent {

  dialogRef: MatDialogRef<NodeDialogComponent> = inject(MatDialogRef<NodeDialogComponent>);
  node: Node = inject(MAT_DIALOG_DATA);
  nodeManagementService: NodeManagementService = inject(NodeManagementService);

  constructor() {
    this.nodeManagementService.initContext(this.node, this.dialogRef);
  }

  finalizeEditNode(saveValue: boolean) {
    this.nodeManagementService.finalizeEditNode(saveValue);
    this.dialogRef.close();
  }

  enterEditNameMode() {
    this.nodeManagementService.enterEditNameMode();
  }

  finalizeEditName(saveValue: boolean, val: any) {
    this.nodeManagementService.finalizeEditName(saveValue, val.value);
  }





  enterAddOperationMode() {
    this.nodeManagementService.enterAddOperationMode();
  }

  operationNameFinalized(val: any) {
    this.nodeManagementService.enterDefineOperationTemplateMode(val.value);
  }

  saveOperation(saveValue: boolean) {
    this.nodeManagementService.finalizeDefineOperationUpdateSchema(saveValue);
  }




  enterAddStateMode() {
    this.nodeManagementService.enterAddStateMode()
  }

  addState(val: any) {
    this.nodeManagementService.saveState(val.value);
  }

  removeOperation(index: number) {
    this.nodeManagementService.removeOperation(index);
  }

  removeState(index: number) {
    this.nodeManagementService.removeState(index);
  }

}
