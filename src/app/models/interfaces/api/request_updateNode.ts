import {Operation} from '../view/operation';

export interface request_updateNode {
  id: string;
  name: string;
  parents: string[];
  children: string[];
  state_list: string[];
  operation_ids: string[];
}
