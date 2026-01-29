import {Node} from './node';

export interface Operation {
  id: string;
  name: string;
  update_schemas: UpdateSchema[];

  node?: Node;
}

export interface UpdateSchema {
  node_id: string;
  effected_states: string[];

  node_name?: string;
}
