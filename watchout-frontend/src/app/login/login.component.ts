
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
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    const loginData = { email: this.email, password: this.password };
    
    // Pointing to your .20 Backend VM
    this.http.post('http://192.168.50.20:5000/api/auth/login', loginData).subscribe({
      next: (response: any) => {
        // Save user session to localStorage
        localStorage.setItem('currentUser', JSON.stringify({
          username: response.username,
          email: response.email
        }));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // Specifically catch the 403 Forbidden for unverified users
        if (err.status === 403) {
          this.errorMessage = 'Account not verified. Check the backend terminal for the link.';
        } else {
          this.errorMessage = 'Invalid email or password.';
        }
      }
    });
  }
}
