import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  message = '';

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    const user = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    // Note: Ensure this IP matches your Backend VM IP
    this.http.post<any>('http://192.168.50.20:3000/register', user).subscribe({
      next: (res) => {
        alert('Registration Successful! Please Login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        this.message = 'Registration Failed. Check console/backend.';
      }
    });
  }
}
