import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-create",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./create.component.html",
  styleUrl: "./create.component.css",
})
export class CreateComponent {
  createBetForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.createBetForm = this.fb.group({
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      description: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      betOptions: this.fb.array([], [Validators.required]),
      inputBet: ["", [Validators.required, Validators.min(1)]],
      inputOption: ["", [Validators.required]],
      endsAt: ["", [Validators.required]],
    });
  }

  get betOptions(): FormArray {
    return this.createBetForm.get("betOptions") as FormArray;
  }

  addOption(): void {
    this.betOptions.push(
      this.fb.control("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
    );
  }

  onSubmit(): void {
    if (this.createBetForm.valid) {
      // Handle form submission
    }
  }
}
