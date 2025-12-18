import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  movies: any[] = [];
  searchQuery: string = '';
  private apiKey = '0fe3133595252f07c96220d4833513ad'; 

  constructor(
    private http: HttpClient, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchMovies();
  }

  fetchMovies() {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}&language=en-US&page=1`;
    this.http.get(url).subscribe({
      next: (data: any) => {
        this.movies = data.results;
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('TMDB API Error:', err)
    });
  }

  onSearch() {
    if (this.searchQuery.trim() === '') {
      this.fetchMovies();
      return;
    }
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${this.searchQuery}`;
    this.http.get(url).subscribe((data: any) => {
      this.movies = data.results;
      this.cdr.detectChanges();
    });
  }

  onLogout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
