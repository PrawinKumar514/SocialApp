from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.response import Response

from .models import Profile, Post, Comment, Follow, Like

from .serializers import (
    ProfileSerializer,
    PostSerializer,
    CommentSerializer,
    FollowSerializer,
    LikeSerializer
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

        serializer.save(
            user=User.objects.get(id=user_id)
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

        Like.objects.create(
            user=user,
            post_id=post_id
        )

        return Response({
            "message": "Liked"
        })