import { Component, inject, OnInit } from '@angular/core';
import { BrandsService } from '../../core/services/brands/brands.service';
import { IBrands } from '../../shared/interfaces/ibrands';

@Component({
  selector: 'app-brands',
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
})
export class BrandsComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);
  brands: IBrands[] = [];

  ngOnInit(): void {
    this.getBrandsData();
  }

  getBrandsData(): void {
    this.brandsService.getAllbrands().subscribe({
      next: (res) => {
        console.log(res.data);
        this.brands = res.data;
      },
      error: (err) => {
        console.error('Error fetching brands:', err);
      },
    });
  }
}
