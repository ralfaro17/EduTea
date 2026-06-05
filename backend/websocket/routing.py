from django.urls import path
from .consumers import ChatConsumer

websocket_urlpatterns = [
    path(r'ws/room/<int:id>/', ChatConsumer.as_asgi()) # type: ignore
]