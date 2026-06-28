import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonInput, IonIcon } from '@ionic/angular/standalone';
import { ChatService } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import { ChatMessage } from '../../core/models/customer.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { addIcons } from 'ionicons';
import { sendOutline, headsetOutline } from 'ionicons/icons';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.page.html',
  styleUrl: './chat.page.scss',
  imports: [IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonInput, IonIcon, CommonModule, FormsModule, TranslatePipe],
})
export class ChatPage implements OnInit, OnDestroy {
  messages: ChatMessage[] = [];
  newMessage = '';

  constructor(private chatService: ChatService, private auth: AuthService) {
    addIcons({ sendOutline, headsetOutline });
  }

  async ngOnInit(): Promise<void> {
    const user = this.auth.currentUser();
    if (!user) return;

    this.messages = await this.chatService.getMessages(user.id);
    this.chatService.subscribeToMessages(user.id, (msg) => this.messages.push(msg));
  }

  async send(): Promise<void> {
    const trimmed = this.newMessage.trim();
    const user = this.auth.currentUser();
    if (!trimmed || !user) return;

    await this.chatService.sendMessage(user.id, trimmed);
    this.newMessage = '';
  }

  ngOnDestroy(): void {
    this.chatService.unsubscribe();
  }
}
