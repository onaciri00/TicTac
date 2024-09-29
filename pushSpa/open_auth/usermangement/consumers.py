# consumers.py
import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from your_app_name.models import User_info  # Import User_info model

class StatusConsumer(WebsocketConsumer):
    # When the user connects to WebSocket (e.g., opens the page)
    def connect(self):
        self.user = self.scope["user"]  # Get the user making the connection
        
        if self.user.is_authenticated:  # Check if the user is logged in
            # Update the user status to online
            self.update_user_status(online=True)
            # Join the user to a group (to notify other users)
            async_to_sync(self.channel_layer.group_add)("user_status", self.channel_name)
            self.accept()  # Accept the WebSocket connection

    # When the user disconnects (e.g., closes the page)
    def disconnect(self, close_code):
        if self.user.is_authenticated:
            # Update the user status to offline
            self.update_user_status(online=False)
            # Remove the user from the group
            async_to_sync(self.channel_layer.group_discard)("user_status", self.channel_name)

    # Helper function to update the user status
    def update_user_status(self, online):
        user_info = User_info.objects.get(username=self.user.username)
        user_info.is_online = online  # Set their online status
        user_info.save()

        # Notify all clients in the group about the status change
        async_to_sync(self.channel_layer.group_send)(
            "user_status",
            {
                "type": "user_status_update",
                "username": user_info.username,
                "is_online": user_info.is_online,
            }
        )

    # Handle receiving status updates (broadcast to clients)
    def user_status_update(self, event):
        # Send a message to the WebSocket client
        self.send(text_data=json.dumps({ # Converts this dictionary into a JSON string 
            "username": event["username"],
            "is_online": event["is_online"]
        }))
