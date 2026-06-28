import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Booking } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  constructor(private supabase: SupabaseService) {}

  async createBooking(booking: Partial<Booking>): Promise<Booking> {
    const { data, error } = await this.supabase.from('bookings').insert(booking).select().single();
    if (error) throw error;
    return data;
  }

  async getCustomerBookings(customerId: string, status?: string): Promise<Booking[]> {
    let query = this.supabase.from('bookings').select('*, car:cars(*)').eq('customer_id', customerId);
    if (status) query = query.eq('status', status);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async cancelBooking(bookingId: string): Promise<void> {
    const { error } = await this.supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);
    if (error) throw error;
  }

  async extendBooking(bookingId: string, newEndDate: string): Promise<void> {
    const { error } = await this.supabase.from('bookings').update({ end_date: newEndDate }).eq('id', bookingId);
    if (error) throw error;
  }

  calculateRentalTotal(dailyRate: number, days: number, extraTotalPerDay = 0): number {
    const safeDays = Math.max(1, days);
    return dailyRate * safeDays + extraTotalPerDay * safeDays;
  }
}
