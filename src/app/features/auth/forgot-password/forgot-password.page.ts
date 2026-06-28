import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { addIcons } from 'ionicons';
import { lockOpenOutline, mailOutline } from 'ionicons/icons';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.page.html',
  styleUrl: './forgot-password.page.scss',
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
export class ForgotPasswordPage {
  email = '';
  loading = false;

  constructor(private auth: AuthService, private toast: ToastController) {
    addIcons({ lockOpenOutline, mailOutline });
  }

  async resetPassword(): Promise<void> {
    this.loading = true;
    try {
      await this.auth.resetPassword(this.email);
      await this.showToast(undefined, 'success');
    } catch (err: any) {
      await this.showToast(err?.message, 'danger');
    } finally {
      this.loading = false;
    }
  }

  private async showToast(message: string | undefined, color: 'success' | 'danger'): Promise<void> {
    const t = await this.toast.create({
      message: message || (color === 'success' ? 'Reset link sent' : 'Something went wrong'),
      duration: 3000,
      color,
      position: 'top',
    });
    await t.present();
  }
}
