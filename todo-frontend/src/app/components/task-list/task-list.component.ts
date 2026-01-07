import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { TaskResponse, TaskStatus } from '../../models/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskEditComponent } from '../task-edit/task-edit.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, TaskFormComponent, TaskEditComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: TaskResponse[] = [];
  searchTerm = '';
  TaskStatus = TaskStatus;
  showAddModal = false;
  showEditModal = false;
  selectedTaskToEdit: TaskResponse | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        console.log('✅ Tasks loaded:', data);
        this.tasks = data;
        console.log('📋 Tasks array updated:', this.tasks);
      },
      error: (err) => {
        console.error('❌ Error loading tasks:', err);
      }
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.taskService.searchTasks(this.searchTerm).subscribe({
        next: (data) => {
          console.log('✅ Search results:', data);
          this.tasks = data;
        },
        error: (err) => console.error('❌ Error searching:', err)
      });
    } else {
      this.loadTasks();
    }
  }

  toggleStatus(task: TaskResponse): void {
    let nextStatus: TaskStatus;
    if (task.status === TaskStatus.PENDING) {
      nextStatus = TaskStatus.IN_PROGRESS;
    } else if (task.status === TaskStatus.IN_PROGRESS) {
      nextStatus = TaskStatus.DONE;
    } else {
      return;
    }

    this.taskService.updateStatus(task.id!, nextStatus).subscribe({
      next: () => {
        console.log('✅ Task status updated');
        this.loadTasks();
      },
      error: (err) => console.error('❌ Error updating status:', err)
    });
  }

  toggleStatusBackward(task: TaskResponse): void {
    let prevStatus: TaskStatus;
    if (task.status === TaskStatus.DONE) {
      prevStatus = TaskStatus.IN_PROGRESS;
    } else if (task.status === TaskStatus.IN_PROGRESS) {
      prevStatus = TaskStatus.PENDING;
    } else {
      return;
    }

    this.taskService.updateStatus(task.id!, prevStatus).subscribe({
      next: () => {
        console.log('✅ Task status reverted');
        this.loadTasks();
      },
      error: (err) => console.error('❌ Error reverting status:', err)
    });
  }

  deleteTask(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          console.log('✅ Task deleted');
          this.loadTasks();
        },
        error: (err) => console.error('❌ Error deleting task:', err)
      });
    }
  }

  openAddTaskModal(): void {
    this.showAddModal = true;
    console.log('🔓 Add modal opened');
  }

  closeAddModal(): void {
    this.showAddModal = false;
    console.log('🔒 Add modal closed');
  }

  onTaskAdded(): void {
    console.log('✨ Task added event');
    this.loadTasks();
  }

  openEditTaskModal(task: TaskResponse): void {
    this.selectedTaskToEdit = task;
    this.showEditModal = true;
    console.log('🔓 Edit modal opened for task:', task.id);
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedTaskToEdit = null;
    console.log('🔒 Edit modal closed');
  }

  onTaskUpdated(): void {
    console.log('✏️ Task updated event');
    this.loadTasks();
  }

  getStatusLabel(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.PENDING:
        return 'À faire';
      case TaskStatus.IN_PROGRESS:
        return 'En cours';
      case TaskStatus.DONE:
        return 'Terminé';
      default:
        return status;
    }
  }

  trackByTaskId(index: number, task: TaskResponse): number {
    return task.id!;
  }
}