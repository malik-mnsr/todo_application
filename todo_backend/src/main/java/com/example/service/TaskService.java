package com.example.service;

// src/main/java/com/example/todo/service/TaskService.java


import com.example.dto.TaskRequest;
import com.example.dto.TaskResponse;
import com.example.exception.InvalidTaskException;
import com.example.exception.TaskNotFoundException;
import com.example.model.Task;
import com.example.model.TaskStatus;
import com.example.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        // Validation du titre
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new InvalidTaskException("Le titre est obligatoire");
        }

        Task task = new Task();
        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription());
        // Le statut initial est toujours PENDING
        task.setStatus(TaskStatus.PENDING);
        task.setDueDate(request.getDueDate());

        Task savedTask = taskRepository.save(task);
        return convertToResponse(savedTask);
    }

    public List<TaskResponse> getAllTasks() {
        return taskRepository.findByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse getTaskById(Long id) {
        Task task = findTaskById(id);
        return convertToResponse(task);
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = findTaskById(id);

        // Validation: le titre ne doit pas être vide s'il est modifié
        if (request.getTitle() != null && request.getTitle().trim().isEmpty()) {
            throw new InvalidTaskException("Le titre ne peut pas être vide");
        }

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }
        // Le statut reste inchangé lors de la mise à jour

        Task updatedTask = taskRepository.save(task);
        return convertToResponse(updatedTask);
    }

    @Transactional
    public TaskResponse updateTaskStatus(Long id, TaskStatus status) {
        Task task = findTaskById(id);
        task.setStatus(status);

        Task updatedTask = taskRepository.save(task);
        return convertToResponse(updatedTask);
    }

    @Transactional
    public void deleteTask(Long id) {
        Task task = findTaskById(id);
        taskRepository.delete(task);
    }

    public List<TaskResponse> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<TaskResponse> searchTasks(String keyword) {
        return taskRepository.findByTitleContainingIgnoreCase(keyword)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<TaskResponse> getTasksSortedByDueDate() {
        return taskRepository.findByOrderByDueDateAsc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private Task findTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Tâche non trouvée avec l'ID: " + id));
    }

    private TaskResponse convertToResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());
        response.setDueDate(task.getDueDate());
        return response;
    }
}