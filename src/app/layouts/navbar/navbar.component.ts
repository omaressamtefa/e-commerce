import { log } from 'console';
import { AuthService } from './../../core/services/auth/auth.service';
import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  Signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MyTranslateService } from '../../core/services/Mytranslate/MyTranslateService';
import { CartService } from '../../core/services/cart/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  countCart: Signal<number> = computed(() => this.cartService.cartNumber());
  private readonly authService = inject(AuthService);
  private readonly myTranslateService = inject(MyTranslateService);
  readonly translateService = inject(TranslateService);
  private readonly cartService = inject(CartService);
  isLogin = input<boolean>(true);
  ngOnInit(): void {
    if (this.cartService.getToken() !== null)
      this.cartService.getLoggedUserCart().subscribe({
        next: (res) => {
          this.cartService.cartNumber.set(res.numOfCartItems);
        },
      });
  }
  logout(): void {
    this.authService.logoutUser();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  change(lang: string): void {
    this.myTranslateService.changeLangTranslate(lang);
  }
  currentLang(lang: string): boolean {
    return this.translateService.currentLang === lang;
  }
}
