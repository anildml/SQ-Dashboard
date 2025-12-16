import {Component} from '@angular/core';
import {Node} from '../../models/interfaces/node';
import {NodeTreeComponent} from './node-tree/node-tree';

@Component({
  selector: 'app-admin',
  imports: [
    NodeTreeComponent
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AdminComponent {

  constructor() {
  }

  getRootNode(): Node {
    let a: Node = {
      "id": "691ae106a7adf91a70f76791",
      "name": "root",
      "parents": [],
      "children": [
        {
          "id": "691ae155a7adf91a70f76792",
          "name": "Ana Ekran",
          "parents": [
            "691ae106a7adf91a70f76791"
          ],
          "children": [
            {
              "id": "691ae464d539009f0a8f8bff",
              "name": "Restoran Arama",
              "parents": [
                "691ae106a7adf91a70f76792"
              ],
              "children": [
                {
                  "id": "691ae4d3d539009f0a8f8c00",
                  "name": "Restoran Ekrani",
                  "parents": [
                    "691ae464d539009f0a8f8bff"
                  ],
                  "children": [],
                  "state_list": [],
                  "operation_list": []
                }
              ],
              "state_list": [
                "arama_kriterleri"
              ],
              "operation_list": [
                {
                  "id": "691b01196dda601803c1cf68",
                  "name": "Restoran Ara - Arama",
                  "update_schema_list": [
                    {
                      "node_id": "691ae155a7adf91a70f76792",
                      "effected_states": [
                        "restoran_listesi"
                      ]
                    }
                  ]
                },
                {
                  "id": "691b01196dda601803c1cf12",
                  "name": "Restoran Ara - Aramama",
                  "update_schema_list": [
                    {
                      "node_id": "691ae155a7adf91a70f76792",
                      "effected_states": [
                        "restoran_listesi"
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "id": "691ae4d3d539009f0a8f8c08",
              "name": "Hesap Yonetme Ekrani",
              "parents": [
                "691ae464d539009f0a8f8bff"
              ],
              "children": [
                {
                  "id": "691ae4d3d539009f0a8f8c09",
                  "name": "Gizlilik Ayarlari",
                  "parents": [
                    "691ae4d3d539009f0a8f8c08"
                  ],
                  "children": [],
                  "state_list": [],
                  "operation_list": []
                }
              ],
              "state_list": [],
              "operation_list": []
            }
          ],
          "state_list": [
            "restoran_listesi"
          ],
          "operation_list": []
        }
      ],
      "state_list": [],
      "operation_list": []
    };
    return a;
  }

}
