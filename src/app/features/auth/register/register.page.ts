import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { addIcons } from 'ionicons';
import {
  personAddOutline,
  personOutline,
  mailOutline,
  phonePortraitOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  cardOutline,
  documentTextOutline,
  arrowForwardOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss',
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner,
    CommonModule,
    FormsModule,
    TranslatePipe,
  ],
})
export class RegisterPage {
  fullName = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  idCardFile: File | null = null;
  licenseFile: File | null = null;
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastController,
    public lang: LanguageService
  ) {
    addIcons({
      personAddOutline,
      personOutline,
      mailOutline,
      phonePortraitOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      cardOutline,
      documentTextOutline,
      arrowForwardOutline,
    });
  }

  onFileChange(event: Event, type: 'id' | 'license'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (type === 'id') this.idCardFile = file;
    else this.licenseFile = file;
  }

  async register(): Promise<void> {
    if (this.password !== this.confirmPassword) {
      await this.showError(this.lang.t('auth.passwordMismatch'));
      return;
    }

    this.loading = true;
    try {
      const result = await this.auth.register(this.email, this.password, this.fullName, this.phone);

      if (result.user && this.idCardFile) {
        const url = await this.auth.uploadFile('documents', `${result.user.id}/id_card`, this.idCardFile);
        await this.auth.updateProfile({ cpr_image_url: url });
      }
      if (result.user && this.licenseFile) {
        const url = await this.auth.uploadFile('documents', `${result.user.id}/license`, this.licenseFile);
        await this.auth.updateProfile({ license_image_url: url });
      }

      this.router.navigate(['/tabs/home']);
    } catch (err: any) {
      await this.showError(err?.message || 'Registration failed');
    } finally {
      this.loading = false;
    }
  }

  continueAsGuest(): void {
    this.auth.continueAsGuest();
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  private async showError(message: string): Promise<void> {
    const t = await this.toast.create({ message, duration: 3000, color: 'danger', position: 'top' });
    await t.present();
  }
}
