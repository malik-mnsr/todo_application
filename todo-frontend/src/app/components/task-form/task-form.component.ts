import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { TaskRequest, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  @Output() taskAdded = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  task: TaskRequest = {
    title: '',
    description: '',
    status: TaskStatus.PENDING,
    dueDate: undefined
  };
  isSubmitting = false;
  errors: { [key: string]: string } = {};

  private readonly MIN_TITLE_LENGTH = 3;
  private readonly MAX_TITLE_LENGTH = 100;
  private readonly MAX_DESCRIPTION_LENGTH = 500;

  constructor(private taskService: TaskService) {}

  onSubmit(): void {
    this.errors = {};
    
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    console.log('📤 Submitting task:', this.task);

    this.taskService.createTask(this.task).subscribe({
      next: (response) => {
        console.log('✅ Task created successfully:', response);
        this.taskAdded.emit();
        this.resetForm();
        this.closeModal.emit();
      },
      error: (err) => {
        console.error('❌ Error creating task:', err);
        this.handleError(err);
        this.isSubmitting = false;
      }
    });
  }

  private validateForm(): boolean {
    let isValid = true;

    const title = this.task.title.trim();
    if (!title) {
      this.errors['title'] = 'Le titre est obligatoire';
      isValid = false;
    } else if (title.length < this.MIN_TITLE_LENGTH) {
      this.errors['title'] = `Le titre doit contenir au moins ${this.MIN_TITLE_LENGTH} caractères`;
      isValid = false;
    } else if (title.length > this.MAX_TITLE_LENGTH) {
      this.errors['title'] = `Le titre ne peut pas dépasser ${this.MAX_TITLE_LENGTH} caractères`;
      isValid = false;
    }

    if (this.task.description && this.task.description.length > this.MAX_DESCRIPTION_LENGTH) {
      this.errors['description'] = `La description ne peut pas dépasser ${this.MAX_DESCRIPTION_LENGTH} caractères`;
      isValid = false;
    }

    if (this.task.dueDate) {
      const dueDate = new Date(this.task.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        this.errors['dueDate'] = 'La date d\'échéance doit être dans le futur';
        isValid = false;
      }
    }

    return isValid;
  }

  private handleError(err: any): void {
    if (err.error && err.error.errors) {
      err.error.errors.forEach((error: any) => {
        this.errors[error.field || 'general'] = error.message;
      });
    } else if (err.error && typeof err.error === 'string') {
      this.errors['general'] = err.error;
    } else {
      this.errors['general'] = 'Une erreur est survenue lors de la création de la tâche';
    }
  }

  resetForm(): void {
    this.task = {
      title: '',
      description: '',
      status: TaskStatus.PENDING,
      dueDate: undefined
    };
    this.errors = {};
  }

  onCancel(): void {
    this.resetForm();
    this.closeModal.emit();
  }

  getCharCount(field: 'title' | 'description'): string {
    const value = field === 'title' ? this.task.title : this.task.description;
    const maxLength = field === 'title' ? this.MAX_TITLE_LENGTH : this.MAX_DESCRIPTION_LENGTH;
    const length = value ? value.length : 0;
    return `${length}/${maxLength}`;
  }

  hasError(field: string): boolean {
    return !!this.errors[field];
  }

  getError(field: string): string {
    return this.errors[field] || '';
  }
}
