from .serializers import MessagesSerializer, RoomsSerializer, StudentsRoomsSerializer
from .models import User, Rooms, Messages, Students_Rooms

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
# from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
# from rest_framework_simplejwt.authentication import JWTAuthentication
# from rest_framework import permissions

from django.contrib.auth import get_user_model
from djoser.views import UserViewSet
# from string import ascii_uppercase

from typing import Type, cast


# import random
# import json


Users = cast(Type[User], get_user_model())


class ResendActivationThrottle(UserRateThrottle):
    rate = '1/minute'

# Create your views here.
class CustomPagination(PageNumberPagination):
    page_size = 30
    page_size_query_param = 'page_size'
    max_page_size = 1000


class CustomResendActivationView(UserViewSet):
    throttle_classes = [ResendActivationThrottle]
    
    def resend_activation(self, request, *args, **kwargs):
        return super().resend_activation(request, *args, **kwargs)

class TestView(APIView):
    http_method_names = ['get']
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({"message": "Hello World"})


class RoomsList(APIView):
    http_method_names = ['get', 'post']
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticated]
    
    
    def get(self, request):
        user_type = request.user.user_type
        limit = False
        if request.query_params.get('limit'):
            limit = int(request.query_params.get('limit', 0))
        
        if user_type == User.UserTypes.TEACHER:
            rooms = Rooms.objects.all().filter(teacher=request.user, is_active=True)
            if limit:
                rooms = rooms[:limit]
        elif user_type == User.UserTypes.STUDENT:
            rooms_id = Students_Rooms.objects.all().filter(student=request.user, is_active=True).values('room')
            rooms = Rooms.objects.all().filter(id__in=rooms_id, is_active=True)
            if limit:
                rooms = rooms[:limit]
        elif user_type == User.UserTypes.ADMIN:
            rooms = Rooms.objects.all()
            if limit:
                rooms = rooms[:limit]
        else:
            # default to empty queryset to avoid unbound variable
            rooms = Rooms.objects.none()
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(rooms, request)
        serializer = RoomsSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    def post(self, response):
        try:
            teacher = Users.objects.get(email=response.data["teacher_email"])
        except Users.DoesNotExist:
            return Response({"error": "this teacher does not exist"}, status = status.HTTP_404_NOT_FOUND)
        
        if teacher.user_type != User.UserTypes.TEACHER:
            return Response({"error": "this user is not a teacher"}, status = status.HTTP_400_BAD_REQUEST)
        
        del response.data["teacher_email"]
        response.data["teacher"] = str(teacher.id)
        
        serializer = RoomsSerializer(data = response.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)


class RoomDetails(APIView):
    http_method_names = ['get', 'put', 'patch', 'delete']
    permission_classes = [IsAuthenticated]
    
    def get(self, request, room_id):
        try:
            room = Rooms.objects.get(id = room_id)
        except Rooms.DoesNotExist:
            return Response({"error": "this room does not exist"}, status = status.HTTP_404_NOT_FOUND)
        
        if not room.is_active:
            return Response({"error": "this room is not active"}, status = status.HTTP_404_NOT_FOUND)
        
        serializer = RoomsSerializer(room)
        return Response(serializer.data)
    
    def put(self, request, room_id):
        if request.user.user_type != 2 and request.user.user_type != 3:
            return Response({"error": "you do not have permission to perform this action"}, status = status.HTTP_403_FORBIDDEN)
        
        try:
            room = Rooms.objects.get(id = room_id)
        except Rooms.DoesNotExist:
            return Response({"error": "this room does not exist"}, status = status.HTTP_404_NOT_FOUND)
        
        if not room.is_active:
            return Response({"error": "this room is not active"}, status = status.HTTP_404_NOT_FOUND)
        
        serializer = RoomsSerializer(room, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_200_OK)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, room_id):
        # Denies permission to any type of user that is not a teacher or an admin
        if request.user.user_type != 2 and request.user.user_type != 3:
            return Response({"error": "you do not have permission to perform this action"}, status = status.HTTP_403_FORBIDDEN)
        
        try:
            room = Rooms.objects.get(id = room_id)
        except Rooms.DoesNotExist:
            return Response({"error": "this room does not exist"}, status = status.HTTP_404_NOT_FOUND)
        
        if not room.is_active:
            return Response({"error": "this room is not active"}, status = status.HTTP_404_NOT_FOUND)
        
        serializer = RoomsSerializer(room, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_200_OK)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, room_id):
        if request.user.user_type != 2 and request.user.user_type != 3:
            return Response({"error": "you do not have permission to perform this action"}, status = status.HTTP_403_FORBIDDEN)
        
        try:
            room = Rooms.objects.get(id = room_id)
        except Rooms.DoesNotExist:
            return Response({"error": "this room does not exist"}, status = status.HTTP_404_NOT_FOUND)
        
        if not room.is_active:
            return Response({"error": "this room is not active"}, status = status.HTTP_404_NOT_FOUND)
        
        room.is_active = False
        room.save()
        return Response(status = status.HTTP_204_NO_CONTENT)


