import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-count-selector',
  standalone: false,
  templateUrl: './count-selector.component.html',
  styleUrl: './count-selector.component.scss'
})
export class CountSelectorComponent implements OnInit {
  @Input() count: number = 1;

  @Output() onCountChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() {

  }
  ngOnInit(): void {
  }

  countChange() {
    this.onCountChange.emit(this.count);
  }

  decreaseCount() {
    if (this.count! > 1) {
      this.count--;
      this.countChange();
    }
  }
  increaseCount() {
    this.count++;
    this.countChange();
  }
}
