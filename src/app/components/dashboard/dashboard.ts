import {Component, model} from '@angular/core';
import {MatFormField, MatInputModule, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    FormsModule,
    MatInputModule,
    MatIcon
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {

  searchTypes = ["ID", "Name"];
  searchType = model(this.searchTypes[0]);
  searchValue = model("");

  searchClient() {

  }

}
