"""
Sérialiseur pour le profil employé avec les détails utilisateur.

Ce module définit la sérialisation/désérialisation des objets EmployeProfile
pour l'API REST avec inclusion complète des détails utilisateur.
"""

from rest_framework import serializers
from users.models.employe import EmployeProfile
from users.models.base_user import User


class UserSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour les informations utilisateur de base.
    """
    class Meta:
        model = User
        fields = ['id', 'email', 'is_active', 'role']


class EmployeSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour le modèle EmployeProfile avec détails utilisateur complets.
    """
    user = UserSerializer(read_only=True)

    class Meta:
        model = EmployeProfile
        fields = ['id', 'user', 'nom', 'prenom', 'matricule', 'identifiant_telephone']
        read_only_fields = ['id']

    def create(self, validated_data):
        """
        Crée un nouveau profil employé.
        """
        return super().create(validated_data)
