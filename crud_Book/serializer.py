from rest_framework import serializers
from .models import Usuario, Libro, Reserva, Prestamo, Multa, Notificacion

# Serializer para Usuario
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

# Serializer para Libro
class LibroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Libro
        fields = '__all__'

# Serializer para Reserva
class ReservaSerializer(serializers.ModelSerializer):
    libro = LibroSerializer(read_only=True)
    libro_id = serializers.PrimaryKeyRelatedField(
        queryset=Libro.objects.all(), source='libro', write_only=True
    )

    class Meta:
        model = Reserva
        fields = ['id', 'usuario', 'libro', 'libro_id', 'fecha_reserva', 'estado_reserva']


# Serializer para Prestamo
class PrestamoSerializer(serializers.ModelSerializer):
    reserva = ReservaSerializer(read_only=True)

    class Meta:
        model = Prestamo
        fields = '__all__'

# Serializer para Multa
class MultaSerializer(serializers.ModelSerializer):
    reserva = PrestamoSerializer(read_only=True)

    class Meta:
        model = Multa
        fields = '__all__'

# Serializer para Notificacion
class NotificacionSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    reserva = ReservaSerializer(read_only=True)
    prestamo = PrestamoSerializer(read_only=True)
    multa = MultaSerializer(read_only=True)

    class Meta:
        model = Notificacion
        fields = '__all__'
