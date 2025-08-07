from django.urls import path, include
from .routing import websocket_urlpatterns

urlpatterns = [
    path('ws/', include(websocket_urlpatterns)),
]