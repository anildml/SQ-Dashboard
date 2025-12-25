import {Component, inject, input, Input, InputSignal, output, Output} from '@angular/core';
import {Operation} from '../../../models/interfaces/operation';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {InputComponent} from '../../common/input/input';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-operation',
  imports: [
    MatInputModule,
    MatButtonModule,
    InputComponent,
    MatDialogModule
  ],
  templateUrl: './operation.html',
  styleUrl: './operation.scss',
})
export class OperationComponent {

  dialogRef: MatDialogRef<OperationComponent> = inject(MatDialogRef<OperationComponent>);
  operation: InputSignal<Operation | undefined>= input<Operation>();

  saveOperation = output<boolean>();

  finalizeEditOperation(saveValue: boolean) {
    this.saveOperation.emit(saveValue);
  }

}
