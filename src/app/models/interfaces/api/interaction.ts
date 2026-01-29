import {Event} from "./event";

export interface Interaction extends Event {
  operation_name: string;
  trigger_time: string;
  trigger_data: any;
  result_time: string;
  result_data: Update[];
}

export interface Update {
  node_name: string;
  updated_states: any;
}

export function isInteraction(interaction: Event) {
  return (
          "operation_name" in interaction &&
          "trigger_time" in interaction &&
          "trigger_data" in interaction &&
          "result_time" in interaction &&
          "result_data" in interaction
          );
}
