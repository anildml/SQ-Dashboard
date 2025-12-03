import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Node } from './node';

describe('Node', () => {
  let component: Node;
  let fixture: ComponentFixture<Node>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Node]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Node);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
