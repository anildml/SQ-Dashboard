import {Flow} from "./flow";

export interface Session extends Flow {
  client_id: string;
  client_name: string;
}

