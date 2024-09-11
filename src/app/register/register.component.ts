import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
})
export class RegisterComponent {
  registerForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern(/^[a-zA-Z0-9]+$/), // Alphanumeric
        ],
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^[\x20-\x7E]*$/), // ASCII characters
          Validators.pattern(/^[^:]*$/), // Excludes ':'
        ],
      ],
      email: ["", [Validators.required, Validators.email]],
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[\x20-\x7E]*$/), // ASCII characters
        ],
      ],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log("Form Submitted", this.registerForm.value);
    }
  }
}
