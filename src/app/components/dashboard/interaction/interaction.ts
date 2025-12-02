import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Interaction} from '../../../models/interfaces/interaction';
import {DatePipe} from '@angular/common';
import {MatExpansionModule, MatExpansionPanel} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {firstValueFrom} from 'rxjs';

export enum CONTENT_TYPE {
  TRIGGER,
  RESULT,
  EMPTY
}

@Component({
  selector: 'app-interaction',
  imports: [
    MatExpansionModule,
    MatButtonModule
  ],
  templateUrl: './interaction.html',
  styleUrl: './interaction.scss'
})
export class InteractionComponent implements OnInit {

  @Input("interaction")
  interaction!: Interaction;

  @ViewChild("panel")
  panel!: MatExpansionPanel;

  CONTENT_TYPE_ENUM = CONTENT_TYPE;
  contentType: CONTENT_TYPE = CONTENT_TYPE.EMPTY;

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

  async toggleInteractionContent(contentType: CONTENT_TYPE) {
    if (this.contentType === contentType) {
      this.panel.toggle();
    } else {
      if (this.panel.expanded) {
        this.panel.close();
        await firstValueFrom(this.panel.afterCollapse);
      }
      this.contentType = contentType;
      this.panel.open();
    }
  }

  getContentTime(): string {
    switch (this.contentType) {
      case CONTENT_TYPE.RESULT: {
        return this.getFormattedDateTime(this.interaction.result_time);
      }
      case CONTENT_TYPE.TRIGGER: {
        return this.getFormattedDateTime(this.interaction.trigger_time);
      }
      default: {
        return "";
      }
    }
  }

  getContentData(): string {
    switch (this.contentType) {
      case CONTENT_TYPE.RESULT: {
        return this.getPrettyJSONString(this.interaction.result_data);
      }
      case CONTENT_TYPE.TRIGGER: {
        return this.getPrettyJSONString(this.interaction.trigger_data);
      }
      default: {
        return "";
      }
    }
  }

}
