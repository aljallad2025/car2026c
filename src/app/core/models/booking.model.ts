import { Car } from './car.model';

export type BookingStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  car_id: string;
  customer_id?: string;
  car?: Car;
  full_name: string;
  email?: string;
  phone?: string;
  start_date?: string;
  end_date?: string;
  pickup_location?: string;
  dropoff_location?: string;
  pickup_lat?: number;
  pickup_lng?: number;
  dropoff_lat?: number;
  dropoff_lng?: number;
  license_image_url?: string;
  id_image_url?: string;
  status: BookingStatus | string;
  notes?: string;
  total_amount: number;
  created_at: string;
}

export interface BookingExtra {
  id: string;
  nameKey: string;
  price: number;
  icon: string;
  selected: boolean;
}
