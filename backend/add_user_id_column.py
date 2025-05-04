"""
Script to add user_id column to client table if it doesn't exist.
This is meant to be run on the Render server.
"""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, ForeignKey, inspect
import os

app = Flask(__name__)

# Use the DATABASE_URL from environment (Render sets this)
if os.environ.get('DATABASE_URL'):
    database_url = os.environ.get('DATABASE_URL')
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///weight_tracker.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

def add_user_id_column():
    """Add user_id column to client table if it doesn't exist."""
    with app.app_context():
        inspector = inspect(db.engine)
        columns = [col['name'] for col in inspector.get_columns('client')]

        if 'user_id' not in columns:
            print("Adding user_id column to client table...")
            with db.engine.connect() as conn:
                conn.execute(db.text('ALTER TABLE client ADD COLUMN user_id INTEGER REFERENCES "user"(id)'))
                conn.commit()
            print("Column added successfully!")
        else:
            print("user_id column already exists in client table.")

if __name__ == '__main__':
    add_user_id_column()
