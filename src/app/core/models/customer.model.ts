export interface Customer {
  id: string;
  full_name: string;
  email?: string;
  phone: string;
  phone_2?: string;
  national_id?: string;
  license_number?: string;
  license_expiry?: string;
  address?: string;
  city?: string;
  country?: string;
  status?: string;
  rating?: number;
  notes?: string;
  cpr_number?: string;
  cpr_image_url?: string;
  license_image_url?: string;
  customer_type?: 'individual' | 'company';
  company_name?: string;
  nationality?: string;
  created_at: string;
}

export interface Review {
  id: string;
  customer_id: string;
  car_id: string;
  rating: number;
  comment: string;
  user_name: string;
  created_at: string;
}

export interface Favorite {
  id: string;
  customer_id: string;
  car_id: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  customer_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}
