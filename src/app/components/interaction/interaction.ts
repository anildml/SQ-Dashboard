import {Component, Input} from '@angular/core';
import {Interaction} from '../../models/interfaces/interaction';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-interaction',
  imports: [],
  templateUrl: './interaction.html',
  styleUrl: './interaction.scss',
})
export class InteractionComponent {

  @Input("interaction")
  interaction!: Interaction;

  constructor(
    private datePipe: DatePipe
  ) {

  }

  getFormattedDateTime(date: string): string {
    let dateString = this.datePipe.transform(new Date(date), "dd-MM-yyyy");
    let timeString = this.datePipe.transform(new Date(date), "hh:mm:ss");
    dateString = dateString === null ? "dd-MM-yyyy" : dateString;
    timeString = timeString === null ? "hh-mm-ss" : timeString;
    return dateString + "  -  " + timeString;
  }

}
