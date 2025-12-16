import {Component, inject} from '@angular/core';
import {Node} from '../../../models/interfaces/node';
import {MatIconModule} from "@angular/material/icon";
import {MatDialogContent, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

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
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './node-dialog.html',
  styleUrl: './node-dialog.scss'
})
export class NodeDialogComponent {

  node: Node = inject(MAT_DIALOG_DATA);
  updatedVersion!: Node;

  isEditName: boolean = false;
  isAddingState: boolean = false;

  constructor() {
    this.updatedVersion = JSON.parse(JSON.stringify(this.node));
  }

  enterEditNameMode() {
    this.isEditName = true;
  }

  exitEditNameMode(saveValue: boolean) {
    this.isEditName = false;
    if (!saveValue) {
      this.updatedVersion.name = this.node.name;
    }
  }

  enterEditStateMode() {
    this.isAddingState = true;
  }

  addOperation() {

  }

  addState(val: any) {
    this.isAddingState = false;
    this.updatedVersion.state_list?.push(val.value);
  }

  removeOperation(index: number) {
    this.updatedVersion.operation_list = this.updatedVersion.operation_list.filter((el, i) => i != index);
  }

  removeState(index: number) {
    this.updatedVersion.state_list = this.updatedVersion.state_list.filter((el, i) => i != index);
  }

}
