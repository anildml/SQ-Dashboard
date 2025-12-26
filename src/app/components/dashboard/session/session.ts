import {Component, input, InputSignal} from '@angular/core';
import {Session} from '../../../models/interfaces/session';
import {FlowComponent} from '../flow/flow';

@Component({
  selector: 'app-session',
  imports: [
    FlowComponent
  ],
  templateUrl: './session.html',
  styleUrl: './session.scss',
})
export class SessionComponent {

  session: InputSignal<Session> = input.required<Session>()

}
