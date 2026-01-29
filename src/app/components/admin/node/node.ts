import {
  Component,
  inject, input,
  OnInit,
  Signal,
  signal, viewChild,
  viewChildren,
  WritableSignal
} from '@angular/core';
import {Node} from '../../../models/interfaces/api/node';
import {MatIconModule} from '@angular/material/icon';
import {NodeTreeService} from '../../../services/node-tree-service/node-tree-service';
import {MatInputModule} from '@angular/material/input';
import {InputComponent} from '../../common/input/input';
import {toObservable} from '@angular/core/rxjs-interop';
import {firstValueFrom, Observable, skip} from 'rxjs';
import {Operation} from '../../../models/interfaces/api/operation';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-node',
  imports: [
    MatIconModule,
    MatInputModule,
    InputComponent,
    MatButton
  ],
  templateUrl: './node.html',
  styleUrl: './node.scss',
})
export class NodeComponent implements OnInit {

  nodeTreeService: NodeTreeService = inject(NodeTreeService);

  node = input.required<Node>();
  node_: Observable<Node> = toObservable(this.node);
  updatedNodeTemplate: WritableSignal<Node> = signal<Node>({} as Node);
  viewNodeName: Signal<InputComponent | undefined> = viewChild("nodeName");
  viewStateList: Signal<readonly InputComponent[]> = viewChildren("state");
  viewStateList_ = toObservable(this.viewStateList);
  viewOperationList: Signal<readonly InputComponent[]> = viewChildren("operation");
  viewOperationList_ = toObservable(this.viewOperationList);

  statesIsSelectedSignalList: WritableSignal<boolean>[] = [];

  constructor() {
    this.nodeTreeService.updatedOperationTemplate_.subscribe(operation => {
      this.updateStatesIsSelectedSignalList(operation);
    });
    this.node_.subscribe(node => {
      this.updatedNodeTemplate.set(node);
    });
  }

  ngOnInit(): void {
    this.updatedNodeTemplate.set(this.node());
    for (let i = 0; i < this.updatedNodeTemplate().states.length; i++) {
      this.statesIsSelectedSignalList.push(signal(false));
    }
  }

  async expandButtonClicked() {
    await this.nodeTreeService.switchSelectedNode(this.node());
  }

  async initDefineNewNode() {
    await this.nodeTreeService.initDefineNewNode(this.node());
  }

  async editName(val: string) {
    this.updatedNodeTemplate.update(node => {
      node.name = val;
      return {...node};
    });
    await this.nodeTreeService.updateNodeOnTreePath(this.updatedNodeTemplate());
  }

  async addNewOperationRecord() {
    let newOperation = await this.nodeTreeService.addNewOperationRecordToNode(this.updatedNodeTemplate());
    this.updatedNodeTemplate.update(node => {
      return {...node};
    });
    await firstValueFrom(this.viewOperationList_.pipe(skip(1)));
    await this.nodeTreeService.openOperationDialog(newOperation);
  }

  async addNewStateRecord() {
    this.updatedNodeTemplate.update(node => {
      node.states.push("");
      return {...node};
    });
    this.statesIsSelectedSignalList.push(signal(false));
    await this.nodeTreeService.updateNodeOnTreePath(this.updatedNodeTemplate());
    await firstValueFrom(this.viewStateList_);
    this.viewStateList().at(-1)!._enterEditMode();
  }

  async initDefineNewOperation(changedValue: string, index: number) {
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
    await this.nodeTreeService.openOperationDialog(operationToDefine);
  }

  async editOperation(operation: Operation) {
    await this.nodeTreeService.openOperationDialog(operation);
  }

  async editState(changedValue: string, index: number) {
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
    await this.nodeTreeService.updateNodeOnTreePath(this.updatedNodeTemplate());
  }

  async deleteNode() {
    await this.nodeTreeService.deleteNodeFromTreePath(this.updatedNodeTemplate());
  }

  async deleteOperation(operation: Operation) {
    this.updatedNodeTemplate.update(node => {
      node.operations = node.operations.filter(o => o != operation);
      return {...node};
    });
    await this.nodeTreeService.deleteOperation(operation);
    await this.nodeTreeService.updateNodeOnTreePath(this.updatedNodeTemplate());
  }

  async deleteState(state: string) {
    let index = this.updatedNodeTemplate().states.indexOf(state);
    this.updatedNodeTemplate.update(node => {
      node.states = node.states.filter(o => o != state);
      return {...node};
    });
    this.statesIsSelectedSignalList = this.statesIsSelectedSignalList.filter((_, i) => i != index);
    await this.nodeTreeService.updateNodeOnTreePath(this.updatedNodeTemplate());
  }

  clickedOnState(state: string) {
    if (this.nodeTreeService.updatedOperationTemplate()) {
      this.nodeTreeService.addStateToOperationUpdateSchema({
        state: state,
        node: this.updatedNodeTemplate(),
      })
    }
  }

  isStateSelected(index: number): Signal<boolean> {
    return this.statesIsSelectedSignalList.at(index)!;
  }

  updateStatesIsSelectedSignalList(operation: Operation | null) {
    this.statesIsSelectedSignalList.forEach(s => s.set(false));
    if (operation) {
      let operationToEdit = this.nodeTreeService.updatedOperationTemplate()!;
      let node = operationToEdit.update_schemas
        .find(us => us.node_id == this.updatedNodeTemplate().id);
      if (!node) {
        return;
      }
      node.effected_states.forEach(es => {
        let index = this.updatedNodeTemplate().states.indexOf(es);
        this.statesIsSelectedSignalList.at(index)!.set(true);
      });
    }
  }

  isStateSelectable(state: string): boolean {
    return this.nodeTreeService.isStateSelectable(state);
  }

}
