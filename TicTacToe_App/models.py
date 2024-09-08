from django.db import models

# Create your models here.

class GameResult(models.Model):
    # X, O, or Draw 
    winner = models.CharField(max_length=10)
    #to store time
    date = models.DateTimeField()

    #for debugging
    def __str__(self):
        return f"{self.winner} won on {self.date}"