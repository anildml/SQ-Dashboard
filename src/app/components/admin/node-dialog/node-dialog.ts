import {Component, OnInit, inject} from '@angular/core';
import {Node} from '../../../models/interfaces/node';
import {MatIconModule} from "@angular/material/icon";
import {MatDialogContent, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';
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
    MatButtonModule
  ],
  standalone: true,
  templateUrl: './node-dialog.html',
  styleUrl: './node-dialog.scss',
})
export class NodeDialogComponent implements OnInit {

  node: Node = inject(MAT_DIALOG_DATA);
  nodePreviousVersion!: Node;

  isEditName: boolean = false;

  constructor() {

  }

  ngOnInit(): void {
    this.nodePreviousVersion = Object.assign(this.node, this.nodePreviousVersion);
    this.nodePreviousVersion = Object.assign(this.node, this.nodePreviousVersion);
  }

  addOperation() {

  }

  addState() {

  }

  removeOperation() {

  }

  removeState() {

  }

}
