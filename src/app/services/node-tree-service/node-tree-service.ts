import {EventEmitter, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {Node} from '../../models/interfaces/view/node';
import {toObservable} from '@angular/core/rxjs-interop';
import {Operation, UpdateSchema} from '../../models/interfaces/view/operation';
import {firstValueFrom, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment.dev';

interface LayerData {
  nodeList: Node[];
  selectedNode?: Node | null;
  lines?: LineRef[];
}

interface LineRef {
  line: any;
  startNode: Node;
  endNode: Node;
}

@Injectable({
  providedIn: 'root',
})
export class NodeTreeService {

  rootNode!: Node
  treePath: WritableSignal<LayerData[]> = signal([]);
  expandChildNodeClicked: EventEmitter<string> = new EventEmitter<string>();

  operationToEdit: WritableSignal<Operation | null> = signal(null);
  operationToEdit_: Observable<Operation | null> = toObservable(this.operationToEdit);
  addStateToOperationUpdateSchemaEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  http: HttpClient = inject(HttpClient)

  constructor() {
    this.setRootNode();
    this.addStateToOperationUpdateSchemaEventEmitter.subscribe(data => {
      this.addStateToOperationUpdateSchema(data);
    });
  }

  async readNode(id: string): Promise<Node> {
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

  async createNode(node: Node): Promise<string> {
    let url = "http://" + environment.service_url + "/v1/admin/node/";
    let options = {
      headers: {},
      params: {}
    };
    let response: any;
    let body = node as any;
    body.children = node.children.map(node => node.id);
    body.operations = node.operations.map(operation => operation.id);
    try {
      response = await firstValueFrom(this.http.post(url, body, options));
    } catch (e) {
      throw e;
    }
    return response.node_id;
  }

  async updateNode(node: Node): Promise<void> {
    let url = "http://" + environment.service_url + "/v1/admin/node/" + node.id;
    let options = {
      headers: {},
      params: {}
    };
    let response: any;
    let body = node as any;
    body.children = node.children.map(node => node.id);
    body.operations = node.operations.map(operation => operation.id);
    try {
      response = await firstValueFrom(this.http.put(url, body, options));
    } catch (e) {
      throw e;
    }
    return;
  }

  async deleteNode(node: Node): Promise<void> {
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

  async readOperation(id: string): Promise<Node> {
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

  async createOperation(operation: Operation): Promise<string> {
    let url = "http://" + environment.service_url + "/v1/admin/operation/";
    let options = {
      headers: {},
      params: {}
    };
    let response: any;
    operation.node = undefined;
    try {
      response = await firstValueFrom(this.http.post(url, operation, options));
    } catch (e) {
      throw e;
    }
    return response.operation_id;
  }

  async updateOperation(operation: Operation): Promise<void> {
    let url = "http://" + environment.service_url + "/v1/admin/operation/" + operation.id;
    let options = {
      headers: {},
      params: {}
    };
    let response: any;
    operation.node = undefined;
    try {
      response = await firstValueFrom(this.http.put(url, operation, options));
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

  setRootNode() {
    this.readNode("691ae106a7adf91a70f76791").then(res => {
      this.initNodeTree(res);
    });
  }

  initNodeTree(node: Node) {
    this.rootNode = node;
    this.treePath.update(tp => {
      tp.push({
        nodeList: [this.rootNode],
        selectedNode: null
      });
      return [...tp];
    })
  }

  addNewNodeRecordToTree(layerIndex: number) {
    let parentNode = this.treePath().at(layerIndex - 1)!.selectedNode!;
    let newNode: Node = {
      id: "",
      name: "",
      parents: [parentNode.id],
      children: [],
      states: [],
      operations: []
    };
    parentNode.children.push(newNode);
    this.treePath.update(tp => [...tp]);
  }

  updateNodeOnTreePath(node: Node) {
    let parentNodeData = this.findParentNode(this.rootNode, node);
    let i = parentNodeData?.node?.children?.findIndex(c => c.id == node.id) ?? -1;
    parentNodeData!.node!.children![i] = node;
    this.treePath.update(tp => [...tp]);
    this.updateNode(node);
  }

  deleteNodeFromTreePath(node: Node) {
    let parentNodeData = this.findParentNode(this.rootNode, node);
    parentNodeData!.node!.children! = parentNodeData!.node!.children.filter(n => n.id != node.id);
    this.treePath.update(tp => {
      let parentLayer = tp.at(parentNodeData!.index)!;
      let childLayer = tp.at(parentNodeData!.index + 1)!;
      parentLayer.lines!.find(lineData => lineData.endNode == node)!.line.remove();
      childLayer.nodeList = childLayer.nodeList.filter(n => n != node);
      return [...tp]
    });
    this.deleteNode(node);
  }

  getNodeData(id: string) {
    let layerIndex: number = -1;
    let clickedNode!: Node;
    this.treePath().forEach((layer, i) => {
      layer.nodeList.forEach((node, _) => {
        if (node.id === id) {
          clickedNode = node;
          layerIndex = i;
        }
      });
    });

    return {
      layerIndex,
      clickedNode
    };
  }

  growTreePath(lastSelectedNode: Node) {
    this.treePath.update(tp => {
      tp.at(-1)!.selectedNode = lastSelectedNode;
      tp.push({
        nodeList: lastSelectedNode.children ?? [],
        selectedNode: null
      });
      return [...tp];
    });
  }

  shortenTreePath(layerIndex: number) {
    this.treePath.update(tp => {
      tp = tp.slice(0, layerIndex + 1);
      tp.at(-1)!.selectedNode = null;
      return [...tp];
    });
  }

  drawLinesForLastLayer() {
    let parentNode = this.treePath().at(-2)!.selectedNode!;
    let childNodes = this.treePath().at(-1)?.nodeList!;
    let lines: LineRef[] = [];
    for (let childNode of childNodes) {
      let parentNodeEl = document.getElementById("node_" + parentNode.id);
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
      lines.push({
        line: line,
        startNode: parentNode,
        endNode: childNode
      });
    }
    this.treePath.update(tp => {
      tp.at(-2)!.lines = lines;
      return [...tp];
    });
  }

  isNewBranch(layerIndex: number, clickedNode: Node): boolean {
    return !(this.treePath().at(layerIndex)?.selectedNode?.id === clickedNode.id);
  }

  isLastLayer(layerIndex: number): boolean {
    return layerIndex === this.treePath().length - 1;
  }

  findParentNode(parent: Node, search: Node): ({ node: Node, index: number } | null) {
    for (let i = 0; i < parent.children.length; i++) {
      let child = parent.children.at(i)!;
      if (search.id == child.id) {
        return {
          node: parent,
          index: i
        };
      }
      let result = this.findParentNode(child, search);
      if (result) {
        return result;
      }
    }
    return null;
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

  finalizeUpdateOperation(saveValue: boolean) {
    if (saveValue) {
      let node = this.operationToEdit()!.node!;
      let index = node.operation_list.map(o => o.id).indexOf(this.operationToEdit()!.id);
      node.operation_list[index] = this.operationToEdit()!;
      this.updateNode(node);
    }
    this.operationToEdit.set(null);
  }

  updateOperationName(name: string) {
    this.operationToEdit.update(operation => {
      operation!.name = name;
      return {...operation!};
    })
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
