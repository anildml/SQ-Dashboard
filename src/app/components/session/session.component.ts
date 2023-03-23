import {Component, Input, OnInit} from '@angular/core';
import {Flow, isFlow} from 'src/app/models/interfaces/flow';
import {isSession, Session} from "../../models/interfaces/session";

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {

  @Input("session")
  session: Session;

  flow: Flow;

  temp: Flow;

  ngOnInit(): void {

    this.flow = {
      node_id: this.session.starter_node_id,
      start_time: this.session.start_time,
      end_time: this.session.end_time,
      events: this.session.events,
      state_map_history: this.session.state_map_history
    }

    console.log(this.session);

//    console.log(isSession(this.session));
//    console.log(isFlow(this.session));
//
//    console.log(isSession(this.flow));
//    console.log(isFlow(this.flow));

  }

}
