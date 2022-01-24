from ghassemi7.settings import *
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-$gp^_#+my6pip#*62lhu#n@#vij^vdb1tfb*x+==1k%6h*euiq'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['mayraminam.com', 'www.mayraminam.com']

# site framework
SITE_ID = 2

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

# after changing the database from sqlite to MySQL in production, it will not poassible to run below command
# python manage.py runserver settings=ghassemi7.setting.prod
# after doing this, just can run and test in computer with below command
# python manage.py runserver settings=ghassemi7.setting.dev

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'mayramin_travel',
        'USER': 'mayramin_ali',
        'PASSWORD': 'Ali@2631981',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}


STATIC_ROOT = '/home/mayramin/public_html/static'
MEDIA_ROOT = '/home/mayramin/public_html/media'

STATICFILES_DIRS = [
    BASE_DIR / 'statics'
]

CSRF_COOKIE_SECURE = True
