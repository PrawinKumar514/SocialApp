from .auth_views import register, login
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    home,
    ProfileViewSet,
    PostViewSet,
    CommentViewSet,
    FollowViewSet,
    LikeViewSet,
    NotificationViewSet,
    unread_notification_count,
    mark_notifications_read,
    user_profile,
    user_posts,
    toggle_save_post
)

router = DefaultRouter()

router.register(r'profiles', ProfileViewSet)

router.register(r'posts', PostViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'follows', FollowViewSet)
router.register(r'likes', LikeViewSet)

router.register(
    r'notifications',
    NotificationViewSet,
    basename='notification'
)

urlpatterns = [

    path('api/register/', register),
    path('api/login/', login),

    path(
        'api/notifications/count/',
        unread_notification_count
    ),

    path(
        'api/notifications/read/',
        mark_notifications_read
    ),

    path(
        'api/profile/<int:user_id>/',
        user_profile
    ),

    path(
        'api/user-posts/<int:user_id>/',
        user_posts
    ),

    path(
        'api/save-post/',
        toggle_save_post
    ),

    path('', home, name='home'),

    path('api/', include(router.urls)),
]