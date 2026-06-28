import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  template: `<ion-app><ion-router-outlet></ion-router-outlet></ion-app>`,
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly rootRoutes = ['/splash', '/onboarding', '/auth/login', '/tabs/home'];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.initialize();

    App.addListener('backButton', ({ canGoBack }) => {
      const url = this.router.url;

      if (this.rootRoutes.includes(url)) {
        App.exitApp();
        return;
      }

      if (canGoBack) {
        window.history.back();
      } else {
        this.router.navigateByUrl('/tabs/home');
      }
    });
  }
}
