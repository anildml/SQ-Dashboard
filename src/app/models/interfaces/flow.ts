import {Event} from "./event";

export interface Flow extends Event {
  _id: string;
  node_id: string;
  node_name: string;
  start_time: string;
  end_time: string;
  events: Event [];
  state_map_history: any[];
}

export function isFlow(flow: Event) {
  return (
          "_id" in flow &&
          "node_id" in flow &&
          "node_name" in flow &&
          "start_time" in flow &&
          "end_time" in flow &&
          "events" in flow &&
          "state_map_history" in flow
          );
}
