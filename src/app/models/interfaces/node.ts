import {Operation} from './operation';

export interface Node {
  id: string;
  name: string;
  parents: Node[];
  children: Node[];
  state_list: string[];
  operation_list: Operation[];
}
