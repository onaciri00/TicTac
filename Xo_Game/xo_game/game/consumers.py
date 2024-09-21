import json
from channels.generic.websocket import AsyncWebsocketConsumer


connected_players = {}
turn_tracker = {}
game_states = {}
room_counter = 1

class TicTacToeConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_code']
        self.room_group_name = f'room_{self.room_name}'
        
        #initial room if not ready
        print("in consumer")
        if self.room_group_name not in game_states:
            game_states[self.room_group_name] = {
                'board': ['', '', '', '', '', '', '', '', ''],  
            }
        if self.room_group_name not in connected_players:
            connected_players[self.room_group_name] = []
            turn_tracker[self.room_group_name] = 'X'
            
        #check how many there 
        if len(connected_players[self.room_group_name]) >= 2:
            # Reject the connection if room already has two players
            oom_counter += 1
            new_room_code = f"room_{room_counter}"  # Create a new room code

            # Notify the frontend to create/join the new room
            await self.send(text_data=json.dumps({
                'event': 'NEW_ROOM',
                'message': new_room_code
            }))
            await self.close()  # Close the WebSocket connection for this room
            return
        else:
            connected_players[self.room_group_name].append(self.channel_name)
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()
        
        if len(connected_players[self.room_group_name]) == 1:
            await self.send(text_data=json.dumps({
                'event': 'CHOICE',
                'message': 'X'
            }))

        else:
            await self.send(text_data=json.dumps({
                'event': 'CHOICE',
                'message': 'O'
            }))


        print("number of player", len(connected_players[self.room_group_name]))
        if len(connected_players[self.room_group_name]) == 2:
            print("this game ready to play")
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_message',
                    'message': 'Game is ready to start!',
                    'event': 'START'
                }
            )
        if len(connected_players[self.room_group_name]) == 1:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_message',  
                    'event': 'wait',
                    'message': 'Waiting for the second player...'
                }
            )

    async def disconnect(self, close_code):
    # Remove the player from the list of connected players
        if self.room_group_name in connected_players:
            if self.channel_name in connected_players[self.room_group_name]:
                connected_players[self.room_group_name].remove(self.channel_name)
        
        # Notify the remaining player (if any) that the opponent has left
        if len(connected_players[self.room_group_name]) == 1:
            # Notify the remaining player that the other player left
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_message',
                    'message': 'The other player has left. You will be disconnected.',
                    'event': 'END'
                }
            )
            # Disconnect the remaining player after notification
            await self.close()

        # If no players are left, clean up the room
        if len(connected_players[self.room_group_name]) == 0:
            del connected_players[self.room_group_name]

        # Remove the player from the group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)


    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data['event']
        message = data['message']

        if event == 'START':
            TicTacToeConsumer.connect
        if event == 'MOVE':
            print('in Move', data)
            current_turn = turn_tracker[self.room_group_name]
            index = message['index']
            player = message['player']
            board = game_states[self.room_group_name]['board']
            if board[index] == '' and player == current_turn:
                board[index] = player
                print('cuurent is ', current_turn)
            if self.check_winner(board):
                for i in range(len(board)):
                    board[i] = ''
                await self.channel_layer.group_send(
                self.room_group_name,
                    {
                        'type': 'send_message',
                        'message': f'{player} wins!',
                        'event': 'END'
                    }
                )
            elif '' not in board and len(connected_players[self.room_group_name]) == 2:
                print("in draw")
                for i in range(len(board)):
                    board[i] = ''
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'send_message',
                        'message': 'It\'s a draw!',
                        'event': 'DRAW'
                    }
                )
            
            if message['player'] == current_turn:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'send_message',
                        'message': message,
                        'event': 'MOVE'
                    }
                )
            if current_turn == 'X':
                turn_tracker[self.room_group_name] = 'O'
            else:
                turn_tracker[self.room_group_name] = 'X'


    async def send_message(self, message):
        print('Sending message:', message)  # Debugging print statement
        await self.send(text_data=json.dumps({
            'event': message['event'],  # Make sure 'event' is part of message
            'message': message['message']  # Make sure 'message' is part of message
        }))
    def check_winner(self, board):
    # All possible winning combinations
        print("in winer")
        win_combinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Horizontal wins
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Vertical wins
            [0, 4, 8], [2, 4, 6]  # Diagonal wins
        ]
        for combo in win_combinations:
            if board[combo[0]] == board[combo[1]] == board[combo[2]] and board[combo[0]] != '':
                return True
        return False