import {
  ChangeDetectorRef,
  EventEmitter,
  inject,
  Injectable,
  Signal,
  signal,
  viewChildren,
  WritableSignal
} from '@angular/core';
import {Node} from '../../models/interfaces/view/node';
import {toObservable} from '@angular/core/rxjs-interop';
import {Operation, UpdateSchema} from '../../models/interfaces/view/operation';
import {firstValueFrom, Observable, skip} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment.dev';
import {OperationComponent} from '../../components/admin/operation/operation';
import {MatExpansionPanel} from '@angular/material/expansion';
import {NodeTreeLayerComponent} from '../../components/admin/node-tree-layer/node-tree-layer';
import {NodeComponent} from '../../components/admin/node/node';

interface LayerData {
  nodeList: Node[];
  selected: {
    node: Node,
    lines: {
      ref: any;
      endNode: Node;
    }[]
  } | null;
}

@Injectable({
  providedIn: 'root'
})
export class NodeTreeService {

  rootNode!: Node
  treePath: WritableSignal<LayerData[]> = signal([]);

  nodeTreeChangeDetectorRef: ChangeDetectorRef | undefined;
  ncd: ChangeDetectorRef | undefined;

  viewTreePath: Signal<readonly NodeTreeLayerComponent[]> = signal([]);
  viewTreePathLayerPanels: Signal<readonly MatExpansionPanel[]> = signal([]);
  viewOperationDialog: Signal<OperationComponent | undefined> = signal(undefined);
  viewOperationDialog_: Observable<OperationComponent | undefined> = toObservable(this.viewOperationDialog);

  operationToEdit: WritableSignal<Operation | null> = signal(null);
  operationToEdit_: Observable<Operation | null> = toObservable(this.operationToEdit);

  http: HttpClient = inject(HttpClient)

  constructor() {
    this.setRootNode();
  }

  private async createNode(node: Node): Promise<Node> {
    let url = "http://" + environment.service_url + "/v1/admin/node/";
    let options = {
      headers: {},
      params: {}
    };
    let response: any;
    let body = {...node} as any;
    body.parentNode = undefined;
    body.operations = undefined;
    body.children = node.children.map(node => node.id);
    body.operation_ids = node.operations.map(operation => operation.id);
    try {
      response = await firstValueFrom(this.http.post(url, body, options));
    } catch (e) {
      throw e;
    }
    node.id = response.node_id;
    return node;
  }

  private async readNode(id: string): Promise<Node> {
    let url = "http://" + environment.service_url + "/v1/admin/node/" + id;
    let options = {
      headers: {},
      params: {}
    };
    let response: any;
    try {
      response = await firstValueFrom(this.http.get<any>(url, options));
    } catch (e) {
      throw e;
    }
    return response.node;
  }

  private async updateNode(node: Node): Promise<void> {
    let url = "http://" + environment.service_url + "/v1/admin/node/" + node.id;
    let options = {
      headers: {},
      params: {}
    };
    let response: any;
    let body = {...node} as any;
    body.parentNode = undefined;
    body.operations = undefined;
    body.children = node.children.map(node => node.id);
    body.operation_ids = node.operations.map(operation => operation.id);
    try {
      response = await firstValueFrom(this.http.put(url, body, options));
    } catch (e) {
      throw e;
    }
    return;
  }

  private async deleteNode(node: Node): Promise<void> {
    let url = "http://" + environment.service_url + "/v1/admin/node/" + node.id;
    let options = {
      headers: {},
      params: {}
    };
    let response: any;
    try {
      response = await firstValueFrom(this.http.delete(url, options));
    } catch (e) {
      throw e;
    }
    return;
  }

  private async createOperation(operation: Operation): Promise<string> {
    let url = "http://" + environment.service_url + "/v1/admin/operation/";
    let options = {
      headers: {},
      params: {}
    };
    let response: any;
    let body = {...operation} as any;
    body.node = undefined;
    body.node_id = operation.node?.id;
    try {
      response = await firstValueFrom(this.http.post(url, body, options));
    } catch (e) {
      throw e;
    }
    return response.operation_id;
  }

  private async readOperation(id: string): Promise<Node> {
    let url = "http://" + environment.service_url + "/v1/admin/operation/" + id;
    let options = {
      headers: {},
      params: {}
    };
    let response: any;
    try {
      response = await firstValueFrom(this.http.get<any>(url, options));
    } catch (e) {
      throw e;
    }
    return response.operation;
  }

  private async updateOperation(operation: Operation): Promise<void> {
    let url = "http://" + environment.service_url + "/v1/admin/operation/" + operation.id;
    let options = {
      headers: {},
      params: {}
    };
    let response: any;
    let body = {...operation} as any;
    body.node = undefined;
    body.node_id = operation.node?.id;
    try {
      response = await firstValueFrom(this.http.put(url, body, options));
    } catch (e) {
      throw e;
    }
    return;
  }

