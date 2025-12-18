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
    // Debugging: Check if the button is at least being clicked
    console.log('Login button clicked for:', this.email);

    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    const loginData = { email: this.email, password: this.password };
    
    // Request sent to your .20 Backend VM
    this.http.post('http://192.168.50.20:5000/api/auth/login', loginData).subscribe({
      next: (response: any) => {
        console.log('Login Success:', response);
        localStorage.setItem('currentUser', JSON.stringify({
          username: response.username,
          email: response.email
        }));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login Error:', err);
        if (err.status === 403) {
          this.errorMessage = 'Account not verified. Check backend terminal for link.';
        } else {
          this.errorMessage = 'Invalid email or password.';
        }
      }
    });
  }
}
