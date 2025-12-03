export interface Operation {
  id: string;
  name: string;
  update_schema_list: UpdateSchema[];
  node_id: string;
}

export interface UpdateSchema {
  node_id: string;
  effected_states: string[];
}
