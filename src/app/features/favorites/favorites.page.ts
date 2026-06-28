import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { CarsService } from '../../core/services/cars.service';
import { AuthService } from '../../core/services/auth.service';
import { Car } from '../../core/models/car.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { CarPlaceholderComponent } from '../../shared/components/car-placeholder/car-placeholder.component';
import { isValidImageUrl } from '../../shared/utils/image.util';
import { addIcons } from 'ionicons';
import { carSportOutline, heartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-favorites',
  standalone: true,
  templateUrl: './favorites.page.html',
  styleUrl: './favorites.page.scss',
  imports: [IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonIcon, CommonModule, TranslatePipe, CarPlaceholderComponent],
})
export class FavoritesPage implements OnInit {
  cars: Car[] = [];
  loading = true;

  readonly isValidImageUrl = isValidImageUrl;

  constructor(private carsService: CarsService, private auth: AuthService, private router: Router) {
    addIcons({ carSportOutline, heartOutline });
  }

  async ngOnInit(): Promise<void> {
    const user = this.auth.currentUser();
    if (user) this.cars = await this.carsService.getFavoriteCars(user.id);
    this.loading = false;
  }

  goToCar(car: Car): void {
    this.router.navigate(['/cars', car.id]);
  }
}
