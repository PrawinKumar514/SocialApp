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
    NotificationViewSet
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

    path('', home, name='home'),

    path('api/', include(router.urls)),
]