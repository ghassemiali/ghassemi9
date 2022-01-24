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

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


STATIC_ROOT = '/home/mayramin/public_html/static'
MEDIA_ROOT = '/home/mayramin/public_html/media'

STATICFILES_DIRS = [
    BASE_DIR / 'statics'
]

CSRF_COOKIE_SECURE = True
