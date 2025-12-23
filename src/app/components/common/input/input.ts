import {Component, input, Input, InputSignal, OnInit, output, signal, WritableSignal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-input',
  imports: [
    MatIconModule
  ],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class InputComponent implements OnInit{

  value: InputSignal<string> = input<string>("");

  disabled: WritableSignal<boolean> = signal<boolean>(true);
  currentValue: WritableSignal<string> = signal<string>("");
  valueEdited = output<string>();

  ngOnInit(): void {
    this.currentValue.set(this.value());
  }

  enterEditMode() {
    this.disabled.set(false);
  }

  exitEditMode(saveValue: boolean, val: any) {
    this.disabled.set(true);
    if (saveValue) {
      this.currentValue.set(val.value);
      this.valueEdited.emit(this.currentValue());
    } else {
      val.value = this.currentValue();
    }
  }

}
