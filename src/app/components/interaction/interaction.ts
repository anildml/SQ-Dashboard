import {Component, Input, OnInit} from '@angular/core';
import {Interaction} from '../../models/interfaces/interaction';
import {DatePipe} from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-interaction',
  imports: [
    MatExpansionModule
  ],
  templateUrl: './interaction.html',
  styleUrl: './interaction.scss'
})
export class InteractionComponent implements OnInit {

  @Input("interaction")
  interaction!: Interaction;

  constructor(
    private datePipe: DatePipe
  ) {

  }

  ngOnInit(): void {

  }

  getPrettyJSONString(t: object): string {
    return JSON.stringify(t, null, 2);
  }

  getFormattedDateTime(date: string): string {
    let dateString = this.datePipe.transform(new Date(date), "dd-MM-yyyy");
    let timeString = this.datePipe.transform(new Date(date), "hh:mm:ss");
    dateString = dateString === null ? "dd-MM-yyyy" : dateString;
    timeString = timeString === null ? "hh-mm-ss" : timeString;
    return dateString + "  -  " + timeString;
  }

}
