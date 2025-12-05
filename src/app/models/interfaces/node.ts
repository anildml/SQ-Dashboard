import {Operation} from './operation';

export interface Node {
  id: string;
  name: string;
  parents: string[] | null;
  children: Node[] | null;
  state_list: string[] | null;
  operation_list: Operation[] | null;
}
