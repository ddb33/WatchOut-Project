import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule], // CommonModule is needed for *ngFor
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  movies: any[] = []; // Store the movies here

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchMovies();
  }

  fetchMovies() {
  console.log('Step 1: Fetching movies initiated...'); // Log 1

  this.http.get<any[]>(`${environment.apiUrl}/movies`)
    .subscribe({
      next: (data) => {
        console.log('Step 2: Data received from Backend:', data); // Log 2
        this.movies = data;
        console.log('Step 3: Movies array updated. Length is now:', this.movies.length); // Log 3
      },
      error: (err) => {
        console.error('Step 2 (ERROR): Failed to fetch movies!', err); // Log Error
      }
    });
} 

  onLogout() {
    this.router.navigate(['/login']);
  }
}
