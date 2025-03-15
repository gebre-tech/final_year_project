# contacts/urls.py
from django.urls import path
from contacts.views import AddFriendView, GetContactsView, SearchContactsView, SearchUsersView

urlpatterns = [
    path('add/', AddFriendView.as_view(), name='add_friend'),
    path('list/', GetContactsView.as_view(), name='get_contacts'),
    path('search/', SearchContactsView.as_view(), name='search_contacts'),
    path('search/users/', SearchUsersView.as_view(), name='search_users'),
]