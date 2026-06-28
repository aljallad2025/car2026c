import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Car, CarFilter } from '../models/car.model';
import { Review, Favorite } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class CarsService {
  constructor(private supabase: SupabaseService) {}

  async getRentalCars(filters?: CarFilter, search?: string): Promise<Car[]> {
    let query = this.supabase.from('cars').select('*').eq('status', 'available');

    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.transmission) query = query.eq('transmission', filters.transmission);
    if (filters?.seats) query = query.eq('seats', filters.seats);
    if (filters?.minPrice) query = query.gte('daily_rate', filters.minPrice);
    if (filters?.maxPrice) query = query.lte('daily_rate', filters.maxPrice);
    if (filters?.location) query = query.eq('location', filters.location);
    if (search) {
      query = query.or(`make.ilike.%${search}%,model.ilike.%${search}%,plate_number.ilike.%${search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async getSaleCars(filters?: CarFilter, search?: string): Promise<Car[]> {
    let query = this.supabase.from('cars').select('*').not('sale_price', 'is', null).gt('sale_price', 0);

    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.minPrice) query = query.gte('sale_price', filters.minPrice);
    if (filters?.maxPrice) query = query.lte('sale_price', filters.maxPrice);
    if (filters?.minYear) query = query.gte('year', filters.minYear);
    if (filters?.maxMileage) query = query.lte('mileage', filters.maxMileage);
    if (search) query = query.or(`make.ilike.%${search}%,model.ilike.%${search}%`);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async getCarById(id: string): Promise<Car> {
    const { data, error } = await this.supabase.from('cars').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async getFeaturedCars(limit = 6): Promise<Car[]> {
    const { data, error } = await this.supabase
      .from('cars')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  }

  async getCarReviews(carId: string): Promise<Review[]> {
    const { data, error } = await this.supabase
      .from('reviews')
      .select('*')
      .eq('car_id', carId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async toggleFavorite(carId: string, customerId: string): Promise<boolean> {
    const { data } = await this.supabase
      .from('favorites')
      .select('id')
      .eq('car_id', carId)
      .eq('customer_id', customerId)
      .maybeSingle();

    if (data) {
      await this.supabase.from('favorites').delete().eq('id', data.id);
      return false;
    }

    await this.supabase.from('favorites').insert({ car_id: carId, customer_id: customerId });
    return true;
  }

  async getFavoriteCarIds(customerId: string): Promise<Set<string>> {
    const { data } = await this.supabase.from('favorites').select('car_id').eq('customer_id', customerId);
    return new Set((data || []).map((f: Favorite) => f.car_id));
  }

  async getFavoriteCars(customerId: string): Promise<Car[]> {
    const { data, error } = await this.supabase
      .from('favorites')
      .select('car_id, cars(*)')
      .eq('customer_id', customerId);
    if (error) throw error;
    return (data || []).map((row: any) => row.cars).filter(Boolean);
  }
}
