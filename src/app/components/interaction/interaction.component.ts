import { Component, Input, OnInit } from '@angular/core';
import {Interaction} from "../../models/interfaces/interaction";

@Component({
  selector: 'app-interaction',
  templateUrl: './interaction.component.html',
  styleUrls: ['./interaction.component.scss']
})
export class InteractionComponent {

  @Input("interaction")
  interaction: Interaction;

}
