import {EventEmitter, inject, Injectable, OnDestroy, signal, WritableSignal} from '@angular/core';
import {Node} from '../../models/interfaces/node';
import {Operation, UpdateSchema} from "../../models/interfaces/operation";
import {MatDialogRef} from '@angular/material/dialog';
import {NodeDialogComponent} from '../../components/admin/node-dialog/node-dialog';
import {NodeTreeService} from '../node-tree-service/node-tree-service';

@Injectable({
  providedIn: 'root',
})
export class NodeManagementService implements OnDestroy {

  nodePreviousValue: Node | null = null;
  node: WritableSignal<Node | null> = signal(null);
  operation: WritableSignal<Operation | null> = signal(null);

  MODE = {
    editNode: signal(false),
    editName: signal(false),
    editOperation: signal(false),
    editState: signal(false),
    addState: signal(false),
    addOperation: signal(false),
    defineOperationUpdateSchema: signal(false)
  };

  addStateToOperationUpdateSchemaEventEmitter: EventEmitter<any> = new EventEmitter<any>();
  nodeTreeService: NodeTreeService = inject(NodeTreeService);
  dialogRef: MatDialogRef<NodeDialogComponent> | null = null;

  





  ngOnDestroy(): void {
    // symbolic call
    // in case of life cycle changes in the future, don't forget to destroy context when required
    this.destroyContext();
  }

  initContext(node: Node, dialogRef: MatDialogRef<NodeDialogComponent>) {
    this.addStateToOperationUpdateSchemaEventEmitter.subscribe(data => {
      this.switchStateOnOperationUpdateSchema(data);
    });
    this.nodePreviousValue = node;
    this.node.set(JSON.parse(JSON.stringify(node)));
    this.dialogRef = dialogRef;
    this.MODE.editNode.set(true);
  }

  destroyContext() {
    this.nodePreviousValue = null;
    this.node.set(null);
    this.operation.set(null);
    this.dialogRef = null;
    this.MODE.editNode.set(false);
    this.MODE.editName.set(false);
    this.MODE.editOperation.set(false);
    this.MODE.editState.set(false);
    this.MODE.addOperation.set(false);
    this.MODE.addState.set(false);
    this.MODE.defineOperationUpdateSchema.set(false);
  }

  finalizeEditNode(saveValue: boolean) {
    if (saveValue) {
      this.nodeTreeService.updateNode(this.node()!);
    }
  }

  enterEditNameMode() {
    this.MODE.editName.set(true);
  }

  finalizeEditName(saveValue: boolean, newValue: string) {
    if (saveValue) {
      this.node!.update((data) => {
        data!.name = newValue;
        return {...data!};
      });
    }
    this.MODE.editName.set(false);
  }

  // later
  enterEditOperationMode(operation: Operation) {
    this.operation.set(JSON.parse(JSON.stringify(operation)));
    this.MODE.editOperation.set(true);
  }

  // later
  finalizeEditOperation(saveValue: boolean, value: Operation) {
    if (saveValue) {
      // save node here
    }
    this.operation.set(null);
    this.MODE.editOperation.set(false);
  }

  enterAddOperationMode() {
    this.MODE.addOperation.set(true);
  }

  enterDefineOperationTemplateMode(operationName: string) {
    this.dialogRef!.updatePosition({
      bottom: "10px"
    });
    this.operation.set({
      id: "",
      name: operationName,
      update_schema_list: []
    });
    this.MODE.defineOperationUpdateSchema.set(true);
  }

  switchStateOnOperationUpdateSchema(stateData: any) {
    let existingUpdateSchema = this.operation()!.update_schema_list.find(us => us.node_id === stateData.nodeId);
    let updateSchema: UpdateSchema = existingUpdateSchema ? existingUpdateSchema : {
      node_id: stateData.nodeId,
      node_name: stateData.nodeName,
      effected_states: []
    };
    this.operation.update(data => {
      if (!existingUpdateSchema) {
        data!.update_schema_list.push(updateSchema);
      }
      let effectedState = updateSchema.effected_states?.find(es => es == stateData.state);
      if (!effectedState) {
        updateSchema.effected_states?.push(stateData.state);
      } else {
        updateSchema.effected_states = updateSchema.effected_states?.filter(es => es != stateData.state);
        if (updateSchema.effected_states?.length == 0) {
          data!.update_schema_list = data!.update_schema_list.filter(us => us.node_id != updateSchema.node_id);
        }
      }
      return {...data!};
    });
  }

  finalizeDefineOperationUpdateSchema(saveValue: boolean) {
    if (saveValue) {
      this.node.update(data => {
        data!.operation_list.push(this.operation()!);
        return {...data!};
      });
    };
    this.dialogRef!.updatePosition({
      bottom: ""
    });
    this.operation.set(null);
    this.MODE.defineOperationUpdateSchema.set(false);
    this.MODE.addOperation.set(false);
  }

  enterAddStateMode() {
    this.MODE.addState.set(true);
  }

  saveState(state: string) {
    this.node.update(data => {
      data!.state_list.push(state);
      return {...data!};
    });
    this.MODE.addState.set(false);
  }

  removeOperation(index: number) {
    this.node.update(data => {
      data!.operation_list = data!.operation_list.filter((_, i) => i != index);
      return {...data!};
    });
  }

  removeState(index: number) {
    this.node.update(data => {
      data!.state_list = data!.state_list.filter((_, i) => i != index);
      return {...data!};
    });
  }

}
