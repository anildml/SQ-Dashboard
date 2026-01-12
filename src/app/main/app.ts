import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {DatePipe} from '@angular/common';
import {Session} from '../models/view/session';
import {AdminComponent} from '../components/admin/admin';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    AdminComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [
    DatePipe
  ]
})
export class App {

  protected readonly title = signal('SQ Dashboard');

  session: Session = {
    "client_name": "temp",
    "node_name": "Ana Ekran",
    "start_time": "2025-11-17T12:24:59.26Z",
    "end_time": "2025-11-17T13:03:15.471Z",
    "events": [
      {
        "node_name": "Restoran Ekrani",
        "start_time": "2025-11-17T13:00:23.615Z",
        "end_time": "2025-11-17T13:01:35.809Z",
        "events": [],
        "state_map_history": []
      },
      {
        "node_name": "Restoran Arama",
        "start_time": "2025-11-17T12:30:21.918Z",
        "end_time": "2025-11-17T13:02:30.185Z",
        "events": [
          {
            "operation_name": "Arama()",
            "trigger_time": "2025-11-17T12:52:15.193Z",
            "trigger_data": {
              "restoran_adi": "beyzade kebap"
            },
            "result_time": "2025-11-17T12:55:34.266Z",
            "result_data": [
              {
                "node_name": "Ana Ekran",
                "updated_states": {
                  "restoran_listesi": [
                    "kebap 9, damak kebap"
                  ]
                }
              }
            ]
          },
          {
            "node_name": "Restoran Ekrani",
            "start_time": "2025-11-17T13:00:23.615Z",
            "end_time": "2025-11-17T13:01:35.809Z",
            "events": [
              {
                "node_name": "Restoran Ekrani",
                "start_time": "2025-11-17T13:00:23.615Z",
                "end_time": "2025-11-17T13:01:35.809Z",
                "events": [],
                "state_map_history": []
              },
              {
                "node_name": "Restoran Ekrani",
                "start_time": "2025-11-17T13:00:23.615Z",
                "end_time": "2025-11-17T13:01:35.809Z",
                "events": [
                  {
                    "node_name": "Restoran Ekrani",
                    "start_time": "2025-11-17T13:00:23.615Z",
                    "end_time": "2025-11-17T13:01:35.809Z",
                    "events": [],
                    "state_map_history": []
                  },
                  {
                    "node_name": "Restoran Ekrani",
                    "start_time": "2025-11-17T13:00:23.615Z",
                    "end_time": "2025-11-17T13:01:35.809Z",
                    "events": [],
                    "state_map_history": []
                  }
                ],
                "state_map_history": []
              }
            ],
            "state_map_history": []
          },
          {
            "node_name": "Restoran Ekrani",
            "start_time": "2025-11-17T13:00:23.615Z",
            "end_time": "2025-11-17T13:01:35.809Z",
            "events": [],
            "state_map_history": []
          }
        ],
        "state_map_history": []
      }
    ],
    "state_map_history": [
      {
        "restoran_listesi": [
          "kebap 9, damak kebap"
        ]
      }
    ]
  };

}
