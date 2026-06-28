import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonSegment, IonSegmentButton, IonLabel, IonIcon, IonSkeletonText } from '@ionic/angular/standalone';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { Booking } from '../../core/models/booking.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { CarPlaceholderComponent } from '../../shared/components/car-placeholder/car-placeholder.component';
import { isValidImageUrl } from '../../shared/utils/image.util';
import { addIcons } from 'ionicons';
import { carSportOutline, calendarOutline, listCircleOutline } from 'ionicons/icons';

type BookingTab = 'active' | 'pending' | 'completed' | 'cancelled';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  templateUrl: './my-bookings.page.html',
  styleUrl: './my-bookings.page.scss',
  imports: [IonContent, IonSegment, IonSegmentButton, IonLabel, IonIcon, IonSkeletonText, CommonModule, FormsModule, TranslatePipe, CarPlaceholderComponent],
})
export class MyBookingsPage implements OnInit {
  bookings: Booking[] = [];
  loading = true;
  activeTab: BookingTab = 'active';

  readonly isValidImageUrl = isValidImageUrl;

  constructor(private bookingService: BookingService, private auth: AuthService) {
    addIcons({ carSportOutline, calendarOutline, listCircleOutline });
  }

  async ngOnInit(): Promise<void> {
    await this.loadBookings();
  }

  async loadBookings(): Promise<void> {
    const user = this.auth.currentUser();
    if (!user) return;

    this.loading = true;
    try {
      this.bookings = await this.bookingService.getCustomerBookings(user.id, this.activeTab);
    } finally {
      this.loading = false;
    }
  }

  statusKey(status: string): string {
    const map: Record<string, string> = {
      active: 'bookings.active',
      pending: 'bookings.upcoming',
      completed: 'bookings.completed',
      cancelled: 'bookings.cancelled',
    };
    return map[status] || status;
  }

  async cancel(booking: Booking): Promise<void> {
    await this.bookingService.cancelBooking(booking.id);
    await this.loadBookings();
  }
}
