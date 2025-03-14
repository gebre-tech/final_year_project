from rest_framework import serializers
from authentication.models import User
<<<<<<< Updated upstream

from rest_framework_simplejwt.tokens import RefreshToken
=======
from rest_framework.authtoken.models import Token
>>>>>>> Stashed changes


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["username"],
            email=validated_data["email"]
        )
        user.set_password(validated_data["password"])  # Hash the password properly
        user.save()
        Token.objects.create(user=user)  # Create a token for the user
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = User.objects.filter(email=data['email']).first()

        if user is None or not user.check_password(data['password']):
            raise serializers.ValidationError("Invalid email or password")

        token, created = Token.objects.get_or_create(user=user)
        return {
<<<<<<< Updated upstream
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            'user': UserSerializer(user).data,
=======
            "token": token.key,
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
            }
>>>>>>> Stashed changes
        }

