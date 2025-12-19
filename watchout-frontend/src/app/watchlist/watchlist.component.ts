import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-watchlist',
  standalone: false,
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  releasedMovies: any[] = [];
  upcomingMovies: any[] = []; // Specifically for the "Calendar" deliverable
  private apiKey = '0fe3133595252f07c96220d4833513ad';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user.email) this.fetchWatchlistIds(user.email);
  }

  fetchWatchlistIds(email: string) {
    this.http.get<string[]>(`http://192.168.50.20:5000/api/watchlist/${email}`).subscribe(ids => {
      this.releasedMovies = [];
      this.upcomingMovies = [];
      ids.forEach(id => this.fetchMovieDetails(id));
    });
  }

  fetchMovieDetails(id: string) {
    this.http.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${this.apiKey}`)
      .subscribe((data: any) => {
        const today = new Date();
        const releaseDate = new Date(data.release_date);

        // Sort movies into "Released" or "Upcoming Calendar"
        if (releaseDate > today) {
          this.upcomingMovies.push(data);
        } else {
          this.releasedMovies.push(data);
        }
        
        // Sort upcoming movies by date so it looks like a calendar
        this.upcomingMovies.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
        this.cdr.detectChanges();
      });
  }

  removeFromWatchlist(movieId: number) {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.http.post('http://192.168.50.20:5000/api/watchlist/remove', {
      email: user.email,
      movieId: movieId
    }).subscribe(() => {
      this.releasedMovies = this.releasedMovies.filter(m => m.id !== movieId);
      this.upcomingMovies = this.upcomingMovies.filter(m => m.id !== movieId);
    });
  }
}
