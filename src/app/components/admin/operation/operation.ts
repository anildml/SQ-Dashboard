import {Component, inject, input, InputSignal} from '@angular/core';
import {Operation, } from '../../../models/interfaces/operation';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {InputComponent} from '../../common/input/input';
import {NodeManagementService} from '../../../services/node-management-service/node-management-service';

@Component({
  selector: 'app-operation',
  imports: [
    MatInputModule,
    MatButtonModule,
    InputComponent
  ],
  templateUrl: './operation.html',
  styleUrl: './operation.scss',
})
export class OperationComponent {

  operation: InputSignal<Operation> = input.required<Operation>();

  nodeManagementService: NodeManagementService = inject(NodeManagementService);

  editName(name: string) {
    this.nodeManagementService.updateOperationName(name);
  }

}
