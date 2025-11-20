import {Component, Input, signal} from '@angular/core';
import {Flow, isFlow} from '../../models/interfaces/flow';
import {DatePipe} from '@angular/common';
import {Session} from '../../models/interfaces/session';
import {Event} from '../../models/interfaces/event';
import {Interaction, isInteraction} from '../../models/interfaces/interaction';
import {InteractionComponent} from '../interaction/interaction';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-flow',
  imports: [
    InteractionComponent,
    MatExpansionModule
  ],
  templateUrl: './flow.html',
  styleUrl: './flow.scss'
})
export class FlowComponent {


  @Input("flow")
  flow!: Flow | Session;

  panelOpenState = signal(false);

  constructor(
    private datePipe: DatePipe
  ) {
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

  getFormattedDateTime(date: string): string {
    let dateString = this.datePipe.transform(new Date(date), "dd-MM-yyyy");
    let timeString = this.datePipe.transform(new Date(date), "hh:mm:ss");
    dateString = dateString === null ? "dd-MM-yyyy" : dateString;
    timeString = timeString === null ? "hh-mm-ss" : timeString;
    return dateString + "  -  " + timeString;
  }

}
