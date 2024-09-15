import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { ApiService } from "../service/api.service";

@Component({
  selector: "app-create",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./create.component.html",
  styleUrl: "./create.component.css",
})
export class CreateComponent {
  createBetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
  ) {
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
      endsAt: [
        new Date().toISOString().split(".")[0],
        [Validators.required, this.validateDate()],
      ],
    });
  }

  ngOnInit() {
    window.addEventListener("beforeunload", (event) => {
      const confirmMsg = "o/";
      event.preventDefault();
      event.returnValue = confirmMsg;
      return confirmMsg;
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
      console.log(this.createBetForm.value);
      console.log(new Date(this.createBetForm.get("endsAt")?.value));
      const newBet = {
        ...this.createBetForm.value,
        endsAt: new Date(this.createBetForm.get("endsAt")?.value),
      };
      this.apiService
        .createBet(newBet)
        .then((res) => {
          console.log("Bet created successfully");
        })
        .catch((e) => {
          console.log("Failed to create bet ", e);
        });
    }
  }

  private validateDate() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      console.log(value);

      if (!value) {
        return null;
      }

      const timestamp = Date.parse(value);
      if (!isNaN(timestamp) == false) {
        return { invalidDate: true };
      }

      const date = new Date(value);
      const now = new Date();

      if (value && date < now) {
        return { pastDate: true };
      }

      // Check if date is at least 1 day in the future
      const diff = date.getTime() - now.getTime();
      const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
      if (diffDays < 1) {
        return { minDate: true };
      } else if (diffDays > 14) {
        return { maxDate: true };
      }

      console.log("Passed");

      return null;
    };
  }
}
