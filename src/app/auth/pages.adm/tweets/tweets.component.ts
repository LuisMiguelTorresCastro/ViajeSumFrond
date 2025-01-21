import { Component, OnInit } from '@angular/core';
import { TweetService } from './tweet.service';

@Component({
    selector: 'app-tweet',
    templateUrl: './tweets.component.html',
    styleUrls: ['./tweets.component.css'],
    standalone: false
})
export class TweetComponent implements OnInit {
  tweetText: string = '';
  responseMessage: string = '';
  tweets: any[] = []; // Aquí se almacenan los tweets

  constructor(private tweetService: TweetService) {}

  ngOnInit() {
    this.getTweets(); // Llamar al método para obtener tweets al iniciar el componente
  }

  sendTweet() {
    if (this.tweetText.trim()) {
      this.tweetService.postTweet(this.tweetText).subscribe({
        next: (response) => {
          this.responseMessage = 'Tweet enviado exitosamente.';
          this.tweetText = ''; // Limpiar el campo de entrada
          this.getTweets(); // Volver a cargar los tweets después de enviar uno nuevo
        },
        error: (error) => {
          this.responseMessage = 'Error al enviar el tweet.';
          console.error('Error al enviar el tweet:', error);
        }
      });
    } else {
      this.responseMessage = 'El texto del tweet no puede estar vacío.';
    }
  }

  getTweets() {
    this.tweetService.getTweets().subscribe({
      next: (data) => {
        this.tweets = data;
      },
      error: (error) => {
        console.error('Error al obtener los tweets:', error);
      }
    });
  }
}
