import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-movie-detail',
  standalone: false,
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  movie: any;
  loading: boolean = true;
  errorMessage: string = '';
  backRoute: string = '/dashboard';
  private apiKey: string = '0fe3133595252f07c96220d4833513ad';

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['from'] === 'watchlist') {
        this.backRoute = '/watchlist';
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchMovieDetail(id);
    }
  }

  fetchMovieDetail(id: string): void {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${this.apiKey}`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.movie = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Could not load movie details.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  addToWatchlist(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!user.email) {
      alert('Please login first!');
      this.router.navigate(['/login']);
      return;
    }

    this.http.post('http://192.168.50.20:5000/api/watchlist/add', {
      email: user.email,
      movieId: this.movie.id
    }).subscribe({
      next: () => alert(`${this.movie.title} added!`),
      error: () => alert('Error: Is the Backend VM running?')
    });
  }

  getTickets(): void {
    const query = encodeURIComponent(`Showtimes for ${this.movie.title}`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  }

  goBack(): void {
    this.router.navigate([this.backRoute]);
  }
}
