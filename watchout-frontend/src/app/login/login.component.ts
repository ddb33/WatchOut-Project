import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = ''; // Added to fix the TS2339 error

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    this.errorMessage = ''; // Clear previous errors

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post('http://192.168.50.20:5000/api/auth/login', loginData)
      .subscribe({
        next: (user: any) => {
          // Store user in localStorage for AuthGuard
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          // Capture backend error message and display in template
          this.errorMessage = err.error?.error || 'Login failed. Please try again.';
        }
      });
  }
}
