import {Component, OnInit} from '@angular/core';
import {Session} from "../models/interfaces/session";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  session: Session = {
    "client_trace": "c1",
    "starter_node_id": "62f270e5f0d600a314de5113",
    "start_time": "2023-03-22T18:50:05.615Z",
    "end_time": "2023-03-22T18:59:46.592Z",
    "events": [
      {
        "node_id": "62f270e5f0d600a314de5116",
        "start_time": "2023-03-22T18:50:17.275Z",
        "end_time": "2023-03-22T18:51:27.451Z",
        "events": [],
        "state_map_history": [
          {}
        ]
      },
      {
        "node_id": "62f270e5f0d600a314de5116",
        "start_time": "2023-03-22T18:51:32.238Z",
        "end_time": "2023-03-22T18:58:26.001Z",
        "events": [
          {
            "operation_id": "62f39581bc8f00f5e625b54f",
            "trigger_time": "2023-03-22T18:51:49.677Z",
            "trigger_data": {
              "test": "hello"
            },
            "result_time": "2023-03-22T18:57:37.286Z",
            "result_data": {
              "test": "hello back"
            },
            "updates": [
              {
                "node_id": "62f270e5f0d600a314de5113",
                "updated_states": {
                  "sn1s1": "session update"
                }
              },
              {
                "node_id": "62f270e5f0d600a314de5116",
                "updated_states": {
                  "n2s1": "flow update"
                }
              }
            ]
          },
          {
            "operation_id": "62f39581bc8f00f5e625b54f",
            "trigger_time": "2023-03-22T18:57:57.98Z",
            "trigger_data": {
              "test": "hello"
            },
            "result_time": "2023-03-22T18:58:05.212Z",
            "result_data": {
              "test": "hello back"
            },
            "updates": [
              {
                "node_id": "62f270e5f0d600a314de5113",
                "updated_states": {
                  "sn1s1": "session update"
                }
              },
              {
                "node_id": "62f270e5f0d600a314de5116",
                "updated_states": {
                  "n2s1": "flow update"
                }
              }
            ]
          }
        ],
        "state_map_history": [
          {}
        ]
      },
      {
        "node_id": "62f270e5f0d600a314de5116",
        "start_time": "2023-03-22T18:58:28.754Z",
        "end_time": "2023-03-22T18:58:34.396Z",
        "events": [],
        "state_map_history": [
          {}
        ]
      }
    ],
    "state_map_history": [
      {}
    ]
  };

  title = 'SQ-Dashboard';

  ngOnInit(): void {

  }


}
