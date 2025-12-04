import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- Critical Import
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,  // <--- Marks this as a standalone component
  imports: [CommonModule, FormsModule], // <--- Gives it access to ngModel
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';

  constructor(private http: HttpClient) {}

  onLogin() {
    console.log('1. Button was clicked!'); 
    
    const loginData = { email: this.email, password: this.password };
    console.log('2. Data to send:', loginData); 
    
    console.log('3. Sending request to:', `${environment.apiUrl}/login`);

    this.http.post<any>(`${environment.apiUrl}/login`, loginData)
      .subscribe({
        next: (res) => {
          console.log('4. SUCCESS:', res); 
          this.message = res.message;
        },
        error: (err) => {
          console.error('4. ERROR:', err);
          this.message = 'Login Failed: See Console';
        }
      });
    }
  }
