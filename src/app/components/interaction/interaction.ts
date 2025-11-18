import {Component, Input} from '@angular/core';
import {Interaction} from '../../models/interfaces/interaction';

@Component({
  selector: 'app-interaction',
  imports: [],
  templateUrl: './interaction.html',
  styleUrl: './interaction.scss',
})
export class InteractionComponent {

  @Input("interaction")
  interaction!: Interaction;

}
