import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuthService } from "../service/auth.service";
import { ApiService } from "../service/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  standalone: true,
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
  imports: [ReactiveFormsModule, CommonModule],
})
export class LoginComponent {
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
  ) {}

  loginForm = new FormGroup({
    username: new FormControl("", [
      Validators.required, // Required field
      Validators.minLength(3), // Minimum length 3
      Validators.maxLength(20), // Maximum length 20
      Validators.pattern("^[a-zA-Z0-9]+$"), // Alphanumeric only
    ]),
    password: new FormControl("", [
      Validators.required, // Required field
      Validators.minLength(8), // Minimum length 8
      Validators.pattern("^[\x20-\x7E]+$"), // ASCII characters only
      Validators.pattern("^[^:]*$"), // Exclude ':' character
    ]),
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      if (!username || !password)
        return this.loginForm.setErrors({ invalid: true });
      this.apiService
        .login(username, password)
        .then((res) => {
          this.authService.user = res.user;
          this.authService.bets = res.bets;
          this.router.navigate(["/home"]);
        })
        .catch((e) => {
          console.log("Login failed");
          return this.loginForm.setErrors({ invalid: true });
        });
    } else {
      console.log("Form is invalid");
    }
  }
}
