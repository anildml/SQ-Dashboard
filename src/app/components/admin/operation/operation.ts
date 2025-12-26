import {Component, inject, input, InputSignal, OnInit, output, signal, WritableSignal} from '@angular/core';
import {Operation, UpdateSchema} from '../../../models/interfaces/operation';
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
export class OperationComponent implements OnInit {

  operation: InputSignal<Operation> = input.required<Operation>();
  operation$: WritableSignal<Operation> = signal({} as Operation);

  nodeManagementService: NodeManagementService = inject(NodeManagementService);

  saveOperation = output<boolean>();
  operationUpdate = output<Operation>();

  constructor() {
    this.nodeManagementService.addStateToOperationUpdateSchemaEventEmitter.subscribe(data => {
      this.addState(data);
    });
  }

  ngOnInit(): void {
    this.operation$.set(this.operation());
  }

  finalizeEditOperation(saveValue: boolean) {
//    this.saveOperation.emit(saveValue);
  }

  addState(stateData: any) {
    let existingUpdateSchema = this.operation$().update_schema_list.find(us => us.node_id === stateData.nodeId);
    let updateSchema: UpdateSchema = existingUpdateSchema ? existingUpdateSchema : {
      node_id: stateData.nodeId,
      node_name: stateData.nodeName,
      effected_states: []
    };
    if (!existingUpdateSchema) {
      this.operation$.update(operation => {
        operation.update_schema_list.push(updateSchema);
        return {...operation};
      });
    }
    let effectedState = updateSchema.effected_states?.find(es => es == stateData.state);
    if (!effectedState) {
      updateSchema.effected_states?.push(stateData.state);
    } else {
      updateSchema.effected_states = updateSchema.effected_states?.filter(es => es != stateData.state);
      if (updateSchema.effected_states?.length == 0) {
        this.operation$.update(operation => {
          operation.update_schema_list = operation.update_schema_list.filter(us => us.node_id != updateSchema.node_id);
          return {...operation};
        });
      }
    }
    this.operationUpdate.emit(this.operation$());
  }

}
