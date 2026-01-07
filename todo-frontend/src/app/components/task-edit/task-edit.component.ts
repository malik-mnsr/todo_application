import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { TaskRequest, TaskResponse, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit {
  @Input() task: TaskResponse | null = null;
  @Output() taskUpdated = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  taskForm: TaskRequest = {
    title: '',
    description: '',
    dueDate: undefined
  };
  isSubmitting = false;
  errors: { [key: string]: string } = {};

  private readonly MIN_TITLE_LENGTH = 3;
  private readonly MAX_TITLE_LENGTH = 100;
  private readonly MAX_DESCRIPTION_LENGTH = 500;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    if (this.task) {
      this.taskForm = {
        title: this.task.title,
        description: this.task.description,
        dueDate: this.task.dueDate
      };
    }
  }

  onSubmit(): void {
    this.errors = {};

    if (!this.validateForm()) {
      return;
    }

    if (!this.task) return;

    this.isSubmitting = true;
    console.log('📤 Updating task:', this.taskForm);

    this.taskService.updateTask(this.task.id!, this.taskForm).subscribe({
      next: (response) => {
        console.log('✅ Task updated successfully:', response);
        this.taskUpdated.emit();
        this.closeModal.emit();
      },
      error: (err) => {
        console.error('❌ Error updating task:', err);
        this.handleError(err);
        this.isSubmitting = false;
      }
    });
  }

  private validateForm(): boolean {
    let isValid = true;

    const title = this.taskForm.title.trim();
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

    if (this.taskForm.description && this.taskForm.description.length > this.MAX_DESCRIPTION_LENGTH) {
      this.errors['description'] = `La description ne peut pas dépasser ${this.MAX_DESCRIPTION_LENGTH} caractères`;
      isValid = false;
    }

    if (this.taskForm.dueDate) {
      const dueDate = new Date(this.taskForm.dueDate);
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
    if (err.error && err.error.message) {
      this.errors['general'] = err.error.message;
    } else if (err.error && typeof err.error === 'string') {
      this.errors['general'] = err.error;
    } else {
      this.errors['general'] = 'Une erreur est survenue lors de la mise à jour de la tâche';
    }
  }

  onCancel(): void {
    this.closeModal.emit();
  }

  getCharCount(field: 'title' | 'description'): string {
    const value = field === 'title' ? this.taskForm.title : this.taskForm.description;
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
