import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // <--- Import Router

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  searchText: string = '';
  movies: any[] = [];
  filteredMovies: any[] = [];

  // ⚠️ YOUR API KEY HERE
  private apiKey = '0fe3133595252f07c96220d4833513ad'; 
  private apiUrl = 'https://api.themoviedb.org/3/movie/now_playing';

  constructor(
    private http: HttpClient, 
    private cdr: ChangeDetectorRef,
    private router: Router // <--- Inject Router
  ) {}

  ngOnInit(): void {
    console.log('Dashboard initialized. Fetching movies...');
    this.fetchMovies();
  }

  fetchMovies() {
    const url = `${this.apiUrl}?api_key=${this.apiKey}&language=en-US&page=1`;

    this.http.get<any>(url).subscribe({
      next: (data) => {
        console.log('API Data received:', data);

        this.movies = data.results.map((m: any) => ({
          _id: m.id,
          title: m.title,
          poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : 'https://placehold.co/500x750?text=No+Image',
          overview: m.overview,
          release_date: m.release_date
        }));

        this.filteredMovies = [...this.movies];
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('API Error:', error);
      }
    });
  }

  onSearch(): void {
    const text = this.searchText.toLowerCase();
    this.filteredMovies = this.movies.filter(movie => {
      return movie.title.toLowerCase().includes(text);
    });
  }

  // <--- THE NEW LOGOUT FUNCTION
  logout() {
    // In the future, this is where we delete the token
    console.log('User logged out');
    this.router.navigate(['/login']);
  }
}
