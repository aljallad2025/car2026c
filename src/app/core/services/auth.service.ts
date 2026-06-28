import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { Customer } from '../models/customer.model';

const GUEST_KEY = 'speed_guest_mode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<Customer | null>(null);
  isLoggedIn = signal(false);
  isGuest = signal(false);
  initialized = signal(false);

  constructor(private supabase: SupabaseService, private router: Router) {}

  async initialize(): Promise<void> {
    if (localStorage.getItem(GUEST_KEY) === 'true') {
      this.isGuest.set(true);
    }

    const { data } = await this.supabase.auth.getSession();
    if (data.session?.user) {
      await this.loadOrCreateCustomer(data.session.user.email || '');
      this.isLoggedIn.set(true);
      this.isGuest.set(false);
    }

    this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        localStorage.removeItem(GUEST_KEY);
        await this.loadOrCreateCustomer(session.user.email || '');
        this.isLoggedIn.set(true);
        this.isGuest.set(false);
      } else if (event === 'SIGNED_OUT') {
        this.currentUser.set(null);
        this.isLoggedIn.set(false);
        this.router.navigate(['/auth/login']);
      }
    });

    this.initialized.set(true);
  }

  async loginWithEmail(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async loginWithPhone(phone: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ phone, password });
    if (error) throw error;
    return data;
  }

  async register(email: string, password: string, fullName: string, phone: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone } },
    });
    if (error) throw error;

    if (data.user) {
      const { data: existing } = await this.supabase.from('customers').select('*').eq('email', email).maybeSingle();
      if (!existing) {
        await this.supabase.from('customers').insert({
          full_name: fullName,
          email,
          phone,
          customer_type: 'individual',
        });
      }
    }
    return data;
  }

  async resetPassword(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }

  async logout() {
    localStorage.removeItem(GUEST_KEY);
    this.isGuest.set(false);
    await this.supabase.auth.signOut();
  }

  continueAsGuest() {
    localStorage.setItem(GUEST_KEY, 'true');
    this.isGuest.set(true);
    this.isLoggedIn.set(false);
    this.router.navigate(['/tabs/home']);
  }

  requiresLogin(): boolean {
    return !this.isLoggedIn();
  }

  private async loadOrCreateCustomer(email: string) {
    let customer: Customer | null = null;

    if (email) {
      const { data } = await this.supabase.from('customers').select('*').eq('email', email).maybeSingle();
      customer = data;
    }

    if (!customer) {
      const { data: authUser } = await this.supabase.auth.getUser();
      const fullName = (authUser?.user?.user_metadata?.['full_name'] as string) || email || 'Guest';
      const phone = (authUser?.user?.user_metadata?.['phone'] as string) || authUser?.user?.phone || '';

      const { data: created } = await this.supabase
        .from('customers')
        .insert({ full_name: fullName, email, phone, customer_type: 'individual' })
        .select()
        .single();
      customer = created;
    }

    if (customer) this.currentUser.set(customer);
  }

  async updateProfile(updates: Partial<Customer>) {
    const user = this.currentUser();
    if (!user) return;

    const { error } = await this.supabase.from('customers').update(updates).eq('id', user.id);
    if (error) throw error;
    this.currentUser.set({ ...user, ...updates });
  }

  async uploadFile(bucket: string, path: string, file: File): Promise<string> {
    const { error } = await this.supabase.storage(bucket).upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = this.supabase.storage(bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}
