import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TwitchService } from './twitch-service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-twitch',
    templateUrl: './twitch.component.html',
    styleUrls: ['./twitch.component.css'],
    standalone: false
})
export class TwitchComponent implements OnInit {
  accessToken: string | null = null;
  title: string = '';
  game_id: string = '';
  isStreaming: boolean = false;
  sanitizedUrl: any; // Variable para la URL sanitizada

  constructor(
    private twitchService: TwitchService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer // Inyección de servicio
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.accessToken = params['access_token'] || null;
      if (this.accessToken) {
        this.checkStreamStatus();
      }
    });
  }

  login(): void {
    this.twitchService.login();
  }

  startStream(): void {
    if (this.accessToken && this.title && this.game_id) {
      this.twitchService.startStream(this.accessToken, this.title, this.game_id).subscribe({
        next: () => {
          this.isStreaming = true;
          // Asegúrate de que el parámetro parent solo tenga "localhost"
          this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.twitch.tv/?channel=${this.game_id}&parent=localhost`);
          console.log('Stream started successfully');
        },
        error: (err) => console.error('Error starting stream:', err),
      });
    }
  }
  
  checkStreamStatus(): void {
    if (this.accessToken) {
      this.twitchService.getStreamTitle(this.accessToken).subscribe({
        next: (data) => {
          this.title = data.title;
          this.game_id = data.game_id;
          this.isStreaming = true;
          // Asegúrate de que el parámetro parent solo tenga "localhost"
          this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.twitch.tv/?channel=${this.game_id}&parent=localhost`);
        },
        error: (err) => console.error('Error retrieving stream status:', err),
      });
    }
  }
  

  stopStream(): void {
    this.isStreaming = false;
    this.title = '';
    this.game_id = '';
    console.log('Stream stopped');
  }
}
