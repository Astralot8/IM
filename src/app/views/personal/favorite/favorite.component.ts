import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../../../shared/services/favorite.service';
import { DefaultResponseType } from '../../../../types/default-response.type';
import { FavoriteType } from '../../../../types/favorite.type';
import { environment } from '../../../../environments/environment';
import { CartType } from '../../../../types/cart.type';
import { CartService } from '../../../shared/services/cart.service';

@Component({
  selector: 'app-favorite',
  standalone: false,
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit {

  products: FavoriteType[] = [];
  serverStaticPath = environment.serverStaticPath;
  cart: CartType | null = null;
  isInCart: boolean = false;

  constructor(private favoriteService: FavoriteService, private cartService: CartService) {

  }

  ngOnInit(): void {
    this.favoriteService.getFavorite().subscribe((data: FavoriteType[] | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        const error = (data as DefaultResponseType).message;
        throw new Error(error);
      }
      this.cartService.getCart().subscribe((dataCart: CartType | DefaultResponseType) => {
        if ((dataCart as DefaultResponseType).error !== undefined) {
          throw new Error((dataCart as DefaultResponseType).message);
        }
        this.cart = dataCart as CartType;

        if (this.cart && this.cart.items.length > 0) {
          this.products = (data as FavoriteType[]).map(product => {
            if (this.cart) {
              const productInCart = this.cart!.items.find(item => item.product.id === product.id);
              if (productInCart) {
                product.countInCart = productInCart.quantity;
                product.isInCart = true;
              }
            } else {
              product.countInCart = 1;
              product.isInCart = false;
            }
            return product;
          })
        } else {
          this.products = data as FavoriteType[];
        }
      })
    })
  }

  removeFromFavorites(id: string) {
    this.favoriteService.removeFavorite(id).subscribe(
      (data: DefaultResponseType) => {
        if (data.error) {
          throw new Error(data.message)
        }
        this.products = this.products.filter(item => item.id !== id);
      }
    )
  }

  updateCount(id: string, count: number) {
    if (this.cart) {
      this.cartService.updateCart(id, count).subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.cart = data as CartType;
      })
    }
  }

  addToCart(id: string) {
    this.cartService.updateCart(id, 1).subscribe((data: CartType | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        throw new Error((data as DefaultResponseType).message);
      }
      this.products.forEach(item => {
        if (item.id === id) {
          item.countInCart = 1;
          item.isInCart = true;
        }
      })
    })
  }

  removeFromCart(id: string) {
    this.cartService.updateCart(id, 0).subscribe((data: CartType | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        throw new Error((data as DefaultResponseType).message);
      }
      this.products.forEach(item => {
        if (item.id === id) {
          item.countInCart = 1;
          item.isInCart = false;
        }
      })
    })
  }
}
