from django.urls import re_path, path
from .consumers import *

websocket_urlpatterns = [
    path(r'ws/room/<int:id>/', ChatConsumer.as_asgi())
]