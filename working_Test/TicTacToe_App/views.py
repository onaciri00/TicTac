from django.shortcuts import render
from django.http import JsonResponse
from .models import GameResult
import json
# Create your views here.


def store_result(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        winner = data.get('winner')
        date = data.get('date')

        GameResult.objects.create(winner=winner, date=date)
        return JsonResponse({'status': 'success'}, status=200)
