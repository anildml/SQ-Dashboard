import {Interaction} from "./interaction";

export interface Flow {
  node_id: string;
  start_time: string,
  end_time: string,
  events: Flow | Interaction[]
  state_map_history: any[]
}
