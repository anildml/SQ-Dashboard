import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Flow, isFlow} from "../../models/interfaces/flow";
import {Event} from "../../models/interfaces/event";
import {Interaction, isInteraction} from "../../models/interfaces/interaction";

@Component({
  selector: 'app-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class FlowComponent implements OnInit {

  @Input("flow")
  flow: Flow;

  ngOnInit(): void {

  }

  isFlow(event: Event): boolean {
    return isFlow(event);
  }

  isInteraction(event: Event): boolean {
    return isInteraction(event);
  }

  eventAsFlow(event: Event): Flow {
    return event as Flow;
  }

  eventAsInteraction(event: Event): Interaction {
    return event as Interaction;
  }

}
