import { Flow } from "./flow";
import { Interaction } from "./interaction";
import {Event} from "./event";

export interface Session {
  client_trace: string;
  starter_node_id: string;
  start_time: string,
  end_time: string,
  events: Event[],
  state_map_history: any[]
}

export function isSession(event: Event): event is Session {
  return (
    "client_trace" in event &&
    "starter_node_id" in event &&
    "start_time" in event &&
    "end_time" in event &&
    "events" in event &&
    "state_map_history" in event
    );
}

