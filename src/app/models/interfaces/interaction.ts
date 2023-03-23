import {Event} from "./event";

export interface Interaction extends Event {
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

export function isInteraction(event: Event): event is Interaction {
  return (
          "operation_id" in event &&
          "trigger_time" in event &&
          "trigger_data" in event &&
          "result_time" in event &&
          "result_data" in event &&
          "updates" in event
          );
}
