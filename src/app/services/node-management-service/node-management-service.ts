import {EventEmitter, Injectable, signal, WritableSignal} from '@angular/core';
import {Operation, UpdateSchema} from "../../models/interfaces/operation";
import {Node} from '../../models/interfaces/node';
import {toObservable} from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class NodeManagementService {

  // states for create/update operation dialog
  operationToEdit: WritableSignal<Operation | null> = signal(null);
  operationToEdit_ = toObservable(this.operationToEdit);
  addStateToOperationUpdateSchemaEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.addStateToOperationUpdateSchemaEventEmitter.subscribe(data => {
      this.addStateToOperationUpdateSchema(data);
    });
  }

  finalizeUpdateOperation(saveValue: boolean) {
    if (saveValue) {

    }
    this.operationToEdit.set(null);
  }

  createNode(node: Node) {

  }

  updateNode(node: Node) {

  }

  deleteNode(node: Node) {

  }

  addStateToOperationUpdateSchema(stateData: any) {
    let operation = this.operationToEdit()!;
    let existingUpdateSchema = operation.update_schema_list.find(us => us.node_id === stateData.nodeId);
    let updateSchema: UpdateSchema = existingUpdateSchema ? existingUpdateSchema : {
      node_id: stateData.nodeId,
      node_name: stateData.nodeName,
      effected_states: []
    };
    if (!existingUpdateSchema) {
      operation.update_schema_list.push(updateSchema);
    }
    let effectedState = updateSchema.effected_states?.find(es => es == stateData.state);
    if (!effectedState) {
      updateSchema.effected_states?.push(stateData.state);
    } else {
      updateSchema.effected_states = updateSchema.effected_states?.filter(es => es != stateData.state);
      if (updateSchema.effected_states?.length == 0) {
        operation.update_schema_list = operation.update_schema_list.filter(us => us.node_id != updateSchema.node_id);
      }
    }
    this.operationToEdit.set({...operation});
  }

}
