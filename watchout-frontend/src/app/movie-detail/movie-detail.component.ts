import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  // ⚠️ YOUR API KEY (Ensure this is still correct)
  private apiKey = '0fe3133595252f07c96220d4833513ad'; 

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef // <--- Injecting the tool to force updates
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
        console.log('Movie Data Received:', data);
        
        this.movie = {
          title: data.title,
          overview: data.overview,
          poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'https://placehold.co/500x750?text=No+Image',
          vote_average: data.vote_average,
          release_date: data.release_date
        };
        
        this.loading = false;
        
        // <--- FORCE THE SCREEN TO UPDATE NOW
        this.cdr.detectChanges(); 
      },
      error: (error) => {
        console.error('API Error:', error);
        this.errorMessage = 'Could not load movie details.';
        this.loading = false;
        this.cdr.detectChanges(); // Force update on error too
      }
    });
  }

  getTickets() {
    if (!this.movie) return;
    const query = encodeURIComponent(`Showtimes for ${this.movie.title}`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  }
}
