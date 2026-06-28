import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { SupabaseService } from '../../core/services/supabase.service';
import { AuthService } from '../../core/services/auth.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { addIcons } from 'ionicons';
import { cardOutline, walletOutline } from 'ionicons/icons';

interface PaymentRow {
  id: string;
  amount: number;
  status: string;
  created_at: string;
}

@Component({
  selector: 'app-payments',
  standalone: true,
  templateUrl: './payments.page.html',
  styleUrl: './payments.page.scss',
  imports: [IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonIcon, CommonModule, TranslatePipe],
})
export class PaymentsPage implements OnInit {
  payments: PaymentRow[] = [];

  constructor(private supabase: SupabaseService, private auth: AuthService) {
    addIcons({ cardOutline, walletOutline });
  }

  async ngOnInit(): Promise<void> {
    const user = this.auth.currentUser();
    if (!user) return;

    const { data } = await this.supabase
      .from('payments')
      .select('*')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false });

    this.payments = data || [];
  }
}
