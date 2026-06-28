import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly client: SupabaseClient;

  constructor() {
    this.client = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  from(table: string) {
    return this.client.from(table);
  }

  get auth() {
    return this.client.auth;
  }

  storage(bucket: string) {
    return this.client.storage.from(bucket);
  }
}
