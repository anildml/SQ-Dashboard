import {Component, inject, Input, output, Output} from '@angular/core';
import {Operation} from '../../../models/interfaces/operation';
import {MatHint, MatInputModule} from '@angular/material/input';
import {NodeManagementService} from '../../../services/node-management-service/node-management-service';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-operation',
  imports: [
    MatInputModule,
    MatHint,
    MatButtonModule
  ],
  templateUrl: './operation.html',
  styleUrl: './operation.scss',
})
export class OperationComponent {

  @Input("operation")
  operation!: Operation;

  saveOperation = output<boolean>();

  finalizeEditOperation(saveValue: boolean) {
    this.saveOperation.emit(saveValue);
  }

}
