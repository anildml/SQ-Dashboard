export interface Interaction {
  operation_id: string;
  trigger_time: string,
  trigger_data: any,
  result_time: string,
  result_data: any,
  updates: Update[]
}

export interface Update {
  node_id: string
  updated_states: UpdatedState[]
}

export interface UpdatedState {
  key: string,
  value: string
}
