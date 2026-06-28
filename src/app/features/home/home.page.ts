import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonRefresher, IonRefresherContent, IonSkeletonText, IonIcon } from '@ionic/angular/standalone';
import { CarsService } from '../../core/services/cars.service';
import { AuthService } from '../../core/services/auth.service';
import { Car } from '../../core/models/car.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { CarPlaceholderComponent } from '../../shared/components/car-placeholder/car-placeholder.component';
import { isValidImageUrl } from '../../shared/utils/image.util';
import { addIcons } from 'ionicons';
import { notificationsOutline, searchOutline, arrowForwardOutline, peopleOutline, settingsOutline, carSportOutline } from 'ionicons/icons';

interface Category {
  labelKey: string;
  value: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  imports: [IonContent, IonRefresher, IonRefresherContent, IonSkeletonText, IonIcon, CommonModule, TranslatePipe, CarPlaceholderComponent],
})
export class HomePage implements OnInit {
  featuredCars: Car[] = [];
  popularCars: Car[] = [];
  loading = true;
  selectedCategory: string | null = null;

  readonly categories: Category[] = [
    { labelKey: 'home.categorySedan', value: 'sedan' },
    { labelKey: 'home.categorySuv', value: 'suv' },
    { labelKey: 'home.categoryLuxury', value: 'luxury' },
    { labelKey: 'home.categorySports', value: 'sports' },
    { labelKey: 'home.categoryEconomy', value: 'economy' },
  ];

  readonly isValidImageUrl = isValidImageUrl;

  constructor(private carsService: CarsService, private auth: AuthService, private router: Router) {
    addIcons({ notificationsOutline, searchOutline, arrowForwardOutline, peopleOutline, settingsOutline, carSportOutline });
  }

  get currentUser() {
    return this.auth.currentUser();
  }

  get isGuest() {
    return this.auth.isGuest();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading = true;
    try {
      [this.featuredCars, this.popularCars] = await Promise.all([
        this.carsService.getFeaturedCars(4),
        this.carsService.getFeaturedCars(8),
      ]);
    } finally {
      this.loading = false;
    }
  }

  async onRefresh(event: any): Promise<void> {
    await this.loadData();
    event.target.complete();
  }

  selectCategory(category: string): void {
    const next = this.selectedCategory === category ? null : category;
    this.selectedCategory = next;
    this.router.navigate(['/tabs/cars'], { queryParams: { category: next } });
  }

  goToCar(car: Car): void {
    this.router.navigate(['/cars', car.id]);
  }

  goToSearch(): void {
    this.router.navigate(['/tabs/cars']);
  }
}
