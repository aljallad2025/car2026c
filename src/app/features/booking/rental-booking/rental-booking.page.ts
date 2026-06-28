import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon, ToastController } from '@ionic/angular/standalone';
import { CarsService } from '../../../core/services/cars.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { Car } from '../../../core/models/car.model';
import { BookingExtra } from '../../../core/models/booking.model';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { CarPlaceholderComponent } from '../../../shared/components/car-placeholder/car-placeholder.component';
import { isValidImageUrl } from '../../../shared/utils/image.util';
import { addIcons } from 'ionicons';
import {
  carSportOutline,
  calendarOutline,
  locationOutline,
  addCircleOutline,
  cardOutline,
  shieldCheckmarkOutline,
  mapOutline,
  personOutline,
  phonePortraitOutline,
  checkmarkCircle,
  squareOutline,
  cashOutline,
  businessOutline,
} from 'ionicons/icons';

type PaymentMethod = 'cash' | 'card' | 'transfer';

@Component({
  selector: 'app-rental-booking',
  standalone: true,
  templateUrl: './rental-booking.page.html',
  styleUrl: './rental-booking.page.scss',
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    CommonModule,
    FormsModule,
    TranslatePipe,
    CarPlaceholderComponent,
  ],
})
export class RentalBookingPage implements OnInit {
  car: Car | null = null;
  pickupDate = '';
  returnDate = '';
  pickupLocation = '';
  returnLocation = '';
  paymentMethod: PaymentMethod = 'cash';
  loading = false;

  readonly isValidImageUrl = isValidImageUrl;

  extras: BookingExtra[] = [
    { id: 'insurance', nameKey: 'booking.fullInsurance', price: 50, icon: 'shield-checkmark-outline', selected: false },
    { id: 'gps', nameKey: 'booking.gps', price: 20, icon: 'map-outline', selected: false },
    { id: 'child-seat', nameKey: 'booking.childSeat', price: 15, icon: 'person-outline', selected: false },
    { id: 'extra-screen', nameKey: 'booking.extraScreen', price: 30, icon: 'phone-portrait-outline', selected: false },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carsService: CarsService,
    private bookingService: BookingService,
    private auth: AuthService,
    private toast: ToastController
  ) {
    addIcons({
      carSportOutline,
      calendarOutline,
      locationOutline,
      addCircleOutline,
      cardOutline,
      shieldCheckmarkOutline,
      mapOutline,
      personOutline,
      phonePortraitOutline,
      checkmarkCircle,
      squareOutline,
      cashOutline,
      businessOutline,
    });
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.car = await this.carsService.getCarById(id);
  }

  get totalDays(): number {
    if (!this.pickupDate || !this.returnDate) return 0;
    const start = new Date(this.pickupDate);
    const end = new Date(this.returnDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / 86400000);
    return Math.max(0, diff);
  }

  get selectedExtras(): BookingExtra[] {
    return this.extras.filter((e) => e.selected);
  }

  get extraTotalPerDay(): number {
    return this.selectedExtras.reduce((sum, e) => sum + e.price, 0);
  }

  get totalPrice(): number {
    if (!this.car?.daily_rate || this.totalDays === 0) return 0;
    return this.bookingService.calculateRentalTotal(this.car.daily_rate, this.totalDays, this.extraTotalPerDay);
  }

  toggleExtra(extra: BookingExtra): void {
    extra.selected = !extra.selected;
  }

  async confirm(): Promise<void> {
    const user = this.auth.currentUser();
    if (!user || !this.car) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loading = true;
    try {
      await this.bookingService.createBooking({
        car_id: this.car.id,
        customer_id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        start_date: this.pickupDate,
        end_date: this.returnDate,
        pickup_location: this.pickupLocation,
        dropoff_location: this.returnLocation,
        total_amount: this.totalPrice,
        status: 'pending',
      });

      const t = await this.toast.create({ message: '✅', duration: 2000, color: 'success', position: 'top' });
      await t.present();
      this.router.navigate(['/tabs/bookings']);
    } catch (err: any) {
      const t = await this.toast.create({ message: err?.message || 'Booking failed', duration: 3000, color: 'danger', position: 'top' });
      await t.present();
    } finally {
      this.loading = false;
    }
  }
}
