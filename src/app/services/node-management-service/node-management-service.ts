import {computed, EventEmitter, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {Operation} from "../../models/interfaces/operation";

@Injectable({
  providedIn: 'root',
})
export class NodeManagementService {

  operationToEdit: WritableSignal<Operation | null> = signal(null);
  operationEditMode: Signal<boolean> = computed(() => this.operationToEdit() != null);
  addStateToOperationUpdateSchemaEventEmitter: EventEmitter<any> = new EventEmitter<any>();
  
  constructor() {}

}
