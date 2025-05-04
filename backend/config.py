import os
import re
from urllib.parse import urlparse, parse_qs

class Config:
    # Database configuration
    # Use SQLite for development and PostgreSQL for production
    if os.environ.get('DATABASE_URL'):
        # Get the database URL from environment
        database_url = os.environ.get('DATABASE_URL')

        # If using postgres:// protocol, replace with postgresql://
        if database_url.startswith('postgres://'):
            database_url = database_url.replace('postgres://', 'postgresql://', 1)

        # Parse the URL to add SSL parameters
        parsed_url = urlparse(database_url)
        query_params = parse_qs(parsed_url.query)

        # Create a new query string with SSL parameters
        query_params['sslmode'] = ['prefer']

        # Reconstruct the query string
        query_string = '&'.join([f"{k}={v[0]}" for k, v in query_params.items()])

        # Reconstruct the URL with the new query string
        new_url = f"{parsed_url.scheme}://{parsed_url.netloc}{parsed_url.path}"
        if query_string:
            new_url += f"?{query_string}"

        SQLALCHEMY_DATABASE_URI = new_url

        # Additional SQLAlchemy engine options for PostgreSQL
        SQLALCHEMY_ENGINE_OPTIONS = {
            'pool_pre_ping': True,  # Test connections before using them
            'pool_recycle': 300,    # Recycle connections after 5 minutes
            'connect_args': {
                'connect_timeout': 10,  # Connection timeout in seconds
                'keepalives': 1,        # Enable keepalives
                'keepalives_idle': 30   # Keepalive idle time in seconds
            }
        }
    else:
        SQLALCHEMY_DATABASE_URI = 'sqlite:///weight_tracker.db'
        SQLALCHEMY_ENGINE_OPTIONS = {}

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
