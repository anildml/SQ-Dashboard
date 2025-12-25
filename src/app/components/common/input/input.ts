import {
  Component,
  computed,
  effect, ElementRef,
  input,
  InputSignal, model,
  output, Signal,
  signal, viewChild,
  WritableSignal
} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [
    MatIconModule,
    FormsModule
  ],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class InputComponent {

  value: InputSignal<string> = input<string>("");
  bold: InputSignal<boolean> = input<boolean>(false);
  isEditable: InputSignal<boolean> = input<boolean>(true);
  isDeletable: InputSignal<boolean> = input<boolean>(false);
  isSelected: InputSignal<boolean> = input<boolean>(false);
  placeholder: InputSignal<string> = input<string>("");

  editMode: WritableSignal<boolean> = signal<boolean>(false);
  previousValue: WritableSignal<string> = signal<string>("");
  currentValue: WritableSignal<string> = model<string>("");
  selectionMode: WritableSignal<boolean> = signal<boolean>(false);
  isDirty: WritableSignal<boolean> = signal<boolean>(false);

  showEditButton: Signal<boolean> = computed(() => !this.editMode());
  showCompleteButton: Signal<boolean> = computed(() => this.editMode() && this.currentValue() != "");
  showCancelButton: Signal<boolean> = computed(() => this.editMode() && this.currentValue() != "");
  showDeleteButton: Signal<boolean> = computed(() => this.isDeletable());
  showSelectedRadioButton: Signal<boolean> = computed(() => this.selectionMode() && this.isSelected());
  showUnselectedRadioButton: Signal<boolean> = computed(() => this.selectionMode() && !this.isSelected());

  valueEdit = output<string>();
  editClick = output<void>();
  exitEditMode = output<string>();
  deleteClick = output<void>();

  constructor() {
    effect(() => {
      this.previousValue.set(this.value());
      this.currentValue.set(this.value());
    });
  }

  _enterEditMode() {
    this.isDirty.set(true);
    if (this.isEditable()) {
      this.editMode.set(true);
    } else {
      this.editClick.emit();
    }
  }

  _exitEditMode(saveValue: boolean) {
    if (saveValue) {
      this.previousValue.set(this.currentValue());
      this.valueEdit.emit(this.currentValue());
    } else {
      this.currentValue.set(this.previousValue());
    }
    this.editMode.set(false);
    this.exitEditMode.emit(this.currentValue());
  }

  _deleteClicked() {
    this.deleteClick.emit();
  }

}
