import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

   @Input() collectionSize = 0;
  @Input() pageSize = 10;
  // @Input() page = 1;
  @Input() page!: number;
  @Output() pageChange = new EventEmitter<number>();

  visiblePages: (number | null)[] = [];


  hiddenPages: number[] = [];
  totalPages: number[] = [];

  ngOnChanges(): void {
    this.generatePages();
    this.updateHiddenPages();
  }

  generatePages() {
    const total = Math.ceil(this.collectionSize / this.pageSize);
    this.totalPages = Array.from({ length: total }, (_, i) => i + 1);
  }

  onPageChange(newPage: number) {
    // if (page < 1 || page > this.totalPages.length) return;
    // this.page = page;
    // this.pageChange.emit(page);

    this.page = newPage;
    this.pageChange.emit(this.page); // important
    this.updateHiddenPages();
  }

  updateHiddenPages() {
    const total = this.totalPages.length;
    const current = this.page;
    this.visiblePages = [];

    if (total <= 7) {
      this.visiblePages = this.totalPages;
      return;
    }

    this.visiblePages.push(1);

    if (current > 4) {
      this.visiblePages.push(null); // …
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      this.visiblePages.push(i);
    }

    if (current < total - 3) {
      this.visiblePages.push(null); // …
    }

    this.visiblePages.push(total);
  }

  isHidden(page: number): boolean {
    return this.hiddenPages.includes(page);
  }
}
