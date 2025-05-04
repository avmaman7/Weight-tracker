import os

class Config:
    # SQLite database configuration
    SQLALCHEMY_DATABASE_URI = 'sqlite:///weight_tracker.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
