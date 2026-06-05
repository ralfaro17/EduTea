from rest_framework import serializers
from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer
from .models import User, Rooms, Messages, Students_Rooms, Events, Badges, Submissions

from typing import Type, cast

Users = cast(Type[User], get_user_model())

class UserCreationSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = Users
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'user_type', 'biography', 'password')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'
        read_only_fields = ['id', 'last_login', 'date_joined']
    
    def validate_username(self, value):
        if Users.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username already exists")
        return value


class ProfilePictureUploadSerializer(serializers.Serializer):
    profile_picture = serializers.ImageField()


class RoomsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rooms
        fields = '__all__'
    
    def validate_code(self, value):
        if Rooms.objects.filter(code=value).exists():
            raise serializers.ValidationError("This room already exists")
        return value

    def validate_teacher(self, value):
        if not Users.objects.filter(id=value.id).exists():   
            raise serializers.ValidationError("This user does not exist")
        if Users.objects.get(id=value.id).user_type != Users.UserTypes.TEACHER:
            raise serializers.ValidationError("This user is not a teacher")
        return value


class MessagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Messages
        fields = '__all__'
    
    def validate_author(self, value):
        if not Users.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("This user does not exist")
        return value
    
    def validate_room(self, value):
        if not Rooms.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("This room does not exist")
        return value


class StudentsRoomsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Students_Rooms
        fields = '__all__'
    
    def validate_student(self, value):
        print(value)
        if not Users.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("This user does not exist")
        return value
    
    def validate_room(self, value):
        if not Rooms.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("This room does not exist")
        return value


class EventsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Events
        fields = '__all__'
    
    def validate_author(self, value):
        if not Users.objects.filter(id=value).exists():
            raise serializers.ValidationError("This user does not exist")
        return value
    
    def validate_room(self, value):
        if not Rooms.objects.filter(id=value).exists():
            raise serializers.ValidationError("This room does not exist")
        return value


class BadgesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badges
        fields = '__all__'
    
    def validate_users(self, value):
        for user in value:
            if not Users.objects.filter(id=user).exists():
                raise serializers.ValidationError("This user does not exist")
        return value


class SubmissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submissions
        fields = '__all__'
    
    def validate_event(self, value):
        if not Events.objects.filter(id=value).exists():
            raise serializers.ValidationError("This event does not exist")
        return value
    
    def validate_user(self, value):
        if not Users.objects.filter(id=value).exists():
            raise serializers.ValidationError("This user does not exist")
        return value