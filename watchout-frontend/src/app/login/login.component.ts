import { Component } from '@angular/core';
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

  constructor(private router: Router) {}

  onLogin() {
    // In a real app, this is where you check the password.
    // For now, we just redirect to the dashboard.
    console.log('Logging in with:', this.email);
    this.router.navigate(['/dashboard']);
  }
}
