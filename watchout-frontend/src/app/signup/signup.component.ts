import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // For the link back to login
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['../login/login.component.css'] // Reuse Login CSS
})
export class SignupComponent {
  email = '';
  password = '';
  message = '';

  constructor(private http: HttpClient) {}

  onSignup() {
    const userData = { email: this.email, password: this.password };

    // Send request to a NEW route '/register'
    this.http.post<any>(`${environment.apiUrl}/register`, userData)
      .subscribe({
        next: (res) => this.message = 'Account created! Please Log In.',
        error: (err) => this.message = 'Error: ' + (err.error.message || 'Signup Failed')
      });
  }
}
