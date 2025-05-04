import os
import re

class Config:
    # Database configuration
    # Use SQLite for development and PostgreSQL for production
    if os.environ.get('DATABASE_URL'):
        # Fix for Render PostgreSQL connection
        database_url = os.environ.get('DATABASE_URL')
        # If using postgres:// protocol, replace with postgresql://
        if database_url.startswith('postgres://'):
            database_url = database_url.replace('postgres://', 'postgresql://', 1)
        # Add SSL mode to avoid SSL errors
        if 'postgresql://' in database_url and '?' not in database_url:
            database_url += '?sslmode=require'
        elif 'postgresql://' in database_url and '?' in database_url:
            database_url += '&sslmode=require'

        SQLALCHEMY_DATABASE_URI = database_url
    else:
        SQLALCHEMY_DATABASE_URI = 'sqlite:///weight_tracker.db'

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
