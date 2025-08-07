from django.urls import path
from . import views

app_name = 'api'

urlpatterns = [ 
    path("users/resend_activation/", views.CustomResendActivationView.as_view({'post': 'resend_activation'}), name="resend_activation"),
    path("test/", views.TestView.as_view(), name="test"),
    path("rooms/", views.RoomsList.as_view(), name="rooms_list"),
    path("rooms/<int:room_id>/", views.RoomDetails.as_view(), name="rooms_list"),
    path("messages/", views.MessagesList.as_view(), name="messages_list"),
    # path("messages/<int:id>/", views.MessagesDetail.as_view(), name="messages_detail"),
    path("students-rooms/", views.StudentsRoomsList.as_view(), name="students_rooms_list"),
    path("students-rooms/<int:id>/", views.StudentRoomDetails.as_view(), name="students_rooms_detail"),
    # path("events/", views.EventsList.as_view(), name="events_list"),
    # path("events/<int:id>/", views.EventsDetail.as_view(), name="events_detail"),
    # path("users/", views.UserList.as_view(), name="users_list"),
    # path("users/<int:id>/", views.UserDetail.as_view(), name="users_detail"),
    # path("badges/", views.BadgesList.as_view(), name="badges_list"),
    # path("badges/<int:id>/", views.BadgesDetail.as_view(), name="badges_detail"),
    # path("submissions/", views.SubmissionsList.as_view(), name="submissions_list"),
    # path("submissions/<int:id>/", views.SubmissionsDetail.as_view(), name="submissions_detail"),
]