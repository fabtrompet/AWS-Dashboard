from django.urls import path

from . import views

urlpatterns = [
	path('actions', views.actions, name='actions'),
    path('getData', views.getData, name='getData'),
    path('', views.index, name='index'),
    path('login', views.login, name='login'),
]
