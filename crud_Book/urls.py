from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
    
router.register(r'usuarios', views.UsuarioViewSet)
router.register(r'libros', views.LibroViewSet)
router.register(r'reservas', views.ReservaViewSet)
router.register(r'prestamos', views.PrestamoViewSet)
router.register(r'multas', views.MultaViewSet)
router.register(r'notificaciones', views.NotificacionViewSet)

# Incluye las rutas del router en las URLs
urlpatterns = [
    path('api/', include(router.urls)),
]
