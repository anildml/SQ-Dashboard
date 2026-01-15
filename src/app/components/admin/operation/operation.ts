import {Component, inject, input, InputSignal, Signal, viewChild, viewChildren} from '@angular/core';
import {Operation, } from '../../../models/interfaces/view/operation';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {InputComponent} from '../../common/input/input';
import {NodeTreeService} from '../../../services/node-tree-service/node-tree-service';

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
  viewOperationName: Signal<InputComponent | undefined> = viewChild("name");

  nodeTreeService: NodeTreeService = inject(NodeTreeService);

  editName(name: string) {
    this.nodeTreeService.updateOperationName(name);
  }

}
