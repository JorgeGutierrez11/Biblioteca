from django.contrib import admin
from .models import Usuario, Libro, Reserva, Prestamo, Multa, Notificacion

admin.site.register(Usuario)
admin.site.register(Libro)
admin.site.register(Reserva)
admin.site.register(Prestamo)
admin.site.register(Multa)
admin.site.register(Notificacion)
