import {
  Component,
  inject, input,
  OnInit,
  Signal,
  signal, viewChild,
  viewChildren,
  WritableSignal
} from '@angular/core';
import {Node} from '../../../models/interfaces/view/node';
import {MatIconModule} from '@angular/material/icon';
import {NodeTreeService} from '../../../services/node-tree-service/node-tree-service';
import {MatInputModule} from '@angular/material/input';
import {InputComponent} from '../../common/input/input';
import {toObservable} from '@angular/core/rxjs-interop';
import {firstValueFrom, skip} from 'rxjs';
import {Operation, UpdateSchema} from '../../../models/interfaces/view/operation';

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

  node = input.required<Node>();
  updatedNodeTemplate: WritableSignal<Node> = signal<Node>({} as Node);
  viewNodeName: Signal<InputComponent> = viewChild.required("nodeName");
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
    let stateListLength = this.updatedNodeTemplate().states.length;
    this.updatedNodeTemplate().operations.forEach((o: Operation) => {
      o.update_schemas.forEach((us: UpdateSchema) => {
        if (!us.node_name) {
          let n = this.nodeTreeService.findNode(us.node_id);
          us.node_name = n!.name;
        }
      })
    });
    this.statesIsSelectedSignalList = new Array(stateListLength).fill(signal(false), 0, stateListLength);
    this.nodeTreeService.operationToEdit_.subscribe(operation => {
      this.updateStatesIsSelectedSignalList(operation);
    });
  }

  expandChildNodeClicked() {
    this.nodeTreeService.expandChildNodeClicked.emit(this.updatedNodeTemplate().id);
  }

  openOperationDialog(operation: Operation) {
    operation.node = this.updatedNodeTemplate();
    this.nodeTreeService.operationToEdit.set({...operation});
  }

  editName(val: string) {
    this.updatedNodeTemplate.update(node => {
      node.name = val;
      return {...node};
    });
    this.nodeTreeService.updateNodeOnTreePath(this.updatedNodeTemplate());
  }

  async addNewOperationRecord() {
    this.updatedNodeTemplate.update(node => {
      node.operations.push({
        id: "",
        name: "",
        update_schemas: []
      });
      return {...node};
    })
    await firstValueFrom(this.viewOperationList_.pipe(skip(1)));
    this.viewOperationList().at(-1)?._enterEditMode();
  }

  async addNewStateRecord() {
    this.updatedNodeTemplate.update(node => {
      node.states.push("");
      return {...node};
    })
    this.statesIsSelectedSignalList.push(signal(false));
    await firstValueFrom(this.viewStateList_.pipe(skip(1)));
    this.viewStateList().at(-1)!._enterEditMode();
  }

  initDefineNewOperation(changedValue: string, index: number) {
    if (changedValue == "") {
      this.updatedNodeTemplate.update(node => {
        node.operations = node.operations.filter((_, i) => index != i);
        return {...node};
      });
      return;
    }
    this.updatedNodeTemplate.update(node => {
      node.operations.at(-1)!.name = changedValue;
      return {...node};
    });
    let operationToDefine = this.updatedNodeTemplate().operations.at(-1)!;
    this.openOperationDialog(operationToDefine);
  }

  editOperation(id: string) {
    let operation = this.updatedNodeTemplate().operations.find(o => o.id == id)!;
    this.openOperationDialog(operation);
  }

  editState(changedValue: string, index: number) {
    if (changedValue == "") {
      this.updatedNodeTemplate.update(node => {
        node.states = node.states.filter((_, i) => index != i);
        return {...node};
      });
      return;
    }
    this.updatedNodeTemplate.update(node => {
      node.states[index] = changedValue;
      return {...node};
    });
    this.nodeTreeService.updateNodeOnTreePath(this.updatedNodeTemplate());
  }

  deleteNode() {
    this.nodeTreeService.deleteNodeFromTreePath(this.updatedNodeTemplate());
  }

  deleteOperation(id: string) {
    this.updatedNodeTemplate.update(node => {
      node.operations = node.operations.filter(o => o.id != id);
      return {...node};
    });
    this.nodeTreeService.updateNodeOnTreePath(this.updatedNodeTemplate());
  }

  deleteState(state: string) {
    let index = this.updatedNodeTemplate().states.indexOf(state);
    this.updatedNodeTemplate.update(node => {
      node.states = node.states.filter(o => o != state);
      return {...node};
    });
    this.statesIsSelectedSignalList = this.statesIsSelectedSignalList.filter((_, i) => i != index);
    this.nodeTreeService.updateNodeOnTreePath(this.updatedNodeTemplate());
  }

  clickedOnState(state: string) {
    if (this.nodeTreeService.operationToEdit()) {
      this.nodeTreeService.addStateToOperationUpdateSchemaEventEmitter.emit({
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
      let operationToEdit = this.nodeTreeService.operationToEdit()!;
      let node = operationToEdit.update_schemas
        .find(us => us.node_id == this.updatedNodeTemplate().id);
      if (!node) {
        return;
      }
      node.effected_states.forEach(es => {
          let index = this.updatedNodeTemplate().states.indexOf(es);
          this.statesIsSelectedSignalList.at(index)!.set(true);
        }
      );
    }
  }

}
