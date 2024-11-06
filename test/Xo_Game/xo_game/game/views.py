# Create your views here.
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Room
from .serializers import RoomSerializer

class RoomListCreateAPIView(APIView):
    
    def post(self, request):
        rooms = Room.objects.filter(players__lt=2)
        if rooms.exists():
            room = rooms.first()
            room.players += 1
            room.openent = request.data.get("user")
            room.save()
            serializer = RoomSerializer(room)
            return Response(serializer.data)
        else:
            code = request.data.get('code')
            user = request.data.get('user') 
            room = Room.objects.create(code=code)
            room.defender = user
            serializer = RoomSerializer(room)
            return Response(serializer.data)