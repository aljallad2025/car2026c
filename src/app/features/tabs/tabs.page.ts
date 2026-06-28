import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { addIcons } from 'ionicons';
import { homeOutline, carSportOutline, listCircleOutline, personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  standalone: true,
  templateUrl: './tabs.page.html',
  styleUrl: './tabs.page.scss',
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet, TranslatePipe],
})
export class TabsPage {
  constructor() {
    addIcons({ homeOutline, carSportOutline, listCircleOutline, personCircleOutline });
  }
}
