import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import {  Router, RouterLink } from '@angular/router';
import { LoaderComponent } from "../utility/loader/loader.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,  LoaderComponent, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  username: string = '';
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  isLoading: boolean = false;
  isLoginMode: boolean = true;
  loginstatus: boolean = false;
  isError: boolean = false
  errorMessage: string | null = null;
  isSuccess: boolean = false
  successMessage: string | null = null;
  isPasswordVisible = false;

  constructor(private authService: AuthService, private route : Router) { }

  onLoginSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onLoginFormSubmit(form: NgForm) {
    this.isLoading = true;
    const { username, email, password } = form.value;

    if (username == '' || email == '' || password == '') {
      this.isError = true
      this.errorMessage = "Please fill all fields";
      setTimeout(() => {
        this.errorMessage = null;
        this.isError = false;
      }, 5000);
      return;
    }

    if (this.rememberMe) {
      localStorage.setItem('username', this.username);
      localStorage.setItem('email', this.email);
    } 
    else {
      localStorage.removeItem('username');
      localStorage.removeItem('email');
    }

    if (this.isLoginMode) {
      this.authService.login(email, password).subscribe({
        next: () => {
          this.loginstatus = true;
          this.isLoading = false;
          if (this.loginstatus) {
            this.isSuccess = true
            this.successMessage = "Login successful";
            this.route.navigate(['/user'])
            setTimeout(() => {
              this.successMessage = null;
              this.isSuccess = false;
            }, 3000);
          }
        },
        error: (errorMsg: string) => {
          this.isError = true
          this.isLoading = false;
          this.errorMessage = errorMsg;
          setTimeout(() => {
            this.errorMessage = null;
            this.isError = false
          }, 5000);
        },
      });
    }
  }

  showPassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  ngOnInit(): void { 
    const savedUsername = localStorage.getItem('username');
    const savedEmail = localStorage.getItem('email');

    if (savedUsername && savedEmail) {
      this.username = savedUsername;
      this.email = savedEmail;
      this.rememberMe = true; 
    }
  }
}