  async deleteOperation(operation: Operation): Promise<void> {
    let url = "http://" + environment.service_url + "/v1/admin/operation/" + operation.id;
    let options = {
      headers: {},
      params: {}
    };
    let response: any;
    try {
      response = await firstValueFrom(this.http.delete(url, options));
    } catch (e) {
      throw e;
    }
    return;
  }

  private setRootNode() {
    this.readNode("691ae106a7adf91a70f76791").then(res => {
      this.initNodeTree(res);
    });
  }

  private buildNodeSubData(node: Node, layerIndex: number) {
    node.layerIndex = layerIndex;
    node.children.forEach((n: Node) => {
      // throws BEFORE_APP_SERIALIZED err, don't know why
      n.parentNode = node;
      this.buildNodeSubData(n, layerIndex + 1);
    });
    node.operations.forEach(o => {
      o.node = node;
      o.update_schemas.forEach((us: UpdateSchema) => {
        if (!us.node_name) {
          let n = this.findNode(us.node_id);
          us.node_name = n!.name;
        }
      });
    });
  }

  private initNodeTree(node: Node) {
    this.rootNode = node;
    this.buildNodeSubData(this.rootNode, 0);
    this.treePath.update(tp => {
      tp.push({
        nodeList: [this.rootNode],
        selected: null
      });
      return [...tp];
    });
  }





  // simplify logic
  async addNodeToTreePath(parentNode: Node) {
    let newNode: Node = {
      id: "",
      name: "",
      parents: [parentNode.id],
      children: [],
      states: [],
      operations: []
    };
    await this.createNode(newNode);
    parentNode.children.push(newNode);
    this.buildNodeSubData(parentNode, parentNode.layerIndex!);
    this.treePath.update(tp => {
      // tp.at(newNode.layerIndex!)?.nodeList.push(newNode);
      return [...tp];
    });
    this.nodeTreeChangeDetectorRef?.detectChanges();
    let newNodeComponent = this.getNodeComponentRef(newNode.id);
    let isLastLayer = this.isLastLayer(parentNode.layerIndex!)
    if (isLastLayer) {
      await this.growTreePath(parentNode);
    } else {
      await this.drawLine(newNode);
    }


    newNodeComponent!.viewNodeName()?._enterEditMode();
  }

  async updateNodeOnTreePath(node: Node) {
    await this.updateNode(node);
    this.treePath.update(tp => [...tp]);
  }

  async deleteNodeFromTreePath(node: Node) {
    await this.deleteNode(node);
    node.parentNode!.children! = node.parentNode!.children.filter(n => n.id != node.id);
    this.treePath.update(tp => {
      let parentLayer = tp.at(node.parentNode!.layerIndex!)!;
      let childLayer = tp.at(node.parentNode!.layerIndex! + 1)!;
      parentLayer.selected!.lines!.find(lineData => lineData.endNode.id == node.id)!.ref.remove();
      childLayer.nodeList = childLayer.nodeList.filter(n => n.id != node.id);
      if (childLayer.nodeList.length == 0) {
        tp.splice(tp.length - 1, 1);
        // wait for layer collapse
      }
      return [...tp]
    });
  }

  async expandButtonClicked(selectedNode: Node) {
    if (this.isLastLayer(selectedNode.layerIndex!)) {
      await this.growTreePath(selectedNode);
    } else {
      let isNewBranch: boolean = this.isNewBranch(selectedNode);
      await this.shortenTreePath(selectedNode.layerIndex!);
      if (isNewBranch) {
        this.nodeTreeChangeDetectorRef!.detectChanges();
        await this.growTreePath(selectedNode);
      }
    }
  }

  private async growTreePath(lastSelectedNode: Node) {
    this.treePath.update(tp => {
      tp.at(-1)!.selected = {
        node: lastSelectedNode,
        lines: []
      };
      tp.push({
        nodeList: lastSelectedNode.children ?? [],
        selected: null
      });
      return [...tp];
    });
    await this.expandLastLayer();
  }

  private async shortenTreePath(layerIndex: number) {
    await this.collapseLayers(layerIndex + 1);
    this.treePath.update(tp => {
      tp = tp.slice(0, layerIndex + 1);
      tp.at(-1)!.selected = null;
      return [...tp];
    });
  }

  private async expandLastLayer() {
    this.nodeTreeChangeDetectorRef?.detectChanges();
    let layerPanel = this.viewTreePathLayerPanels().at(-1)!;
    await new Promise(resolve => setTimeout(resolve, 100));

    layerPanel.open();
    layerPanel.afterExpand.subscribe(data => {
      console.log("here");
    })
    layerPanel.afterCollapse.subscribe(data => {
      console.log("here");
    })

    let childNodes = this.treePath().at(-1)?.nodeList!;
    let lines: any[] = [];
    await Promise.all(childNodes.map(async childNode => {
      let line = await this.drawLine(childNode);
      lines.push({ref: line, endNode: childNode});
    }))
    this.treePath.update(tp => {
      tp.at(-2)!.selected!.lines = lines;
      return [...tp];
    });
  }

