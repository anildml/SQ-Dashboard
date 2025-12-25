import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationDialog } from './operation-dialog';

describe('OperationDialog', () => {
  let component: OperationDialog;
  let fixture: ComponentFixture<OperationDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
