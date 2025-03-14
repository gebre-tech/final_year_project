#contacts/urls.py
from django.urls import path
from contacts.views import AddFriendView, GetContactsView
urlpatterns = [
<<<<<<< Updated upstream
    path('add/', AddFriendView.as_view(), name='add_friend'),
    path('list/',GetContactsView.as_view(), name='get_contacts'),
=======
    path('add/', views.AddFriendView.as_view(), name='add_friend'),
    path('list/', views.GetContactsView.as_view(), name='get_contacts'),
    path('search/', views.SearchContactsView.as_view(), name='search_contacts'),
    path('search_users/', views.SearchUsersView.as_view(), name='search_users'),  # Add search users endpoint
>>>>>>> Stashed changes
]

