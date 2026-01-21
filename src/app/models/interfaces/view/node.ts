import {Operation} from './operation';

export interface Node {
  id: string;
  name: string;
  parents: string[];
  children: Node[];
  states: string[];
  operations: Operation[];

  parentNode?: Node;
  layerIndex?: number;
}
