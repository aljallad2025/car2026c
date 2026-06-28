import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, IonSpinner, ToastController } from '@ionic/angular/standalone';
import { CarsService } from '../../../core/services/cars.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { Car } from '../../../core/models/car.model';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { CarPlaceholderComponent } from '../../../shared/components/car-placeholder/car-placeholder.component';
import { isValidImageUrl } from '../../../shared/utils/image.util';
import { addIcons } from 'ionicons';
import { carSportOutline, cashOutline, calendarOutline, businessOutline } from 'ionicons/icons';

type PayMethod = 'cash' | 'installment' | 'finance';

@Component({
  selector: 'app-purchase-booking',
  standalone: true,
  templateUrl: './purchase-booking.page.html',
  styleUrl: './purchase-booking.page.scss',
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonSpinner,
    CommonModule,
    FormsModule,
    TranslatePipe,
    CarPlaceholderComponent,
  ],
})
export class PurchaseBookingPage implements OnInit {
  car: Car | null = null;
  payMethod: PayMethod = 'cash';
  downPayment = 0;
  installmentMonths = 12;
  loading = false;

  readonly isValidImageUrl = isValidImageUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carsService: CarsService,
    private bookingService: BookingService,
    private auth: AuthService,
    private toast: ToastController
  ) {
    addIcons({ carSportOutline, cashOutline, calendarOutline, businessOutline });
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.car = await this.carsService.getCarById(id);
  }

  get monthlyInstallment(): number {
    if (!this.car?.sale_price || !this.downPayment) return 0;
    return (this.car.sale_price - this.downPayment) / this.installmentMonths;
  }

  async confirm(): Promise<void> {
    const user = this.auth.currentUser();
    if (!user || !this.car) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loading = true;
    try {
      const notes =
        `Purchase request — payment method: ${this.payMethod}` +
        (this.payMethod === 'installment' ? `, down payment: ${this.downPayment}, months: ${this.installmentMonths}` : '');

      await this.bookingService.createBooking({
        car_id: this.car.id,
        customer_id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        total_amount: this.car.sale_price!,
        status: 'pending',
        notes,
      });

      const t = await this.toast.create({ message: '✅', duration: 2000, color: 'success', position: 'top' });
      await t.present();
      this.router.navigate(['/tabs/bookings']);
    } catch (err: any) {
      const t = await this.toast.create({ message: err?.message || 'Request failed', duration: 3000, color: 'danger', position: 'top' });
      await t.present();
    } finally {
      this.loading = false;
    }
  }
}
