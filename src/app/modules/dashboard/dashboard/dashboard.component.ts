


import { Component, OnInit,inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '../../../core/api/dashboard.service';
import { DashboardStats } from '../../../shared/models/dashboard.model';
import { CommonModule, DatePipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { MatChipListbox, MatChip } from '@angular/material/chips';
import { ClientService } from '../../../core/api/client.service';
import { Client } from '../../../shared/models/client.model';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    RouterModule,
    DatePipe,
    MatChipListbox, MatChip
  ],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  stats!: DashboardStats;
  loading = true;
  lastUpdated = new Date();

  private clientService = inject(ClientService)

  // Chart configurations
  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    // @ts-ignore
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          color: '#333',
          font: { size: 12 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const value = context.raw as number;
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${context.label}: ${value} (${percentage}%)`;
          }
        },
        displayColors: true,
        backgroundColor: 'rgba(0,0,0,0.7)',
        bodyColor: '#fff',
        titleColor: '#fff'
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true
    },
    elements: {
      arc: {
        borderWidth: 0,
        spacing: 2
      }
    }
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true }
    },
    plugins: {
      legend: { display: false }
    }
  };

  genderChartData: ChartData<'doughnut'> = {
    labels: ['Male', 'Female'],
    datasets: [{
      data: [1, 1],
      backgroundColor: ['#3f51b5', '#e91e63'],
      hoverBackgroundColor: ['#2c387e', '#ad1457'],
      borderWidth: 0
    }]
  };

  accountsChartData: ChartData<'bar'> = {
    labels: ['Initializing...'],
    datasets: [{
      label: 'Accounts',
      data: [1],
      backgroundColor: '#2ecc71',
      borderRadius: 4
    }]
  };

  displayedColumns = ['client', 'accountType', 'date', 'status'];
  recentEnrollments: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initializeCharts();
    this.loadData();
  }

  private initializeCharts() {
    this.genderChartData = {
      labels: ['Male', 'Female'],
      datasets: [{
        data: [1, 1],
        backgroundColor: ['#3f51b5', '#e91e63'],
        hoverBackgroundColor: ['#2c387e', '#ad1457'],
        borderWidth: 0
      }]
    };

    this.accountsChartData = {
      labels: ['Initializing...'],
      datasets: [{
        label: 'Accounts',
        data: [1],
        backgroundColor: '#2ecc71',
        borderRadius: 4
      }]
    };
  }

  loadData() {
    this.loading = true;
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.lastUpdated = new Date();
        this.updateCharts();
        this.prepareRecentEnrollments();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private updateCharts() {
    if (this.stats?.maleFemaleRatio) {
      this.genderChartData = {
        labels: ['Male', 'Female'],
        datasets: [{
          data: [
            this.stats.maleFemaleRatio['male'] || 0,
            this.stats.maleFemaleRatio['female'] || 0
          ],
          backgroundColor: ['#3f51b5', '#e91e63'],
          hoverBackgroundColor: ['#2c387e', '#ad1457'],
          borderWidth: 0
        }]
      };
    }

    if (this.stats?.accountsByType) {
      this.accountsChartData = {
        labels: this.stats.accountsByType.map(a => a.type),
        datasets: [{
          label: 'Accounts by Type',
          data: this.stats.accountsByType.map(a => a.count),
          backgroundColor: ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c', '#9b59b6'],
          borderRadius: 4
        }]
      };
    }

    setTimeout(() => {
      this.chart?.update();
      this.cdr.detectChanges();
    }, 100);
  }

  /*private prepareRecentEnrollments() {
    if (this.stats?.recentEnrollments) {
      this.recentEnrollments = this.stats.recentEnrollments.map(enrollment => ({
       statusClass: this.getStatusClass(enrollment.statut),
      // Ensure client object exists with prenom and nom
      //client: this.clientService.getClientById(enrollment.clientId),
      client: { prenom: 'Loading...', nom: '' } 
    }));
       this.recentEnrollments.forEach(enrollment => {
      if (enrollment.clientId) {
        this.clientService.getClientById(enrollment.clientId).subscribe({
          next: (client) => {
            enrollment.client = client;
            this.cdr.detectChanges(); // Trigger change detection
          },
          error: () => {
            enrollment.client = { prenom: 'Unknown', nom: 'Client' };
            this.cdr.detectChanges();
          }
        });
      }
    });
    console.log('Processed enrollments:', this.recentEnrollments); // Debug log
    }

  }*/

    private prepareRecentEnrollments() {
    if (this.stats?.recentEnrollments) {
        this.recentEnrollments = this.stats.recentEnrollments.map(enrollment => ({
            ...enrollment,
            statusClass: this.getStatusClass(enrollment.statut),
            // Use client data directly from the enrollment if available
            client: enrollment.client || { prenom: 'Unknown', nom: 'Client' }
        }));
        console.log('Processed enrollments:', this.recentEnrollments);
    }
}

  // Add this new helper method
private getStatusClass(status: string): string {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('valide') || statusLower.includes('active')) {
    return 'status-active';
  } else if (statusLower.includes('attente') || statusLower.includes('pending')) {
    return 'status-pending';
  } else if (statusLower.includes('rejete') || statusLower.includes('rejected')) {
    return 'status-rejected';
  }
  return 'status-unknown';
}

  getRandomColor(): string {
    const colors = [
      '#3f51b5', '#673ab7', '#9c27b0', '#e91e63', 
      '#f44336', '#ff5722', '#ff9800', '#4caf50',
      '#009688', '#00bcd4', '#2196f3'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  refreshData(): void {
    this.loadData();
  }

  getStatusIcon(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('valide') || statusLower.includes('active')) {
      return 'check_circle';
    } else if (statusLower.includes('attente') || statusLower.includes('pending')) {
      return 'pending';
    } else if (statusLower.includes('rejete') || statusLower.includes('rejected')) {
      return 'cancel';
    }
    return 'help';
  }

  viewAllEnrollments(): void {
  // Implement your navigation logic here
  console.log('View all enrollments clicked');
  // Example: this.router.navigate(['/enrollments']);
}
}