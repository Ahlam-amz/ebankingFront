import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { EnrollementService } from '../../../core/api/enrollement.service';
import { Enrollement } from '../../../shared/models/enrollement.model';

@Component({
    selector: 'app-agent-workspace',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatProgressSpinnerModule,
        RouterModule,
    ],
    templateUrl: './agent-workspace.component.html',
    styleUrls: ['./agent-workspace.component.scss']
})
export class AgentWorkspaceComponent implements OnInit {
    pendingEnrollments: Enrollement[] = [];
    recentEnrollments: Enrollement[] = [];
    isLoading = true;
    error: string | null = null;

    constructor(private enrollmentService: EnrollementService) {}

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.isLoading = true;
        this.error = null;

       this.enrollmentService.getPendingEnrollments().subscribe({
            next: (data) => {
                this.pendingEnrollments = data;
                this.loadRecentEnrollments();
            },
            error: (err) => this.handleError('Failed to load pending enrollments')
        });
    }

   private loadRecentEnrollments(): void {
        this.enrollmentService.getRecentEnrollments().subscribe({
            next: (data) => {
                this.recentEnrollments = data;
                this.isLoading = false;
            },
            error: (err) => this.handleError('Failed to load recent enrollments')
        });
    }

    private handleError(message: string): void {
        this.error = message;
        this.isLoading = false;
        console.error(message);
    }
}