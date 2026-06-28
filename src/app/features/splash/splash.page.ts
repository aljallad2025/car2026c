import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { AuthService } from '../../core/services/auth.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { addIcons } from 'ionicons';
import { flash } from 'ionicons/icons';

@Component({
  selector: 'app-splash',
  standalone: true,
  templateUrl: './splash.page.html',
  styleUrl: './splash.page.scss',
  imports: [IonContent, IonIcon, TranslatePipe],
})
export class SplashPage implements OnInit {
  constructor(private router: Router, private auth: AuthService) {
    addIcons({ flash });
  }

  async ngOnInit(): Promise<void> {
    await this.auth.initialize();

    setTimeout(() => {
      const seenOnboarding = localStorage.getItem('speed_onboarding_done') === 'true';

      if (this.auth.isLoggedIn() || this.auth.isGuest()) {
        this.router.navigate(['/tabs/home']);
      } else if (seenOnboarding) {
        this.router.navigate(['/auth/login']);
      } else {
        this.router.navigate(['/onboarding']);
      }
    }, 1400);
  }
}
