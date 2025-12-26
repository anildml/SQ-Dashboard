import {
  Component,
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
  node$: WritableSignal<Node> = signal<Node>({} as Node);
  viewStateList: Signal<readonly InputComponent[]> = viewChildren("state");
  viewStateList_ = toObservable(this.viewStateList);
  viewOperationList: Signal<readonly InputComponent[]> = viewChildren("operation");
  viewOperationList_ = toObservable(this.viewOperationList);

  stateIsSelectedSignalList: WritableSignal<boolean>[] = [];
  isSelected: WritableSignal<boolean> = signal(false);

  constructor() {
  }

  ngOnInit(): void {
    this.node$.set(this.node());
    let stateListLength = this.node$().state_list.length;
    this.stateIsSelectedSignalList = new Array(stateListLength).fill(signal(false), 0, stateListLength);
    this.nodeManagementService.operationToEdit_.subscribe(operation => {
      this.stateIsSelectedSignalList.forEach(s => s.set(false));
      if (operation) {
        let operationToEdit = this.nodeManagementService.operationToEdit()!;
        let node = operationToEdit.update_schema_list
          .find(us => us.node_id == this.node$().id);
        if (!node) {
          return;
        }
        node.effected_states.forEach(es => {
            let index = this.node$().state_list.indexOf(es);
            this.stateIsSelectedSignalList.at(index)!.set(true);
          }
        );
      }
    });

  }

  expandChildNodeClicked() {
    this.nodeTreeService.expandChildNodeClicked.emit(this.node$().id);
  }

  openOperationDialog(operation: Operation) {
    this.nodeManagementService.operationToEdit.set(operation);
  }

  editName(val: string) {
    this.node$.update(node => {
      node.name = val;
      return {...node};
    })
  }

  async addNewOperationRecord() {
    this.node$.update(node => {
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
    this.node$.update(node => {
      node.state_list.push("");
      return {...node};
    })
    await firstValueFrom(this.viewStateList_.pipe(skip(1)));
    this.viewStateList().at(-1)!._enterEditMode();
  }

  initDefineNewOperation(changedValue: string, index: number) {
    if (changedValue == "") {
      this.node$.update(node => {
        node.operation_list = node.operation_list.filter((_, i) => index != i);
        return {...node};
      });
      return;
    }
    this.node$.update(node => {
      node.operation_list.at(-1)!.name = changedValue;
      return {...node};
    });
    let operationToDefine = this.node$().operation_list.at(-1)!;
    this.openOperationDialog(operationToDefine);
  }

  editOperation(id: string) {
    let operation = this.node$().operation_list.filter(o => o.id == id).at(0)!;
    this.openOperationDialog(operation);
  }

  editState(changedValue: string, index: number) {
    if (changedValue == "") {
      this.node$.update(node => {
        node.state_list = node.state_list.filter((_, i) => index != i);
        return {...node};
      });
      return;
    }
    this.node$.update(node => {
      node.state_list[index] = changedValue;
      return {...node};
    });
  }

  deleteNode() {

  }

  deleteOperation(id: string) {
    this.node$.update(node => {
      node.operation_list = node.operation_list.filter(o => o.id != id);
      return {...node};
    });
  }

  deleteState(state: string) {
    this.node$.update(node => {
      node.state_list = node.state_list.filter(o => o != state);
      return {...node};
    });
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
    return this.stateIsSelectedSignalList.at(index)!;
  }

}
