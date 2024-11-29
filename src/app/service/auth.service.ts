import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { AuthResponse } from '../model/authresponse';
import { SignUpDetail } from '../model/signupdetails';

@Injectable({
  providedIn: 'root', 
})
export class AuthService {
  constructor(private http: HttpClient) { }

  signup(email:string,password:string){
    const data = {email:email,password:password,returnSecureToken:true}
    return this.http.post<AuthResponse>
    ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCaINCH5XhfRiE2GYgSrIe4BwG81vtVpIs',data)
    .pipe(catchError(this.handleError))
  }

  login(email: string, password: string) {
    const data = { email: email, password: password, returnSecureToken: true };
    return this.http.post<AuthResponse>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCaINCH5XhfRiE2GYgSrIe4BwG81vtVpIs',
      data
    ).pipe
    (catchError(this.handleError));
  }

  usersignupdetails(name:string,email:string,password:string){
    const user = {name:name,email:email,password:password}

    return this.http.post<SignUpDetail>
    ('https://ovsauthentication-default-rtdb.firebaseio.com/user.json', user);
  }

  retrieveUserDetails() {
    return this.http.get<{ [key: string]: SignUpDetail }>('https://ovsauthentication-default-rtdb.firebaseio.com/user.json')
      .pipe(
        map(response => {
          const usersArray: SignUpDetail[] = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              usersArray.push(response[key]);
            }
          }
          return usersArray;
        }),
        catchError(this.handleError)
      );
  }
  

  private handleError(err: any) {
    let errorMessage = 'ERROR ! PLEASE TRY AGAIN';
    if (!err.error || !err.error.error) {
      return throwError(() => errorMessage);
    }
    switch (err.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'Email already exists';
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'This operation is not allowed';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Invalid password';
        break;
      case 'USER_DISABLED':
        errorMessage = 'User disabled';
        break;
    }
    return throwError(() => errorMessage);
  }
}
