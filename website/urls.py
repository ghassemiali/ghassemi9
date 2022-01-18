from django.urls import path
from website.views import home_view, about_view, contact_view, elements_view, test_view, newsletter_view

app_name = 'website'

urlpatterns = [
    path('', home_view, name='home'),
    path('about/', about_view, name='about'),
    path('contact/', contact_view, name='contact'),
    path('elements/', elements_view, name='elements'),
    path('newsletter/', newsletter_view, name='newsletter'),
    path('test/', test_view, name='test')
]
