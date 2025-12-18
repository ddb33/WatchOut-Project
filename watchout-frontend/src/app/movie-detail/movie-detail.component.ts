import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  private apiKey = '0fe3133595252f07c96220d4833513ad'; 

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.fetchMovieDetail(id);
  }

  fetchMovieDetail(id: string | null) {
    if (!id) return;
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${this.apiKey}&language=en-US`;

    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.movie = {
          title: data.title,
          overview: data.overview,
          poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'https://placehold.co/500x750?text=No+Image',
          vote_average: data.vote_average,
          release_date: data.release_date
        };
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: (error) => {
        this.errorMessage = 'Could not load movie details.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  addToWatchlist() {
    const userSession = localStorage.getItem('currentUser');
    
    if (!userSession) {
      alert('You must be logged in to track movies!');
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(userSession);
    const id = this.route.snapshot.paramMap.get('id');

    const payload = {
      email: user.email,
      movieId: id,
      movieTitle: this.movie.title
    };

    // Pointing to your Backend VM private IP
    this.http.post('http://192.168.50.20:5000/api/watchlist/add', payload).subscribe({
      next: () => alert(`${this.movie.title} added to your watchlist!`),
      error: (err) => alert('Error adding to watchlist. Is the Backend VM running?')
    });
  }

  getTickets() {
    if (!this.movie) return;
    const query = encodeURIComponent(`Showtimes for ${this.movie.title}`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  }
}
