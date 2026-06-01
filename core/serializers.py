from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Post, Comment, Follow, Like


class UserSerializer(serializers.ModelSerializer):

    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'followers_count',
            'following_count'
        ]

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = '__all__'

    def to_representation(self, instance):

        data = super().to_representation(instance)

        if instance.profile_picture:

            request = self.context.get('request')

            if request:

                data['profile_picture'] = (
                    request.build_absolute_uri(
                        instance.profile_picture.url
                    )
                )

        return data


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)

    likes_count = serializers.SerializerMethodField()

    comments = CommentSerializer(
        source='comment_set',
        many=True,
        read_only=True
    )

    class Meta:
        model = Post
        fields = '__all__'

    def get_likes_count(self, obj):
        return obj.like_set.count()

    def to_representation(self, instance):

        data = super().to_representation(instance)

        if instance.image:

            request = self.context.get('request')

            if request:

                data['image'] = request.build_absolute_uri(
                    instance.image.url
                )

        return data


class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = '__all__'


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'