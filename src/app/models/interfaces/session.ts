import { Flow } from "./flow";
import { Interaction } from "./interaction";

export interface Session {
  client_trace: string;
  starter_node_id: string;
  start_time: string,
  end_time: string,
  events: (Flow | Interaction)[],
  state_map_history: any[]
}
