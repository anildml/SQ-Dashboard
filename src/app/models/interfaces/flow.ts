import {Interaction} from "./interaction";
import {Event} from "./event";
import {Session} from "./session";

export interface Flow extends Event {
  node_id: string;
  start_time: string,
  end_time: string,
  events: Event[]
  state_map_history: any[]
}

export function isFlow(event: Event): event is Flow {
  return (
          "node_id" in event &&
          "start_time" in event &&
          "end_time" in event &&
          "events" in event &&
          "state_map_history" in event
          );
}
