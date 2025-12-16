import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {
  // We use 'email' here to match the form input and the backend expectation
  email = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    // 1. Create the payload exactly how the backend wants it
    const loginData = {
      email: this.email,     // <--- THIS WAS THE FIX (Changed from username to email)
      password: this.password
    };

    // 2. Send it to the Backend
    this.http.post<any>('http://192.168.50.20:3000/login', loginData).subscribe({
      next: (response) => {
        console.log('Login successful!', response);
        // Redirect to dashboard on success
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorMessage = 'Login Failed. Please check your email and password.';
      }
    });
  }
}
