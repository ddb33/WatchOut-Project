import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';

  constructor(private router: Router, private http: HttpClient) {}

  onRegister() {
    const userData = { username: this.username, email: this.email, password: this.password };
    
    // Send data to your Backend VM (.20)
    this.http.post('http://192.168.50.20:5000/api/auth/register', userData).subscribe({
      next: (res) => {
        alert('Registration Successful!');
        this.router.navigate(['/login']); // This handles the redirection
      },
      error: (err) => alert('Registration failed. Check if Backend VM is running.')
    });
  }
}
