import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Required for API calls
import { FormsModule } from '@angular/forms'; // Required for ngModel and Search

import { AppRoutingModule } from './app-routing.module'; // Required for navigation
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    MovieDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, // Enables communication with .20 Backend
    FormsModule       // Enables two-way data binding for search and forms
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
