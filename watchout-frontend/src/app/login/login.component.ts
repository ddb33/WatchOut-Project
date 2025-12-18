import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private router: Router, private http: HttpClient) {}

  onLogin() {
    const credentials = { email: this.email, password: this.password };

    // Post to Backend VM (.20)
    this.http.post('http://192.168.50.20:5000/api/auth/login', credentials).subscribe({
      next: (res: any) => {
        // Essential for "Must Be Logged in to Track Movies"
        localStorage.setItem('currentUser', JSON.stringify({ 
          email: res.email, 
          username: res.username 
        }));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        alert('Invalid email or password.');
        console.error('Login error:', err);
      }
    });
  }
}
