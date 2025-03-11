import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../shared/services/order.service';
import { OrderType } from '../../../../types/order.type';
import { DefaultResponseType } from '../../../../types/default-response.type';
import { OrderStatusUtil } from '../../../shared/utils/order-status.utils';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  orders: OrderType[] = [];
  constructor(private orderSrevice: OrderService){}

  ngOnInit(): void {
    this.orderSrevice.getOrders().subscribe(
      (data: OrderType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.orders = (data as OrderType[]).map(item => {

          const status = OrderStatusUtil.getStatusAndColor(item.status);

          item.statusRus = status.name;
          item.color = status.color;



          return item;
        });
      }
    )
  }
}
