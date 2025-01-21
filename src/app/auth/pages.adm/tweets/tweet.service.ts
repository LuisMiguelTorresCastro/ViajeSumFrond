import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TweetService {
  private apiUrl = 'https://viajesumback.onrender.com/twitter';

  constructor(private http: HttpClient) {}

  getTweets(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Método para enviar un tweet
  postTweet(status: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { status });
  }
}
