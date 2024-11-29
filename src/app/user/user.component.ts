import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpDetail } from '../model/signupdetails';
import { LoaderComponent } from "../utility/loader/loader.component";
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  isLoading: boolean = false;
  users: SignUpDetail[] = [];
  isError: boolean = false
  errorMessage: string | null = null;
  isSuccess: boolean = false
  successMessage: string | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loadUsers(); 
  }

  loadUsers() {
    this.isLoading = true; 
    this.authService.retrieveUserDetails().subscribe({
      next: (data: SignUpDetail[]) => {
        this.users = data;  
        console.log(this.users);
        this.isLoading = false; 
      },
      error: (error: string) => {
        this.errorMessage = error; 
        this.isError = true;
        this.isLoading = false; 
        setTimeout(() => {
          this.errorMessage = null;
          this.isError = false;
        }, 5000);
      }
    });
  }
}
