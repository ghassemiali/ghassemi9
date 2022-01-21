from django.urls import path
from website.views import *

app_name = 'website'

urlpatterns = [
    path('', home_view, name='home'),
    path('about/', about_view, name='about'),
    path('contact/', contact_view, name='contact'),
    path('elements/', elements_view, name='elements'),
    path('newsletter/', newsletter_view, name='newsletter'),
    path('test/', test_view, name='test'),
    path('error/', error_view, name='error'),
]
