import {Event} from "./event";

export interface Interaction extends Event {
  _id: string;
  operation_id: string;
  operation_name: string;
  trigger_time: string;
  trigger_data: any;
  result_time: string;
  result_data: any;
  updates: Update[];
}

export interface Update {
  flow_anchor: string;
  node_id: string;
  node_name: string;
  updated_states: any;
}

export function isInteraction(interaction: Event) {
  return (
          "_id" in interaction &&
          "operation_id" in interaction &&
          "operation_name" in interaction &&
          "trigger_time" in interaction &&
          "trigger_data" in interaction &&
          "result_time" in interaction &&
          "result_data" in interaction &&
          "updates" in interaction
          );
}
