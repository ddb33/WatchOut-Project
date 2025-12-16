import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css'],
  standalone: false
})
export class MovieDetailsComponent implements OnInit {
  movie: any = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Get the ID from the URL (e.g. /movie/12345)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getMovie(id);
    }
  }

  getMovie(id: string) {
    this.http.get('http://192.168.50.20:3000/movies/' + id).subscribe({
      next: (data) => {
        this.movie = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
