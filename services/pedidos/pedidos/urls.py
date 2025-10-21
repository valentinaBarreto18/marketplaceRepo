from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/orders/', include('core.urls')),
    path('api/cart/', include('core.urls')),
]