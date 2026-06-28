import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { CarPlaceholderComponent } from '../../shared/components/car-placeholder/car-placeholder.component';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { addIcons } from 'ionicons';
import { flash } from 'ionicons/icons';

interface OnboardingSlide {
  titleKey: string;
  subtitleKey: string;
}

@Component({
  selector: 'app-onboarding',
  standalone: true,
  templateUrl: './onboarding.page.html',
  styleUrl: './onboarding.page.scss',
  imports: [IonContent, IonButton, IonIcon, CommonModule, CarPlaceholderComponent, TranslatePipe],
})
export class OnboardingPage {
  currentSlide = 0;

  readonly slides: OnboardingSlide[] = [
    { titleKey: 'onboarding.slide1Title', subtitleKey: 'onboarding.slide1Subtitle' },
    { titleKey: 'onboarding.slide2Title', subtitleKey: 'onboarding.slide2Subtitle' },
    { titleKey: 'onboarding.slide3Title', subtitleKey: 'onboarding.slide3Subtitle' },
  ];

  constructor(private router: Router) {
    addIcons({ flash });
  }

  next(): void {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    } else {
      this.finish();
    }
  }

  finish(): void {
    localStorage.setItem('speed_onboarding_done', 'true');
    this.router.navigate(['/auth/login']);
  }
}
