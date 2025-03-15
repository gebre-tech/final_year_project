# setup for backend
- git clone https://github.com/gebre-tech/backend
- cd backend
-   python -m venv venv (create vertual environment)
-   venv\Scripts\activate
    pip install daphne
    pip install djangorestframework
    pip install djangorestframework-simplejwt
    pip install django-cors-headers
    pip install channels
    pip install channels-redis
-in ....backend\message\message\setting.py
change DB cofiguration according to your DB setup
  -or use my config DATABASES = {
                    'default': {
                        'ENGINE': 'django.db.backends.postgresql',
                        'NAME': 'message_db',
                        'USER': 'postgres',
                        'PASSWORD': '1234',
                        'HOST': 'localhost',
                        'PORT': '5432',
                        }
                    }
-(venv)C:.....backend\message\   $ python manage.py makemigrations
                                 $ python manage.py migrate
                                 $ python manage.py runserver
                       
