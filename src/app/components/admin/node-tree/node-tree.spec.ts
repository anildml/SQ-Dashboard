import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeTree } from './node-tree';

describe('NodeTree', () => {
  let component: NodeTree;
  let fixture: ComponentFixture<NodeTree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodeTree]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodeTree);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
