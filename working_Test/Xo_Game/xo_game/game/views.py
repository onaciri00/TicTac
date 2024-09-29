
# Create your views here.
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Room
from .serializers import RoomSerializer

class RoomListCreateAPIView(APIView):
    
    def get(self, request):
        rooms = Room.objects.filter(players__lt=2)
        if rooms.exists():
            room = rooms.first()  
            room.players += 1
            room.save()
            serializer = RoomSerializer(room)
            if room.players == 2:
                room.players += 1
            return Response(serializer.data)
        return Response({"message": "No available rooms"}, status=404)

    def post(self, request):
        code = request.data.get('code')
        room = Room.objects.create(code=code)
        serializer = RoomSerializer(room)
        return Response(serializer.data)