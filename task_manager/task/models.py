from django.db import models

class Task(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    deadline = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at'] #task terbaru muncul paling atas

    def __str__(self):
        return self.title
    
class ActivityLog(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='logs')
    message = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True) #otomatis saat membuat log

    class Meta:
        ordering = ['-timestamp'] #log terbaru muncul paling atas

    def __str__(self):
        return f"{self.timestamp} - {self.message}"