import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment.dev';
import {firstValueFrom} from 'rxjs';
import {Session} from '../../models/interfaces/api/session';
import {Client} from '../../models/interfaces/api/client';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  http: HttpClient = inject(HttpClient)

  async readSession(id: string): Promise<Session> {
    let url = "http://" + environment.service_url + "/v1/event/session/" + id;
    let options = {
      headers: {},
      params: {}
    };
    let response: any;
    try {
      response = await firstValueFrom(this.http.get<any>(url, options));
    } catch (e) {
      console.error("request failed", e);
    }
    if (!response.success) {
      console.error("request unsuccessful", response);
    }
    return response.session;
  }

  async searchClientById(id: string): Promise<Client[]> {
    let url = "http://" + environment.service_url + "/v1/event/client/search/id/" + name;
    let options = {
      headers: {},
      params: {}
    };
    let response: any;
    try {
      response = await firstValueFrom(this.http.get<any>(url, options));
    } catch (e) {
      console.error("request failed", e);
    }
    if (!response.success) {
      console.error("request unsuccessful", response);
    }
    return response.client_list;
  }

  async searchClientByName(name: string): Promise<Client[]> {
    let url = "http://" + environment.service_url + "/v1/event/client/search/name/" + name;
    let options = {
      headers: {},
      params: {}
    };
    let response: any;
    try {
      response = await firstValueFrom(this.http.get<any>(url, options));
    } catch (e) {
      console.error("request failed", e);
    }
    if (!response.success) {
      console.error("request unsuccessful", response);
    }
    return response.client_list;
  }

}
