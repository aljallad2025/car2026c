import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonToggle } from '@ionic/angular/standalone';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService, AppLang } from '../../core/services/language.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { addIcons } from 'ionicons';
import {
  personCircleOutline,
  createOutline,
  documentTextOutline,
  locationOutline,
  cardOutline,
  chatbubbleEllipsesOutline,
  heartOutline,
  moonOutline,
  notificationsOutline,
  chevronForwardOutline,
  logOutOutline,
  languageOutline,
} from 'ionicons/icons';

interface MenuItem {
  icon: string;
  labelKey: string;
  action: () => void;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss',
  imports: [IonContent, IonIcon, IonToggle, CommonModule, FormsModule, TranslatePipe],
})
export class ProfilePage {
  darkMode = true;
  notifications = true;

  readonly menuItems: MenuItem[] = [
    { icon: 'create-outline', labelKey: 'profile.editProfile', action: () => {} },
    { icon: 'document-text-outline', labelKey: 'profile.myDocuments', action: () => {} },
    { icon: 'location-outline', labelKey: 'profile.myAddresses', action: () => {} },
    { icon: 'card-outline', labelKey: 'profile.myPayments', action: () => this.router.navigate(['/payments']) },
    { icon: 'chatbubble-ellipses-outline', labelKey: 'profile.contactUs', action: () => this.router.navigate(['/chat']) },
    { icon: 'heart-outline', labelKey: 'profile.favorites', action: () => this.router.navigate(['/favorites']) },
  ];

  constructor(public auth: AuthService, public lang: LanguageService, private router: Router) {
    addIcons({
      personCircleOutline,
      createOutline,
      documentTextOutline,
      locationOutline,
      cardOutline,
      chatbubbleEllipsesOutline,
      heartOutline,
      moonOutline,
      notificationsOutline,
      chevronForwardOutline,
      logOutOutline,
      languageOutline,
    });
  }

  get user() {
    return this.auth.currentUser();
  }

  setLang(lang: AppLang): void {
    this.lang.setLang(lang);
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
