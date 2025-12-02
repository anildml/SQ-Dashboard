import {Component, Input} from '@angular/core';
import {Session} from '../../models/interfaces/session';
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

  @Input("session")
  session!: Session;

}
