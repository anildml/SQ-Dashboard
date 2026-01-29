import {Component, inject, model, signal, WritableSignal} from '@angular/core';
import {MatFormField, MatInputModule, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {SessionComponent} from './session/session';
import {Session} from '../../models/interfaces/api/session';
import {DashboardService} from '../../services/dashboard-service/dashboard-service';
import {Client} from '../../models/interfaces/api/client';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    FormsModule,
    MatInputModule,
    MatIcon,
    SessionComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {

  dashboardService: DashboardService = inject(DashboardService);

  searchTypes = ["ID", "Name"];
  searchType = model(this.searchTypes[0]);
  searchValue = model("");

  clientList: WritableSignal<Client[]> = signal([]);
  selectedClient: WritableSignal<Client | undefined> = signal(undefined);
  sessionList: WritableSignal<Session[]> = signal([]);

  async searchClient() {
    if (this.searchType() == "ID") {
      this.clientList.set(await this.dashboardService.searchClientById(this.searchValue()));
      this.selectedClient.set(this.clientList()[0]);
    }
    if (this.searchType() == "Name") {
      this.clientList.set(await this.dashboardService.searchClientByName(this.searchValue()));
    }
    this.selectClient("c1");
    let sessionId = this.selectedClient()!.session_ids.at(0)!;
    this.sessionList.set([await this.dashboardService.readSession(sessionId)]);
  }

  selectClient(name: string) {
    this.selectedClient.set(this.clientList().find(c => c.name == name));
  }

}
