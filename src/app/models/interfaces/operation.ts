export interface Operation {
  id: string;
  name: string;
  update_schema_list: UpdateSchema[];
}

export interface UpdateSchema {
  node_id: string;
  node_name?: string;
  effected_states: string[];
}
