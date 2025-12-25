import {EventEmitter, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {Operation, UpdateSchema} from "../../models/interfaces/operation";
import {NodeTreeService} from '../node-tree-service/node-tree-service';

@Injectable({
  providedIn: 'root',
})
export class NodeManagementService {

  defineUpdateSchemaMode: WritableSignal<boolean> = signal(false);

  addStateToOperationUpdateSchemaEventEmitter: EventEmitter<any> = new EventEmitter<any>();
  nodeTreeService: NodeTreeService = inject(NodeTreeService);
  
  constructor() {
    this.addStateToOperationUpdateSchemaEventEmitter.subscribe(data => {
      this.switchStateOnOperationUpdateSchema(data);
    });
  }

  switchStateOnOperationUpdateSchema(stateData: any) {
    let operation = {} as Operation;
    let existingUpdateSchema = operation.update_schema_list.find(us => us.node_id === stateData.nodeId);
    let updateSchema: UpdateSchema = existingUpdateSchema ? existingUpdateSchema : {
      node_id: stateData.nodeId,
      node_name: stateData.nodeName,
      effected_states: []
    };
    if (!existingUpdateSchema) {
      operation!.update_schema_list.push(updateSchema);
    }
    let effectedState = updateSchema.effected_states?.find(es => es == stateData.state);
    if (!effectedState) {
      updateSchema.effected_states?.push(stateData.state);
    } else {
      updateSchema.effected_states = updateSchema.effected_states?.filter(es => es != stateData.state);
      if (updateSchema.effected_states?.length == 0) {
        operation!.update_schema_list = operation!.update_schema_list.filter(us => us.node_id != updateSchema.node_id);
      }
    }
  }

}
