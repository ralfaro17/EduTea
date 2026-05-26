from django.contrib.auth.models import (
    AbstractUser,
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils import timezone
from django.core.exceptions import ValidationError
import random
from string import ascii_uppercase


# useful methods
def generate_code():
    generar = True
    code = ""
    while generar:
        code = ""
        for i in range(12):
            random_number = random.randint(0, 1)
            if random_number == 1:
                code += random.choice(ascii_uppercase)
            else:
                code += str(random.randint(0, 9))

        object = Rooms.objects.filter(room_code=code)
        if not object.exists():
            generar = False
    return code


# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The email field must be set")

        if extra_fields.get("user_type") is None:
            raise ValueError("The user_type field must be set")

        if password is None:
            raise ValueError("The password field must be set")

        if (
            extra_fields.get("user_type") == 1 or extra_fields.get("user_type") == 2
        ) and (extra_fields.get("is_staff") or extra_fields.get("is_superuser")):
            raise ValueError("Students and Teachers cannot be staff or superusers")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("user_type", 3)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True")

        if extra_fields.get("user_type") != 3:
            raise ValueError("Superuser must have user_type=3")

        # user_type set to 3 because it is the admin user type
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):

    class UserTypes(models.IntegerChoices):
        STUDENT = 1
        TEACHER = 2
        ADMIN = 3

    # Django user field
    id: models.UUIDField
    date_joined = models.DateTimeField(
        default=timezone.now, editable=True, verbose_name="Date Joined"
    )
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=50, blank=True, null=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    is_active = models.BooleanField(default=True, verbose_name="Is Active")
    is_staff = models.BooleanField(default=False, verbose_name="Is Staff")
    is_superuser = models.BooleanField(default=False, verbose_name="Is Superuser")

    # New user fields
    user_type = models.IntegerField(
        choices=UserTypes.choices, default=UserTypes.STUDENT, verbose_name="User Type"
    )
    biography = models.CharField(max_length=512, blank=True, null=True)
    has_profile_picture = models.BooleanField(
        default=False, verbose_name="Has Profile Picture"
    )

    # Properties
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "first_name", "last_name", "user_type", "biography"]

    # Associated user manager
    objects = UserManager()

    # Methods
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    def __str__(self):
        return f"{self.first_name} | {self.email}"

    def save(self, *args, **kwargs):
        if self.pk is not None:
            # Check if the field has changed
            old_value = User.objects.get(pk=self.pk).user_type
            if self.user_type != old_value:
                raise ValidationError(
                    "You cannot change the value of immutable_field after creation."
                )
        super(User, self).save(*args, **kwargs)


class Rooms(models.Model):
    id: models.UUIDField
    room_name = models.CharField(max_length=64)
    room_code = models.CharField(max_length=12, unique=True, default=generate_code)
    description = models.CharField(max_length=512)
    teacher = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="room_teacher", blank=True, null=True
    )
    creation_date = models.DateTimeField(auto_now_add=True)
    theme = models.CharField(max_length=32, blank=True)
    schedule = models.CharField(max_length=128, blank=True)
    is_active = models.BooleanField(default=True)
    has_room_image = models.BooleanField(default=False)
    students = models.ManyToManyField(
        User, through="Students_Rooms", related_name="room_students"
    )
    messages = models.ManyToManyField(
        User, through="Messages", related_name="room_messages"
    )

    def clean(self):
        if self.teacher and self.teacher.user_type != User.UserTypes.TEACHER:
            raise ValidationError("The assigned teacher must be a user of type 'TEACHER'.")

    def __str__(self):
        return self.room_name


class Messages(models.Model):
    room = models.ForeignKey(
        Rooms, on_delete=models.CASCADE, related_name="message_room"
    )
    author = models.ForeignKey(
        User, on_delete=models.DO_NOTHING, related_name="message_author"
    )
    content = models.TextField()
    sent_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return  self.content + " | " + self.author.email


class Students_Rooms(models.Model):
    student = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="student_room_student"
    )
    room = models.ForeignKey(
        Rooms, on_delete=models.CASCADE, related_name="student_room_room"
    )
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        # TODO: Implement a more meaningful string representation for the model
        return "placeholder text"


class Events(models.Model):
    room = models.ForeignKey(Rooms, on_delete=models.CASCADE, related_name="event_room")
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="event_author"
    )
    title = models.CharField(max_length=64)
    description = models.CharField(max_length=512)
    event_date = models.DateTimeField(blank=True, null=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_optional = models.BooleanField(default=False)
    points = models.IntegerField(
        default=0,
        blank=True,
        null=True,
        validators=[MaxValueValidator(100), MinValueValidator(0)],
    )
    submissions = models.ManyToManyField(
        User, through="Submissions", related_name="event_submissions"
    )

    def __str__(self) -> str:
        # TODO: Implement a more meaningful string representation for the model
        return "placeholder text"


class Badges(models.Model):
    name = models.CharField(max_length=32)
    description = models.CharField(max_length=512)
    icon = models.URLField()
    users = models.ManyToManyField(User, related_name="badge_users")

    def __str__(self) -> str:
        # TODO: Implement a more meaningful string representation for the model
        return "placeholder text"


class Submissions(models.Model):
    event = models.ForeignKey(
        Events, on_delete=models.CASCADE, related_name="submission_event"
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="submission_user"
    )
    submission = models.URLField()
    submission_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        # TODO: Implement a more meaningful string representation for the model
        return "placeholder text"
