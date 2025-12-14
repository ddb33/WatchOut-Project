import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  movies: any[] = [];     // Currently visible movies
  allMovies: any[] = [];  // Master list of ALL movies

  constructor(
    private http: HttpClient, 
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.fetchMovies();
  }

  fetchMovies() {
    this.http.get<any[]>(`${environment.apiUrl}/movies`)
      .subscribe({
        next: (data) => {
          this.allMovies = data; // Save master copy
          this.movies = data;    // Show all
          this.cdr.detectChanges(); // <--- Force screen update on load
        },
        error: (err) => {
          console.error('Error fetching movies:', err);
        }
      });
  }

  // --- FIXED SEARCH FUNCTION ---
  onSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    console.log('Searching for:', searchTerm); // Debug check

    // Filter the master list
    this.movies = this.allMovies.filter(movie => 
      movie.title.toLowerCase().includes(searchTerm)
    );

    // <--- THIS WAS MISSING: Force screen to repaint with new list
    this.cdr.detectChanges(); 
  }

  onLogout() {
    this.router.navigate(['/login']);
  }
}