class StudentsRoomsList(APIView):
    http_method_names = ['get', 'post']
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.query_params.get('limit'):
            limit = int(request.query_params.get('limit', 0))
            students_rooms = Students_Rooms.objects.all().filter(is_active=True)[:limit]
        else:
            students_rooms = Students_Rooms.objects.all()
        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(students_rooms, request)
        serializer = StudentsRoomsSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    def post(self, request):
        if request.user.user_type != 1:
            return Response({"error": "you are not a student"}, status = status.HTTP_403_FORBIDDEN)
        try:
            room = Rooms.objects.get(room_code=request.data["room_code"])
        except Rooms.DoesNotExist:
            return Response({"error": "this room does not exist"}, status = status.HTTP_404_NOT_FOUND)
        
        if not room.is_active:
            return Response({"error": "this room is not active"}, status = status.HTTP_404_NOT_FOUND)
        
        print(request.data)
        
        data = {
            "student": str(request.user.id),
            "room": str(room.id)
        }

        
        serializer = StudentsRoomsSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)



class StudentRoomDetails(APIView):
    http_method_names = ['get', 'put', 'patch', 'delete']
    permission_classes = [IsAuthenticated]
    
    def get(self, request, id):
        try:
            student_room = Students_Rooms.objects.get(id = id)
        except Students_Rooms.DoesNotExist:
            return Response({"error": "this student is not part of the room"}, status = status.HTTP_404_NOT_FOUND)
        
        if not student_room.is_active:
            return Response({"error": "this student is not active in the room"}, status = status.HTTP_404_NOT_FOUND)
        
        serializer = StudentsRoomsSerializer(student_room)
        return Response(serializer.data)

    def put(self, request, id):
        try:
            student_room = Students_Rooms.objects.get(id = id)
        except Students_Rooms.DoesNotExist:
            return Response({"error": "this student room does not exist"}, status = status.HTTP_404_NOT_FOUND)
        
        if not student_room.is_active:
            return Response({"error": "this student room is not active"}, status = status.HTTP_404_NOT_FOUND)
        
        serializer = StudentsRoomsSerializer(student_room, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_200_OK)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, id):
        try:
            student_room = Students_Rooms.objects.get(id = id)
        except Students_Rooms.DoesNotExist:
            return Response({"error": "this student is not part of the room"}, status = status.HTTP_404_NOT_FOUND)
        
        if not student_room.is_active:
            return Response({"error": "this student is not active in the room"}, status = status.HTTP_404_NOT_FOUND)
        
        serializer = StudentsRoomsSerializer(student_room, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_200_OK)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
        try:
            student_room = Students_Rooms.objects.get(id = id)
        except Students_Rooms.DoesNotExist:
            return Response({"error": "this student is not part of the room"}, status = status.HTTP_404_NOT_FOUND)
        
        if not student_room.is_active:
            return Response({"error": "this student is not active in the room"}, status = status.HTTP_404_NOT_FOUND)
        
        student_room.is_active = False
        student_room.save()
        return Response(status = status.HTTP_204_NO_CONTENT)

class MessagesList(APIView):
    http_method_names = ['get', 'post']
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        limit = False
        if request.query_params.get('limit'):
            limit = int(request.query_params.get('limit', 0))
        
        if request.query_params.get('room'):
            room_id = int(request.query_params.get('room', 0))
        else:
            return Response({"error": "room id is required"}, status = status.HTTP_400_BAD_REQUEST)
        try:
            room = Rooms.objects.get(id = room_id)
        except Rooms.DoesNotExist:
            return Response({"error": "this room does not exist"}, status = status.HTTP_404_NOT_FOUND)
        
        messages = Messages.objects.filter(room=room).annotate()
        
        if limit:
            messages = messages[:limit]
            paginator = self.pagination_class()
            result_page = paginator.paginate_queryset(messages, request)
            serializer = MessagesSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)
        else:
            serializer = MessagesSerializer(messages, many=True)
            return Response(serializer.data)
        
    
    def post(self, response):
        serializer = MessagesSerializer(data = response.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)


class MessagesListUpdate(APIView):
    http_method_names = ['get', 'put', 'patch', 'delete']
    
    def get(self, request, id):
        try:
            message = Messages.objects.get(id = id)
        except Messages.DoesNotExist:
            return Response({"error": "this message does not exist"}, status = status.HTTP_404_NOT_FOUND)
        
        serializer = MessagesSerializer(message)
        return Response(serializer.data)
    def put(self, request, id):
        try:
            message = Messages.objects.get(id = id)
        except Messages.DoesNotExist:
            return Response({"error": "this message does not exist"}, status = status.HTTP_404_NOT_FOUND)
        
        serializer = MessagesSerializer(message, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_200_OK)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, id):
        try:
            message = Messages.objects.get(id = id)
        except Messages.DoesNotExist:
            return Response({"error": "this message does not exist"}, status = status.HTTP_404_NOT_FOUND)
        
        serializer = MessagesSerializer(message, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_200_OK)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
        try:
            message = Messages.objects.get(id = id)
        except Messages.DoesNotExist:
            return Response({"error": "this message does not exist"}, status = status.HTTP_404_NOT_FOUND)
        
        message.delete()
        return Response(status = status.HTTP_204_NO_CONTENT)

