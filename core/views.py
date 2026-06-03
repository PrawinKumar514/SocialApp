from rest_framework.decorators import api_view
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.response import Response

from .models import (
    Profile,
    Post,
    Comment,
    Follow,
    Like,
    Notification
)

from .serializers import (
    ProfileSerializer,
    PostSerializer,
    CommentSerializer,
    FollowSerializer,
    LikeSerializer,
    NotificationSerializer
)


def home(request):
    return render(request, 'index.html')

class ProfileViewSet(viewsets.ModelViewSet):

    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def get_serializer_context(self):
        return {'request': self.request}

    def create(self, request, *args, **kwargs):

        user_id = request.data.get('user_id')

        profile, created = Profile.objects.get_or_create(
            user_id=user_id
        )

        profile.bio = request.data.get(
            'bio',
            profile.bio
        )

        if 'profile_picture' in request.FILES:
            profile.profile_picture = request.FILES[
                'profile_picture'
            ]

        profile.save()

        serializer = self.get_serializer(profile)

        return Response(serializer.data)

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-id')
    serializer_class = PostSerializer

    def create(self, request, *args, **kwargs):

        user_id = request.data.get('user_id')

        post = Post.objects.create(
            user=User.objects.get(id=user_id),
            content=request.data.get('content', '')
        )

        if 'image' in request.FILES:
            post.image = request.FILES['image']
            post.save()

        serializer = self.get_serializer(post)

        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def create(self, request, *args, **kwargs):

        user_id = request.data.get('user_id')

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )
        
        comment = serializer.save(
            user=User.objects.get(id=user_id)
        )

        if comment.post.user != comment.user:

            Notification.objects.create(
                user=comment.post.user,
                message=f"{comment.user.username} commented on your post"
            )

        return Response(serializer.data)


class FollowViewSet(viewsets.ModelViewSet):
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer

    def create(self, request, *args, **kwargs):

        following_id = request.data.get('following')

        user_id = request.data.get('user_id')

        user = User.objects.get(
            id=user_id
        )

        follow = Follow.objects.filter(
            follower=user,
            following_id=following_id
        ).first()

        if follow:
            follow.delete()

            return Response({
                "message": "Unfollowed"
            })
        
        Follow.objects.create(
            follower=user,
            following_id=following_id
        )

        followed_user = User.objects.get(
            id=following_id
        )

        if followed_user != user:

            Notification.objects.create(
                user=followed_user,
                message=f"{user.username} started following you"
            )

        return Response({
            "message": "Followed"
        })


class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer

    def create(self, request, *args, **kwargs):

        post_id = request.data.get('post')

        user_id = request.data.get('user_id')

        user = User.objects.get(
            id=user_id
        )

        like = Like.objects.filter(
            user=user,
            post_id=post_id
        ).first()

        if like:
            like.delete()

            return Response({
                "message": "Unliked"
            })
        
        new_like = Like.objects.create(
            user=user,
            post_id=post_id
        )

        post = Post.objects.get(id=post_id)

        if post.user != user:

            Notification.objects.create(
                user=post.user,
                message=f"{user.username} liked your post"
            )

        return Response({
            "message": "Liked"
        })

class NotificationViewSet(viewsets.ModelViewSet):

    serializer_class = NotificationSerializer

    def get_queryset(self):

        user_id = self.request.GET.get('user_id')

        if user_id:

            return Notification.objects.filter(
                user_id=user_id
            ).order_by('-created_at')

        return Notification.objects.none()
    
@api_view(['GET'])
def unread_notification_count(request):

    user_id = request.GET.get('user_id')

    count = Notification.objects.filter(
        user_id=user_id,
        is_read=False
    ).count()

    return Response({
        "count": count
    })

@api_view(['POST'])
def mark_notifications_read(request):

    user_id = request.data.get('user_id')

    Notification.objects.filter(
        user_id=user_id,
        is_read=False
    ).update(
        is_read=True
    )

    return Response({
        "message": "Notifications marked read"
    })

@api_view(['GET'])
def user_profile(request, user_id):

    try:

        user = User.objects.get(id=user_id)

        profile = Profile.objects.get(user=user)

        posts = Post.objects.filter(user=user)

        return Response({
    "id": user.id,
    "username": user.username,
    "bio": profile.bio,
    "followers": Follow.objects.filter(
        following=user
    ).count(),
    "following": Follow.objects.filter(
        follower=user
    ).count(),
    "posts_count": posts.count(),

    "profile_picture":
        profile.profile_picture.url
        if profile.profile_picture
        else ""
        })

    except User.DoesNotExist:

        return Response(
            {"error": "User not found"},
            status=404
        )
    
@api_view(['GET'])
def user_posts(request, user_id):

    posts = Post.objects.filter(
        user_id=user_id
    ).order_by('-id')

    serializer = PostSerializer(
        posts,
        many=True,
        context={'request': request}
    )

    return Response(serializer.data)