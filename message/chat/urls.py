from django.urls import path
from .views import SendMessageView, GetMessagesView, MarkAsReadView, create_group_chat, upload_attachment

urlpatterns = [
    path('send-message/', SendMessageView.as_view(), name='send_message'),
    path('get-messages/<int:user_id>/', GetMessagesView.as_view(), name='get_messages'),
    path('mark-as-read/<int:message_id>/', MarkAsReadView.as_view(), name='mark_as_read'),
    path('create-group-chat/', create_group_chat, name='create_group_chat'),
    path('upload-attachment/<int:chat_id>/', upload_attachment, name='upload_attachment'),
]