import {Component, inject, input, InputSignal, output} from '@angular/core';
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
export class OperationComponent {

  operation: InputSignal<Operation>= input.required<Operation>();

  nodeManagementService: NodeManagementService = inject(NodeManagementService);

  saveOperation = output<boolean>();

  constructor() {
    this.nodeManagementService.addStateToOperationUpdateSchemaEventEmitter.subscribe(data => {
      this.addState(data);
    });
  }

  finalizeEditOperation(saveValue: boolean) {
    this.saveOperation.emit(saveValue);
  }

  addState(stateData: any) {
    let existingUpdateSchema = this.operation().update_schema_list.find(us => us.node_id === stateData.nodeId);
    let updateSchema: UpdateSchema = existingUpdateSchema ? existingUpdateSchema : {
      node_id: stateData.nodeId,
      node_name: stateData.nodeName,
      effected_states: []
    };
    if (!existingUpdateSchema) {
      this.operation().update_schema_list.push(updateSchema);
    }
    let effectedState = updateSchema.effected_states?.find(es => es == stateData.state);
    if (!effectedState) {
      updateSchema.effected_states?.push(stateData.state);
    } else {
      updateSchema.effected_states = updateSchema.effected_states?.filter(es => es != stateData.state);
      if (updateSchema.effected_states?.length == 0) {
        this.operation().update_schema_list = this.operation().update_schema_list.filter(us => us.node_id != updateSchema.node_id);
      }
    }
  }

}
