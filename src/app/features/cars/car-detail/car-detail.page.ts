import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { CarsService } from '../../../core/services/cars.service';
import { AuthService } from '../../../core/services/auth.service';
import { Car } from '../../../core/models/car.model';
import { Review } from '../../../core/models/customer.model';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { CarPlaceholderComponent } from '../../../shared/components/car-placeholder/car-placeholder.component';
import { isValidImageUrl } from '../../../shared/utils/image.util';
import { addIcons } from 'ionicons';
import {
  heartOutline,
  heart,
  shareOutline,
  starOutline,
  peopleOutline,
  flashOutline,
  settingsOutline,
  locationOutline,
  calendarOutline,
  checkmarkCircle,
  personCircleOutline,
  chevronBackOutline,
} from 'ionicons/icons';

type DetailTab = 'details' | 'features' | 'reviews';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  templateUrl: './car-detail.page.html',
  styleUrl: './car-detail.page.scss',
  imports: [IonContent, IonIcon, IonButton, CommonModule, RouterLink, TranslatePipe, CarPlaceholderComponent],
})
export class CarDetailPage implements OnInit {
  car: Car | null = null;
  reviews: Review[] = [];
  loading = true;
  activeTab: DetailTab = 'details';
  isFavorite = false;

  readonly isValidImageUrl = isValidImageUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carsService: CarsService,
    private auth: AuthService
  ) {
    addIcons({
      heartOutline,
      heart,
      shareOutline,
      starOutline,
      peopleOutline,
      flashOutline,
      settingsOutline,
      locationOutline,
      calendarOutline,
      checkmarkCircle,
      personCircleOutline,
      chevronBackOutline,
    });
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id')!;
    const user = this.auth.currentUser();

    const [car, reviews, favorites] = await Promise.all([
      this.carsService.getCarById(id),
      this.carsService.getCarReviews(id),
      user ? this.carsService.getFavoriteCarIds(user.id) : Promise.resolve(new Set<string>()),
    ]);

    this.car = car;
    this.reviews = reviews;
    this.isFavorite = favorites.has(id);
    this.loading = false;
  }

  setTab(tab: DetailTab): void {
    this.activeTab = tab;
  }

  async toggleFavorite(): Promise<void> {
    const user = this.auth.currentUser();
    if (!user || !this.car) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.isFavorite = await this.carsService.toggleFavorite(this.car.id, user.id);
  }

  bookRental(): void {
    this.router.navigate(['/booking/rental', this.car!.id]);
  }

  buyNow(): void {
    this.router.navigate(['/booking/purchase', this.car!.id]);
  }
}
