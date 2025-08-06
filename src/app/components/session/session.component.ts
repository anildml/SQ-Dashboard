import {Component, Input, OnInit} from '@angular/core';
import {Session} from "../../models/interfaces/session";

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent {

  @Input("session")
  session: Session;

}
