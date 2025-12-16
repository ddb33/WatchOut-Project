import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  username = ''; // <--- Added username field
  email = '';
  password = '';

  constructor(private router: Router) {}

  onRegister() {
    // Placeholder logic: Log the data and go to login page
    console.log('Registering user:', this.username, this.email);
    this.router.navigate(['/login']);
  }
}
