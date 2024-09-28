import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Room

connected_players = {}
turn_tracker = {}
game_states = {}

class TicTacToeConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_code = self.scope['url_route']['kwargs']['room_code']
        self.room_group_name = f'room_{self.room_code}'

        if self.room_group_name not in game_states:
            game_states[self.room_group_name] = {
                'board': ['', '', '', '', '', '', '', '', ''],  
            }
        if self.room_group_name not in connected_players:
            connected_players[self.room_group_name] = []
            turn_tracker[self.room_group_name] = 'X'
        
        if len(connected_players[self.room_group_name]) >= 2:
            await self.close()
            return
        
        connected_players[self.room_group_name].append(self.channel_name)
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        if len(connected_players[self.room_group_name]) == 1:
            await self.send(text_data=json.dumps({'event': 'CHOICE', 'message': 'X'}))
        else:
            await self.send(text_data=json.dumps({'event': 'CHOICE', 'message': 'O'}))

        if len(connected_players[self.room_group_name]) == 2:
            turn_tracker[self.room_group_name] = 'X'
            print("the actual value is ", turn_tracker[self.room_group_name])
            await self.channel_layer.group_send(
                self.room_group_name,
                {'type': 'send_message', 'message': 'Game is ready to start!', 'event': 'START'}
            )
        else:
            await self.channel_layer.group_send(
                self.room_group_name,
                {'type': 'send_message', 'message': 'Waiting for the second player...', 'event': 'wait'}
            )
    async def disconnect(self, close_code):
        if self.room_group_name in connected_players:
            if self.channel_name in connected_players[self.room_group_name]:
                connected_players[self.room_group_name].remove(self.channel_name)
                room = Room.objects.get(code=self.room_code)
                room.players -= 1
                room.save()
        
        if len(connected_players[self.room_group_name]) == 1:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_message',
                    'message': 'The other player has left. You will be disconnected.',
                    'event': 'END'
                }
            )
            await self.close()

        if len(connected_players[self.room_group_name]) == 0:
            del connected_players[self.room_group_name]
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)


    async def receive(self, text_data):
        data = json.loads(text_data)
        event = data['event']
        message = data['message']
        is_game_over = False

        if event == 'START':
            TicTacToeConsumer.connect
        if event == 'MOVE':
            print('in Move', data)
            current_turn = turn_tracker[self.room_group_name]
            index = message['index']
            player = message['player']
            board = game_states[self.room_group_name]['board']
            print("player is ", player, " index is ", index, "it is ", board[index] == '' , "current turn ", current_turn, "it is ", turn_tracker[self.room_group_name])
            if board[index] == '' and player == current_turn:
                board[index] = player
                print('cuurent is ', current_turn)
            if self.check_winner(board):
                is_game_over = True
                turn_tracker[self.room_group_name] = 'X'
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
                turn_tracker[self.room_group_name] = 'X'
                is_game_over = True
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
            if turn_tracker[self.room_group_name] == 'X' and is_game_over == False:
                turn_tracker[self.room_group_name] = 'O'
            elif turn_tracker[self.room_group_name] == 'O' and is_game_over == False:
                turn_tracker[self.room_group_name] = 'X'


    async def send_message(self, message):
        print('Sending message:', message)  
        await self.send(text_data=json.dumps({
            'event': message['event'],  
            'message': message['message']  
        }))
    def check_winner(self, board):
        win_combinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  
            [0, 4, 8], [2, 4, 6]
        ]
        for combo in win_combinations:
            if board[combo[0]] == board[combo[1]] == board[combo[2]] and board[combo[0]] != '':
                return True
        return False