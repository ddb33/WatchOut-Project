import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router'; // <--- 1. Import Router

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';

  // 2. Inject Router in the constructor
  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    const loginData = { email: this.email, password: this.password };
    
    this.http.post<any>(`${environment.apiUrl}/login`, loginData)
      .subscribe({
        next: (res) => {
          this.message = res.message;
          // 3. Redirect to dashboard on success!
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 500); // Small delay so user sees "Success" message briefly
        },
        error: (err) => {
          this.message = 'Login Failed: ' + (err.error.message || 'Check Backend Connection');
        }
      });
  }
}