  private async drawLine(childNode: Node): Promise<any> {
    let parentNodeEl = document.getElementById("node_" + childNode.parentNode!.id);
    let parentNodeExpandButton = parentNodeEl?.getElementsByClassName("expand_button")?.item(0);
    let childNodeEl = document.getElementById("node_" + childNode.id);
    let childNodeContent = childNodeEl?.getElementsByClassName("node")?.item(0);
    let line = new LeaderLine(LeaderLine.pointAnchor(parentNodeExpandButton), childNodeContent, {
      hide: true,
      path: "fluid",
      startPlug: "square",
      startPlugSize: 2,
      startSocket: "bottom",
      endSocket: "top",
      endPlug: "disc"
    });
    line.show("draw", {duration: 200});
    await new Promise(resolve => setTimeout(resolve, 200));
    return line;
  }

  private async collapseLayers(layerIndex: number) {
    let layersToCollapse: number[] = [...Array(this.treePath().length).keys()].slice(layerIndex);
    await Promise.all(layersToCollapse.map(i => this.collapseLayer(i)));
  }

  private async collapseLayer(layerIndex: number): Promise<void> {
    let layerPanel: MatExpansionPanel = this.viewTreePathLayerPanels().at(layerIndex)!;
    layerPanel.close();
    let lines = this.treePath().at(layerIndex - 1)?.selected?.lines!;
    await Promise.all([
      lines.map(async line => await this.removeLine(line.ref)),
      firstValueFrom(layerPanel.afterCollapse)
    ]);
  }

  private async removeLine(line: any) {
    line.hide("draw", {duration: 200});
    await new Promise(resolve => setTimeout(resolve, 200));
    line.remove();
  }



  // OPERATION DIALOG LOGICS
  async addNewOperationRecordToNode(node: Node): Promise<Operation> {
    let newOperation: Operation = {
      id: '',
      name: '',
      node: node,
      update_schemas: []
    };
    newOperation.id = await this.createOperation(newOperation);
    node.operations.push(newOperation);
    await this.updateNode(node);
    return newOperation;
  }

  async openOperationDialog(operation: Operation) {
    this.operationToEdit.set({...operation});
    await firstValueFrom(this.viewOperationDialog_);
    this.viewOperationDialog()?.viewOperationName()?._enterEditMode();
  }

  async finalizeUpdateOperation(saveValue: boolean) {
    if (saveValue) {
      let node = this.operationToEdit()!.node!;
      let i = node.operations.map(o => o.id).indexOf(this.operationToEdit()?.id!);
      node.operations[i] = this.operationToEdit!()!;
      await this.updateOperation(this.operationToEdit()!);
      await this.updateNode(node);
    }
    this.operationToEdit.set(null);
  }

  updateOperationName(name: string) {
    this.operationToEdit.update(operation => {
      operation!.name = name;
      return {...operation!};
    });
  }

  addStateToOperationUpdateSchema(stateData: any) {
    let operation = this.operationToEdit()!;
    let existingUpdateSchema = operation.update_schemas.find(us => us.node_id === stateData.node.id);
    let updateSchema: UpdateSchema = existingUpdateSchema ? existingUpdateSchema : {
      node_id: stateData.node.id,
      node_name: stateData.node.name,
      effected_states: []
    };
    if (!existingUpdateSchema) {
      operation.update_schemas.push(updateSchema);
    }
    let effectedState = updateSchema.effected_states?.find(es => es == stateData.state);
    if (!effectedState) {
      updateSchema.effected_states?.push(stateData.state);
    } else {
      updateSchema.effected_states = updateSchema.effected_states?.filter(es => es != stateData.state);
      if (updateSchema.effected_states?.length == 0) {
        operation.update_schemas = operation.update_schemas.filter(us => us.node_id != updateSchema.node_id);
      }
    }
    this.operationToEdit.set({...operation});
  }



  // UTIL FUNCTIONS
  isNewBranch(selectedNode: Node): boolean {
    return !(this.treePath().at(selectedNode.layerIndex!)?.selected!.node!.id === selectedNode.id);
  }

  isLastLayer(layerIndex: number): boolean {
    return layerIndex === this.treePath().length - 1;
  }

  findNode(id: string): Node | null {
    return this.findNodeRecursively(id, this.rootNode);
  }

  private findNodeRecursively(id: string, current: Node): Node | null {
    if (current.id == id) {
      return current;
    }
    for (let child of current.children) {
      let res = this.findNodeRecursively(id, child);
      if (res) {
        return res;
      }
    }
    return null;
  }

  private getNodeComponentRef(id: string) {
    let newNodeComponent: NodeComponent;
    this.viewTreePath().forEach(layer => {
      let nc = layer.viewNodeList().find(nc => id == nc.node().id);
      if (nc) {
        newNodeComponent = nc;
      }
    });
    return newNodeComponent!;
  }


}
