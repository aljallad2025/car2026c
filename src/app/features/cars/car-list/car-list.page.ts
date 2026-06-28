import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonRefresher, IonRefresherContent, IonSkeletonText, IonIcon, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
import { CarsService } from '../../../core/services/cars.service';
import { AuthService } from '../../../core/services/auth.service';
import { Car } from '../../../core/models/car.model';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { CarPlaceholderComponent } from '../../../shared/components/car-placeholder/car-placeholder.component';
import { isValidImageUrl } from '../../../shared/utils/image.util';
import { addIcons } from 'ionicons';
import { searchOutline, carSportOutline, heartOutline, heart } from 'ionicons/icons';

type ListMode = 'rental' | 'sale';

@Component({
  selector: 'app-car-list',
  standalone: true,
  templateUrl: './car-list.page.html',
  styleUrl: './car-list.page.scss',
  imports: [
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonSkeletonText,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    CommonModule,
    FormsModule,
    TranslatePipe,
    CarPlaceholderComponent,
  ],
})
export class CarListPage implements OnInit {
  mode: ListMode = 'rental';
  cars: Car[] = [];
  loading = true;
  searchQuery = '';
  favoriteIds = new Set<string>();

  readonly isValidImageUrl = isValidImageUrl;

  constructor(
    private carsService: CarsService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    addIcons({ searchOutline, carSportOutline, heartOutline, heart });
  }

  async ngOnInit(): Promise<void> {
    const category = this.route.snapshot.queryParamMap.get('category');
    await this.loadCars(category || undefined);
    await this.loadFavorites();
  }

  async setMode(mode: ListMode): Promise<void> {
    this.mode = mode;
    await this.loadCars();
  }

  async loadCars(category?: string): Promise<void> {
    this.loading = true;
    try {
      this.cars =
        this.mode === 'rental'
          ? await this.carsService.getRentalCars(category ? { category } : undefined, this.searchQuery)
          : await this.carsService.getSaleCars(category ? { category } : undefined, this.searchQuery);
    } finally {
      this.loading = false;
    }
  }

  async loadFavorites(): Promise<void> {
    const user = this.auth.currentUser();
    if (user) this.favoriteIds = await this.carsService.getFavoriteCarIds(user.id);
  }

  async onSearch(): Promise<void> {
    await this.loadCars();
  }

  async onRefresh(event: any): Promise<void> {
    await this.loadCars();
    event.target.complete();
  }

  async toggleFavorite(car: Car, event: Event): Promise<void> {
    event.stopPropagation();
    const user = this.auth.currentUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }
    const isNowFavorite = await this.carsService.toggleFavorite(car.id, user.id);
    if (isNowFavorite) this.favoriteIds.add(car.id);
    else this.favoriteIds.delete(car.id);
  }

  isFavorite(carId: string): boolean {
    return this.favoriteIds.has(carId);
  }

  goToCar(car: Car): void {
    this.router.navigate(['/cars', car.id]);
  }
}
