from ghassemi7.settings import *
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-$gp^_#+my6pip#*62lhu#n@#vij^vdb1tfb*x+==1k%6h*euiq'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['mayraminam.com', 'www.mayraminam.com']

# site framework
SITE_ID = 2

# Database

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'mayramin_travel',  # the name of engine in mayraminam.com
        'USER': 'mayramin_ali',     # the name of database in mayraminam.com
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

X_FRAME_OPTIONS = 'SAMEORIGIN'
#X-Content-Type-Options
SECURE_CONTENT_TYPE_NOSNIFF = True
## Strict-Transport-Security
SECURE_HSTS_SECONDS = 15768000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

## that requests over HTTP are redirected to HTTPS. aslo can config in webserver
SECURE_SSL_REDIRECT = True 

# for more security
CSRF_COOKIE_SECURE = True
CSRF_USE_SESSIONS = True
CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = 'Strict'