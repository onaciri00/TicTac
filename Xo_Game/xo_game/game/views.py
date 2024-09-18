from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Room
from .serializers import RoomSerializer

class RoomListCreateAPIView(APIView):
    def get(self, request):
        print("there is  a room")
        rooms = Room.objects.all()
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)

    def post(self, request):
        print("create a room")
        room = Room.objects.create(code=request.data['code'])
        serializer = RoomSerializer(room)
        return Response(serializer.data)
