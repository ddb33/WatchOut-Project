import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = localStorage.getItem('currentUser');
    
    if (user) {
      // User is logged in, allow access
      return true;
    } else {
      // No user found, redirect to login
      alert('You must be logged in to access this page.');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
