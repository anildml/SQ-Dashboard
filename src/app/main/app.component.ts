import {Component, OnInit} from '@angular/core';
import {Session} from "../models/interfaces/session";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  session: Session = {
    "_id": "6888c8aa886b6ad40291fb05",
    "client_id": "685d0e6e9dcf1a774e23a5aa",
    "client_name": "user(anily)",
    "node_id": "685be7058eed05e00fe0edb1",
    "node_name": "Ana Ekran",
    "start_time": "2025-07-29T13:12:10.031Z",
    "end_time": "2025-07-29T13:29:01.943Z",
    "events": [
      {
        "_id": "6888c8d5886b6ad40291fb06",
        "node_id": "686cffcb3eeec175693f944a",
        "node_name": "Restoran Arama Ekrani",
        "start_time": "2025-07-29T13:12:53.011Z",
        "end_time": "2025-07-29T13:28:46.242Z",
        "events": [
          {
            "_id": "6888cbac6756e169044da5ba",
            "operation_id": "686d0d9d6abf12c5a9c8a7fb",
            "operation_name": "restoran_ara",
            "trigger_time": "2025-07-29T13:25:00.494Z",
            "trigger_data": {
              "restoran_adi": "kebap"
            },
            "result_time": "2025-07-29T13:26:10.481Z",
            "result_data": {
              "restoran_listesi": [
                "kebap 9, damak kebap"
              ]
            },
            "updates": [
              {
                "flow_anchor": "6888c8d5886b6ad40291fb06",
                "node_id": "686cffcb3eeec175693f944a",
                "node_name": "Restoran Arama Ekrani",
                "updated_states": {
                  "restoran_listesi": "kebap listesi gelecek buraya, yada updated_states listeye cevirilecek"
                }
              }
            ]
          },
          {
            "_id": "6888cc336756e169044da5bb",
            "node_id": "688770793eeec175693f948b",
            "node_name": "Restoran Ekrani",
            "start_time": "2025-07-29T13:27:14.815Z",
            "end_time": "2025-07-29T13:27:41.734Z",
            "events": [],
            "state_map_history": []
          }
        ],
        "state_map_history": [
          {
            "restoran_listesi": "flow update"
          },
          {
            "restoran_listesi": "kebap listesi gelecek buraya, yada updated_states listeye cevirilecek"
          }
        ]
      }
    ],
    "state_map_history": []
  };

  title = 'SQ-Dashboard';

  ngOnInit(): void {

  }


}
