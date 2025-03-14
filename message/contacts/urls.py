#contacts/urls.py
from django.urls import path
from contacts.views import AddFriendView, GetContactsView
urlpatterns = [
    path('add/', AddFriendView.as_view(), name='add_friend'),
    path('list/',GetContactsView.as_view(), name='get_contacts'),
]

