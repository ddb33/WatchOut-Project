import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  // Search text variable
  searchText: string = '';

  // Movies list with ONLINE image links (No downloads needed!)
  movies = [
    { 
      title: 'Avatar: Fire and Ash', 
      poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Avatar_Fire_and_Ash_poster.jpg/220px-Avatar_Fire_and_Ash_poster.jpg',
      _id: '1' 
    },
    { 
      title: 'Wicked: Part Two', 
      poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6c/Wicked_Part_Two.jpg/220px-Wicked_Part_Two.jpg',
      _id: '2' 
    },
    { 
      title: 'Zootopia 2', 
      poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/96/Zootopia_2_poster.jpg/220px-Zootopia_2_poster.jpg',
      _id: '3' 
    },
    { 
      title: 'Sonic the Hedgehog 3', 
      poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c2/Sonic_the_Hedgehog_3_film_poster.jpg/220px-Sonic_the_Hedgehog_3_film_poster.jpg',
      _id: '4' 
    }
  ];

  // List to display (starts full)
  filteredMovies = [...this.movies];

  constructor() {}

  ngOnInit(): void {}

  // Filter function
  onSearch(): void {
    const text = this.searchText.toLowerCase();
    this.filteredMovies = this.movies.filter(movie => {
      return movie.title.toLowerCase().includes(text);
    });
  }
}
