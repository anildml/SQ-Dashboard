import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interaction } from './interaction';

describe('Interaction', () => {
  let component: Interaction;
  let fixture: ComponentFixture<Interaction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Interaction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Interaction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
