import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule],
  // These paths now match your renamed files:
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movieId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Grab the movie ID from the URL
    this.movieId = this.route.snapshot.paramMap.get('id');
  }
}
