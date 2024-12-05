from django.db import models
from datetime import timedelta
from django.utils.timezone import now

# Tabla Usuarios
class Usuario(models.Model):
    codigo = models.CharField(max_length=20, unique=True)
    nombre = models.CharField(max_length=100)
    correo = models.EmailField(max_length=100)
    contraseña = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


# Tabla Libros
class Libro(models.Model):
    titulo = models.CharField(max_length=200)
    autor = models.CharField(max_length=100)
    categoria = models.CharField(max_length=50, null=True, blank=True)
    cantidad_disponible = models.IntegerField(default=0)
    portada = models.URLField(max_length=500, null=True, blank=True) 
    def __str__(self):
        return self.titulo


# Tabla Reservas
from django.utils.timezone import now
from datetime import timedelta

class Reserva(models.Model):
    ESTADO_RESERVA = [
        ('Pendiente', 'Pendiente'),
        ('Entregado', 'Entregado'),
        ('Cancelado', 'Cancelado')
    ]
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE)
    fecha_reserva = models.DateTimeField(auto_now_add=True)
    estado_reserva = models.CharField(max_length=10, choices=ESTADO_RESERVA, default='Pendiente')

    def save(self, *args, **kwargs):
        is_new = self.pk is None

        if not is_new:
            old_instance = Reserva.objects.get(pk=self.pk)
            if old_instance.estado_reserva != 'Entregado' and self.estado_reserva == 'Entregado':
                Prestamo.objects.create(
                    reserva=self,
                    fecha_entrega=now(),
                    fecha_maxima=now() + timedelta(days=7)
                )
        super().save(*args, **kwargs)
        # Crear una notificación
        mensaje = (
            f"Se ha realizado una nueva reserva para el libro '{self.libro.titulo}'."
            if is_new else
            f"El estado de la reserva del libro '{self.libro.titulo}' ha cambiado a '{self.estado_reserva}'."
        )
        Notificacion.objects.create(
            usuario=self.usuario,
            reserva=self,
            mensaje=mensaje,
            fecha_envio=now()
        )

    def __str__(self):
        return f"Reserva {self.id} - {self.libro.titulo}"



# Tabla Prestamos
class Prestamo(models.Model):
    ESTADO_PRESTAMO = [
        ('Activo', 'Activo'),
        ('Devuelto', 'Devuelto'),
        ('Multado', 'Multado')
    ]
    reserva = models.ForeignKey(Reserva, on_delete=models.CASCADE)
    fecha_entrega = models.DateTimeField()
    fecha_devolucion = models.DateTimeField(null=True, blank=True)
    fecha_maxima = models.DateTimeField()
    estado_prestamo = models.CharField(max_length=10, choices=ESTADO_PRESTAMO, default='Activo')

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        
        #Crear multa
        if not is_new:
            old_instance = Prestamo.objects.get(pk=self.pk)          
            if old_instance.estado_prestamo != 'Multado' and self.estado_prestamo == 'Multado':
                monto_multa = 10000;
                Multa.objects.create(
                    reserva=self,
                    monto=monto_multa,
                    fecha_generada=now(),
                    estado_multa='Pendiente'
                )
        
        # Crear una notificación 
        mensaje = (
            f"Se ha realizado el prestamo del libro '{self.reserva.libro.titulo}'."
            if is_new else
            f"El estado del prestamo del libro '{self.reserva.libro.titulo}' ha cambiado a '{self.estado_prestamo}'."
        )
        Notificacion.objects.create(
            usuario=self.reserva.usuario, 
            mensaje=mensaje,
            fecha_envio=now()
        )
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"Préstamo {self.id} - {self.reserva.libro.titulo}"

# Tabla Multas
class Multa(models.Model):
    ESTADO_MULTA = [
        ('Pendiente', 'Pendiente'), 
        ('Pagada', 'Pagada')
    ]
    reserva = models.ForeignKey(Prestamo, on_delete=models.CASCADE)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_generada = models.DateTimeField(auto_now_add=True)
    estado_multa = models.CharField(max_length=10, choices=ESTADO_MULTA, default='Pendiente')

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)

        # Determinar mensaje para la notificación
        if is_new or self.estado_multa == 'Pendiente':
            mensaje = f"Tienes una deuda con un monto total de: '{self.monto}'."
        elif self.estado_multa == 'Pagada':
            mensaje = f"La deuda con un monto total de: '{self.monto}' ha sido pagada."
        else:
            mensaje = None

        # Crear notificación si se generó un mensaje
        if mensaje:
            Notificacion.objects.create(
                usuario=self.reserva.reserva.usuario,
                multa=self,
                mensaje=mensaje,
                fecha_envio=now()
            )
    def __str__(self):
        return f"Multa {self.id} - ${self.monto}"


# Tabla Notificaciones
class Notificacion(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    reserva = models.ForeignKey(Reserva, null=True, blank=True, on_delete=models.SET_NULL)
    prestamo = models.ForeignKey(Prestamo, null=True, blank=True, on_delete=models.SET_NULL)
    multa = models.ForeignKey(Multa, null=True, blank=True, on_delete=models.SET_NULL)
    mensaje = models.TextField()
    fecha_envio = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notificación {self.id} - {self.usuario.nombre}"
