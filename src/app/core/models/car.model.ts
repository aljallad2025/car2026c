export type CarStatus = 'available' | 'rented' | 'maintenance' | 'sold';
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid';
export type Transmission = 'automatic' | 'manual';

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  plate_number: string;
  vin?: string;
  category?: string;
  status: CarStatus | string;
  daily_rate?: number;
  weekly_rate?: number;
  monthly_rate?: number;
  sale_price?: number;
  purchase_price?: number;
  mileage?: number;
  fuel_type?: FuelType | string;
  transmission?: Transmission | string;
  seats?: number;
  insurance_expiry?: string;
  registration_expiry?: string;
  image_url?: string;
  features?: string[];
  notes?: string;
  location?: string;
  created_at: string;
  updated_at?: string;
}

export interface CarFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  transmission?: string;
  seats?: number;
  location?: string;
  minYear?: number;
  maxMileage?: number;
}
