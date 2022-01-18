from django.urls import path
from blog.views import *

app_name = 'blog'

urlpatterns = [
    path('', blog_home, name='home'),
    path('<int:pid>/', blog_single, name='blog-single'),
    path('category/<str:cat_name>', blog_home, name='blog-category'),
    path('author/<str:author_username>', blog_home, name='blog-author'),
    path('search/', blog_search, name='blog-search'),
    path('tag/<str:tag_name>', blog_home, name='blog-tag')
    #path('<int:pid>/', test_view, name='test')
]
