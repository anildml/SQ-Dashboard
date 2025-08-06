import {Event} from "./event";

export interface Session {
  _id: string;
  client_id: string;
  client_name: string;
  starter_node_id: string;
  starter_node_name: string;
  start_time: string,
  end_time: string,
  events: Event [],
  state_map_history: any[]
}

export function isSession(event: Event) {
  return (
    "client" in event &&
    "starter_node_id" in event &&
    "start_time" in event &&
    "end_time" in event &&
    "events" in event &&
    "state_map_history" in event
    );
}

