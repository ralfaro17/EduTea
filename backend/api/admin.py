from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django import forms
from django.utils.translation import gettext_lazy as _
from .models import *

# Custom user forms
class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('username', 'email', 'first_name', 'last_name','user_type', 'biography', 'has_profile_picture')

class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'user_type', 'biography', 'has_profile_picture')

class CustomUserAdmin(BaseUserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_staff', 'user_type', 'biography', 'has_profile_picture']
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Custom info', {'fields': ('user_type', 'biography', 'has_profile_picture')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'first_name', 'last_name', 'password1', 'password2', 'user_type', 'biography', 'has_profile_picture')}
        ),
    )

class RoomsAdminForm(forms.ModelForm):
    class Meta:
        model = Rooms
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Filter the teacher field to only show users of type TEACHER
        self.fields['teacher'].queryset = User.objects.filter(user_type=User.UserTypes.TEACHER)

# Admin class for the Rooms model
class RoomsAdmin(admin.ModelAdmin):
    form = RoomsAdminForm

    def clean(self):
        # Custom validation to ensure only users of type TEACHER can be assigned
        cleaned_data = super().clean()
        teacher = cleaned_data.get('teacher')
        if teacher and teacher.user_type != User.UserTypes.TEACHER:
            raise ValidationError("The assigned teacher must be a user of type 'TEACHER'.")
        return cleaned_data


# Register your models here.
admin.site.register(User, CustomUserAdmin)
admin.site.register(Badges)
admin.site.register(Messages)
admin.site.register(Rooms, RoomsAdmin)
admin.site.register(Students_Rooms)
admin.site.register(Events)
admin.site.register(Submissions)