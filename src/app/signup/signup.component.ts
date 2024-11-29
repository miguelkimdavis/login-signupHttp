import { Component } from '@angular/core';
import { LoaderComponent } from "../utility/loader/loader.component";
import { AuthService } from '../service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [LoaderComponent, CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  isLoading: boolean = false;
  isSignupMode: boolean = true;
  signupstatus: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSuccess: boolean = false;
  isError: boolean = false;
  isPasswordVisible: boolean = false;

  onSignupSwitchMode() {
    this.isSignupMode = !this.isSignupMode;
  }

  onSignupFormSubmit(form: NgForm) {

    if (this.isError || this.isLoading) {
      return;
    }

    this.isLoading = true;
    const name = form.value.name;
    const registrationNumber = form.value.registrationNumber;
    const email = form.value.email;
    const password = form.value.password;
    const confirmPassword = form.value.confirmPassword; 

    if (name === "" || registrationNumber === "" || email === "" || password === "") {
      this.errorMessage = "Please Fill All Fields";
      this.isError = true;
      setTimeout(() => {
        this.errorMessage = null;
        this.isError = false;
      }, 5000);
      this.isLoading = false; 
      return;
    }

    if (confirmPassword !== password) {
      this.isError = true;
      this.errorMessage = "Password Does Not Match";
      setTimeout(() => {
        this.isError = false;
      }, 5000);
      this.isLoading = false; 
      return; 
    }

    if (this.isSignupMode) {       
      this.authservice.signup(email, password).subscribe({
        next: (res) => {
          this.authservice.usersignupdetails(name, email, password)
            .subscribe({
              next: () => {
                this.isLoading = false;
                this.signupstatus = true;
                if (this.signupstatus) {
                  this.isSuccess = true;
                  this.successMessage = "Signup Was Successful. Please Login To Continue";
                  setTimeout(() => {
                    this.successMessage = null;
                    this.isSuccess = false;
                  }, 5000);
                }
                this.route.navigate(['/login']);
              },
              error: () => {
                this.isLoading = false;
              }
            });
        },
        error: (errorMsg: string) => {
          this.isLoading = false;
          this.errorMessage = errorMsg;
          this.isError = true;
          setTimeout(() => {
            this.errorMessage = null;
            this.isError = false;
          }, 5000);
        },
      });
    }
  }

  showPassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  constructor(private route: Router, private authservice: AuthService) {}

  ngOnInit(): void {}
}
