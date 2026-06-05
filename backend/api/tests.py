from django.contrib.auth import get_user_model
from django.test import TestCase
from .models import User

from typing import Type, cast

Users = cast(Type[User], get_user_model())

# Create your tests here.
class UsersManagersTests(TestCase):

    def test_create_user(self):
        user = Users.objects.create_user(email="normal@user.com", password="foo")
        self.assertEqual(user.email, "normal@user.com")
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        try:
            # username is None for the AbstractUser option
            # username does not exist for the AbstractBaseUser option
            self.assertIsNone(user.username)
        except AttributeError:
            pass
        with self.assertRaises(ValueError):
            Users.objects.create_user()
        with self.assertRaises(ValueError):
            Users.objects.create_user(email="")
        with self.assertRaises(ValueError):
            Users.objects.create_user(email="", password="foo")

    def test_create_superuser(self):
        admin_user = Users.objects.create_superuser(email="super@user.com", password="foo", user_type=3)
        self.assertEqual(admin_user.email, "super@user.com")
        self.assertEqual(admin_user.user_type, 3)
        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
        try:
            # username is None for the AbstractUser option
            # username does not exist for the AbstractBaseUser option
            self.assertIsNone(admin_user.username)
        except AttributeError:
            pass
        with self.assertRaises(ValueError):
            Users.objects.create_superuser(
                email="super@user.com", password="foo", user_type=3, is_superuser=False)
