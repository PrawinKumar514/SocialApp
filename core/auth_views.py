from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)

    user = User.objects.create_user(
        username=username,
        password=password
    )

    return Response({
        'message': 'User created successfully'
    })


@csrf_exempt
@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(
        username=username,
        password=password
    )

    if user:
        return Response({
            'message': 'Login successful',
            'username': user.username,
            'user_id': user.id
        })

    return Response({
        'error': 'Invalid credentials'
    }, status=400)