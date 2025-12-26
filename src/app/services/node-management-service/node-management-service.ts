import {computed, EventEmitter, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {Operation} from "../../models/interfaces/operation";
import {toObservable} from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class NodeManagementService {

  operationToEdit: WritableSignal<Operation | null> = signal(null);
  operationToEdit_ = toObservable(this.operationToEdit);
  addStateToOperationUpdateSchemaEventEmitter: EventEmitter<any> = new EventEmitter<any>();
  
  constructor() {}

}
