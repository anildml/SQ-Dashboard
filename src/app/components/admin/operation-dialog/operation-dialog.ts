import {Component, inject, input, InputSignal, WritableSignal} from '@angular/core';
import {Operation} from '../../../models/interfaces/operation';
import {MatDialogModule, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {OperationComponent} from '../operation/operation';
import {MatButtonModule} from '@angular/material/button';
import {InputComponent} from '../../common/input/input';

@Component({
  selector: 'app-operation-dialog',
  imports: [
    MatDialogModule,
    OperationComponent,
    MatButtonModule,
    InputComponent
  ],
  templateUrl: './operation-dialog.html',
  styleUrl: './operation-dialog.scss',
})
export class OperationDialogComponent {

  operation = inject(MAT_DIALOG_DATA);

  finalizeEditOperation(saveValue: boolean) {
    console.log(this.operation);
  }

}
