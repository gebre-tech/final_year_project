#contacts/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.AddFriendView.as_view(), name='add_friend'),
    path('list/', views.GetContactsView.as_view(), name='get_contacts'),
]

