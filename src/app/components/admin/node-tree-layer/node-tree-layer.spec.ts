import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeTreeLayer } from './node-tree-layer';

describe('NodeTreeLayer', () => {
  let component: NodeTreeLayer;
  let fixture: ComponentFixture<NodeTreeLayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodeTreeLayer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodeTreeLayer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
