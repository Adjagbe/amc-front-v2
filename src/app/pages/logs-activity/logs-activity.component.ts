import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivityLogService } from '../../service/activity_log/activity-log.service';
import { ActivityLogs } from '../../models/activity-logs/activity-logs';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-logs-activity',
  imports: [CommonModule, PaginationComponent, FormsModule],
  templateUrl: './logs-activity.component.html',
  styleUrl: './logs-activity.component.css'
})
export class LogsActivityComponent {
  logs!:ActivityLogs[]
  filter: String = '';
    page = 1;
    pageSize = 8;
    collectionSize: number = 0;
    start: number = 0;
    end: number = 0;
    take: number = 0;
    dataFilter: ActivityLogs[] = [];
    allData: ActivityLogs[] = [];
  
    loading=true;
  
    searchTerm: string = '';
    action = false

  constructor(private logService : ActivityLogService){}

  ngOnInit() {

    this.logService.getActivityLogs().then((data)=> {
      this.allData = data;
      this.dataFilter = data
      this.refresh();
      this.collectionSize = this.allData.length;
      this.loading = false;
    })

  }
  
  refresh() {
    this.start = (this.page - 1) * this.pageSize;
    this.end = this.start + this.pageSize;
    this.logs = this.dataFilter.map((cours, i) => ({ ...cours }))
      .slice(this.start, this.end);
    this.take = this.start + this.logs.length;
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.refresh();
  }

  search(event: any) {

    this.dataFilter = this.allData.filter((log) => {
      const term = event.target.value.toLowerCase();
      return (
        log.pseudo.toLowerCase().includes(term) ||
        log.controller.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term)||
        log.evenement.toLowerCase().includes(term) 
      );
    });
    this.collectionSize = this.dataFilter.length;
    this.refresh();
  }

}
