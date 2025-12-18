import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-watchlist',
  standalone: false,
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  movies: any[] = [];
  private apiKey = '0fe3133595252f07c96220d4833513ad';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user.email) this.fetchWatchlistIds(user.email);
  }

  fetchWatchlistIds(email: string) {
    this.http.get<string[]>(`http://192.168.50.20:5000/api/watchlist/${email}`).subscribe(ids => {
      this.movies = [];
      ids.forEach(id => this.fetchMovieDetails(id));
    });
  }

  fetchMovieDetails(id: string) {
    this.http.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${this.apiKey}`)
      .subscribe((data: any) => {
        this.movies.push(data);
        this.cdr.detectChanges();
      });
  }

  removeFromWatchlist(movieId: number) {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.http.post('http://192.168.50.20:5000/api/watchlist/remove', {
      email: user.email,
      movieId: movieId
    }).subscribe(() => {
      this.movies = this.movies.filter(m => m.id !== movieId);
    });
  }
}
