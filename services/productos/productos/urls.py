#!/usr/bin/env python

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/products/', include('core.urls')),
    path('api/categories/', include('core.urls')),
]