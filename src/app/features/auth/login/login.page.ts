import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonInput,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { CarPlaceholderComponent } from '../../../shared/components/car-placeholder/car-placeholder.component';
import { addIcons } from 'ionicons';
import {
  mailOutline,
  lockClosedOutline,
  phonePortraitOutline,
  eyeOutline,
  eyeOffOutline,
  personOutline,
  arrowForwardOutline,
  flash,
} from 'ionicons/icons';

type LoginType = 'email' | 'phone';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  imports: [
    IonContent,
    IonInput,
    IonButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSpinner,
    CommonModule,
    FormsModule,
    TranslatePipe,
    CarPlaceholderComponent,
  ],
})
export class LoginPage {
  loginType: LoginType = 'email';
  email = '';
  phone = '';
  password = '';
  showPassword = false;
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastController,
    public lang: LanguageService
  ) {
    addIcons({ mailOutline, lockClosedOutline, phonePortraitOutline, eyeOutline, eyeOffOutline, personOutline, arrowForwardOutline, flash });
  }

  async login(): Promise<void> {
    this.loading = true;
    try {
      if (this.loginType === 'email') {
        await this.auth.loginWithEmail(this.email, this.password);
      } else {
        await this.auth.loginWithPhone(this.phone, this.password);
      }
      this.router.navigate(['/tabs/home']);
    } catch (err: any) {
      await this.showError(err?.message || this.lang.t('auth.loginFailed'));
    } finally {
      this.loading = false;
    }
  }

  continueAsGuest(): void {
    this.auth.continueAsGuest();
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  private async showError(message: string): Promise<void> {
    const t = await this.toast.create({ message, duration: 3000, color: 'danger', position: 'top' });
    await t.present();
  }
}
