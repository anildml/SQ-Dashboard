import {Flow} from "./flow";

export interface Session extends Flow {
  client_id: string;
  client_name: string;
}

//export function isSession(event: Event) {
//  return (
//    "_id" in event &&
//    "client_id" in event &&
//    "starter_node_id" in event &&
//    "start_time" in event &&
//    "end_time" in event &&
//    "events" in event &&
//    "state_map_history" in event
//    );
//}
