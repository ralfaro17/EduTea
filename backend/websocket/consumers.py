from channels.generic.websocket import AsyncWebsocketConsumer
import json
from api.models import User, Messages, Rooms
# from datetime import datetime
from dotenv import load_dotenv
from openai import OpenAI
from channels.db import database_sync_to_async
# import requests
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken


# from rest_framework.authtoken.models import Token
import os 



load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY") 
)

# Función para interactuar con el servidor de OpenAI.
def ask_chat_bot(mensaje):
    response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {
            "role": "system",
            "content": "You will be asked a question coming from an student or teacher that are using the chat of an educational app, and are using you as chat bot a tool to help them."
        },
        {
            "role": "user",
            "content": mensaje,
        },
    ],
    temperature=0.2,
    max_tokens=64,
    )
    
    if response.choices[0].message.content and len(response.choices) > 0:
        return response.choices[0].message.content.strip()
    else:
        return "Error: No response from the chat bot."

class ChatConsumer(AsyncWebsocketConsumer):
    
    online_users_per_room: list[User] = []
    
    @database_sync_to_async
    def verify_token(self, token_dict):
        token = token_dict['token']
        decoded_token: AccessToken | None = None
        try:
            decoded_token = AccessToken(token)
        except InvalidToken as e:
            print(f"Token is invalid or expired: {e}")
        
        try:
            self.user
        except AttributeError:
            if decoded_token:
                self.user = User.objects.get(id=decoded_token.payload.get("user_id"))
            else:
                raise InvalidToken("Token is invalid or expired.")
        if decoded_token:
            return True
        return False
    
    
    async def connect(self):
        # Obtención del parámetro de la URL para acceder a una sala.
        self.room_id = self.scope['url_route']['kwargs']['id']
        # Creación de un nombre de sala con base al dato de la URL.
        self.room_group_name = f'room_{self.room_id}'
        
        # # Configuración para un usuario actual en sala.
        # self.user = self.scope['user']
        
        # Creación de la sala y anexo a las capas del canal.
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        
        
        # messages = await self.get_messages()
        
            
            
            # await self.channel_layer.group_send(
            #     # Conexión con la misma sala.
            #     self.room_group_name,
            #     {
            #         'type' : 'send_users',
            #         'data_type' : 'users',
            #         'users' : self.users[self.room_group_name],
            #     }
            # )
    
    # async def send_users(self, event):
        
    #     data_type = event['data_type']
    #     users = event['users']
    
    # Evento para la desconexión de cada usuario.
    async def disconnect(self, code):
        
        # Elimina al usuario del canal de chats.
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        
        await self.close()
    
    # Recibe un evento desde el cliente a través de "websocket.send".
    async def receive(self, text_data=None, bytes_data=None):
        if text_data is None:
            return
        
        # El data es el objeto que manda el cliente, se le aplica json.loads para pasarlo a diccionario de Python.
        data = json.loads(text_data)
        valid_token = await self.verify_token(data)
        if not valid_token:
            await self.close()
        
        data_type = data['data_type']
        
        if data_type == 'message':
            
            # Acceso a un atributo de objeto del data procesado anteriormente.
            mensaje = data['message']
            first_name = data['first_name']	
            last_name = data['last_name']
            id = data['id']
            
            # Dar una respuesta para todos los clientes conectados a esta misma sala.
            await self.channel_layer.group_send(
                # Conexión con la misma sala.
                self.room_group_name,
                {
                    # Nombre del método a ejecutar para mandar la información.
                    'type' : 'enviar_mensaje',
                    # Información a enviar y recibir a través del "EVENT"
                    'data_type' : 'message',
                    'first_name' : first_name,
                    'last_name': last_name,
                    'id': id,
                    'message' : mensaje
                }
            )
    
    # Método a ejecutar para mandar la información establecida en el método anterior, el nombre de coloca en Type.
    
    async def enviar_mensaje(self, event):
        
        # Se reciben los atributos o valores establecidos en el método anterior, en este caso se estableció a mensaje.
        data_type = event['data_type']
        first_name = event['first_name']
        last_name = event['last_name']
        mensaje = event['message']
        id = event['id']
        
        await self.save_message(self.user, mensaje)
        
        await self.send(text_data=json.dumps({
            # Se manda un valor de clave "mensaje".
            'data_type' : data_type,
            'content' : mensaje,
            'author': id,
            'first_name' : first_name,
            'last_name' : last_name
        }))
        
        if mensaje.startswith("/Edubot"):
            mensaje = ask_chat_bot(mensaje)
            first_name = "EduBot"
            last_name = ""
            id = 88
            await self.save_message(self.user, mensaje)
            await self.send(text_data=json.dumps({
                # Se manda un valor de clave "mensaje".
                'data_type' : data_type,
                'content' : mensaje,
                'author': id,
                'first_name' : first_name,
                'last_name' : last_name
            }))
        
        # Messages.objects.create(room=Rooms.objects.get(id=self.room_id), author=User.objects.get(id=id), content=mensaje, date=datetime.now())
        
        # Envío del mensaje al cliente.
        # El JSON.dumps es para enviar de forma serializada la información al cliente.
    
    @database_sync_to_async
    def save_message(self, user, message):
        Messages.objects.create(room=Rooms.objects.get(id=self.room_id), author=user, content=message)
        return 