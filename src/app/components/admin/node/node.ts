import {
  Component, computed,
  inject, input,
  OnInit,
  Signal,
  signal,
  viewChildren,
  WritableSignal
} from '@angular/core';
import {Node} from '../../../models/interfaces/node';
import {MatIconModule} from '@angular/material/icon';
import {NodeTreeService} from '../../../services/node-tree-service/node-tree-service';
import {NodeManagementService} from '../../../services/node-management-service/node-management-service';
import {MatInputModule} from '@angular/material/input';
import {InputComponent} from '../../common/input/input';
import {toObservable} from '@angular/core/rxjs-interop';
import {firstValueFrom, skip} from 'rxjs';
import {Operation} from '../../../models/interfaces/operation';

@Component({
  selector: 'app-node',
  imports: [
    MatIconModule,
    MatInputModule,
    InputComponent
  ],
  templateUrl: './node.html',
  styleUrl: './node.scss',
})
export class NodeComponent implements OnInit {

  nodeTreeService: NodeTreeService = inject(NodeTreeService);
  nodeManagementService: NodeManagementService = inject(NodeManagementService);

  node = input.required<Node>();
  updatedNodeTemplate: WritableSignal<Node> = signal<Node>({} as Node);
  viewStateList: Signal<readonly InputComponent[]> = viewChildren("state");
  viewStateList_ = toObservable(this.viewStateList);
  viewOperationList: Signal<readonly InputComponent[]> = viewChildren("operation");
  viewOperationList_ = toObservable(this.viewOperationList);

  statesIsSelectedSignalList: WritableSignal<boolean>[] = [];
  isSelected: WritableSignal<boolean> = signal(false);

  constructor() {
  }

  ngOnInit(): void {
    this.updatedNodeTemplate.set(this.node());
    let stateListLength = this.updatedNodeTemplate().state_list.length;
    this.statesIsSelectedSignalList = new Array(stateListLength).fill(signal(false), 0, stateListLength);
    this.nodeManagementService.operationToEdit_.subscribe(operation => {
      this.updateStatesIsSelectedSignalList(operation);
    });

  }

  expandChildNodeClicked() {
    this.nodeTreeService.expandChildNodeClicked.emit(this.updatedNodeTemplate().id);
  }

  openOperationDialog(operation: Operation) {
    operation.node = this.updatedNodeTemplate();
    this.nodeManagementService.operationToEdit.set({...operation});
  }

  editName(val: string) {
    this.updatedNodeTemplate.update(node => {
      node.name = val;
      return {...node};
    });
    this.nodeManagementService.updateNode(this.updatedNodeTemplate());
  }

  async addNewOperationRecord() {
    this.updatedNodeTemplate.update(node => {
      node.operation_list.push({
        id: "",
        name: "",
        update_schema_list: []
      });
      return {...node};
    })
    await firstValueFrom(this.viewOperationList_.pipe(skip(1)));
    this.viewOperationList().at(-1)?._enterEditMode();
  }

  async addNewStateRecord() {
    this.updatedNodeTemplate.update(node => {
      node.state_list.push("");
      return {...node};
    })
    this.statesIsSelectedSignalList.push(signal(false));
    await firstValueFrom(this.viewStateList_.pipe(skip(1)));
    this.viewStateList().at(-1)!._enterEditMode();
  }

  initDefineNewOperation(changedValue: string, index: number) {
    if (changedValue == "") {
      this.updatedNodeTemplate.update(node => {
        node.operation_list = node.operation_list.filter((_, i) => index != i);
        return {...node};
      });
      return;
    }
    this.updatedNodeTemplate.update(node => {
      node.operation_list.at(-1)!.name = changedValue;
      return {...node};
    });
    let operationToDefine = this.updatedNodeTemplate().operation_list.at(-1)!;
    this.openOperationDialog(operationToDefine);
  }

  editOperation(id: string) {
    let operation = this.updatedNodeTemplate().operation_list.filter(o => o.id == id).at(0)!;
    this.openOperationDialog(operation);
  }

  editState(changedValue: string, index: number) {
    if (changedValue == "") {
      this.updatedNodeTemplate.update(node => {
        node.state_list = node.state_list.filter((_, i) => index != i);
        return {...node};
      });
      return;
    }
    this.updatedNodeTemplate.update(node => {
      node.state_list[index] = changedValue;
      return {...node};
    });
    this.nodeManagementService.updateNode(this.updatedNodeTemplate());
  }

  deleteNode() {
    this.nodeManagementService.deleteNode(this.updatedNodeTemplate());
  }

  deleteOperation(id: string) {
    this.updatedNodeTemplate.update(node => {
      node.operation_list = node.operation_list.filter(o => o.id != id);
      return {...node};
    });
    this.nodeManagementService.updateNode(this.updatedNodeTemplate());
  }

  deleteState(state: string) {
    let index = this.updatedNodeTemplate().state_list.indexOf(state);
    this.updatedNodeTemplate.update(node => {
      node.state_list = node.state_list.filter(o => o != state);
      return {...node};
    });
    this.statesIsSelectedSignalList = this.statesIsSelectedSignalList.filter((_, i) => i != index);
    this.nodeManagementService.updateNode(this.updatedNodeTemplate());
  }

  clickedOnState(state: string) {
    if (this.nodeManagementService.operationToEdit()) {
      this.nodeManagementService.addStateToOperationUpdateSchemaEventEmitter.emit({
        state: state,
        nodeId: this.node().id,
        nodeName: this.node().name
      });
    }
  }

  isStateSelected(index: number): Signal<boolean> {
    return this.statesIsSelectedSignalList.at(index)!;
  }

  updateStatesIsSelectedSignalList(operation: Operation | null) {
    this.statesIsSelectedSignalList.forEach(s => s.set(false));
    if (operation) {
      let operationToEdit = this.nodeManagementService.operationToEdit()!;
      let node = operationToEdit.update_schema_list
        .find(us => us.node_id == this.updatedNodeTemplate().id);
      if (!node) {
        return;
      }
      node.effected_states.forEach(es => {
          let index = this.updatedNodeTemplate().state_list.indexOf(es);
          this.statesIsSelectedSignalList.at(index)!.set(true);
        }
      );
    }
  }

}
