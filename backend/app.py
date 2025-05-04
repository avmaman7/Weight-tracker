from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from routes.client import client_bp
from routes.weight import weight_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    CORS(app)
    db.init_app(app)

    # Register blueprints
    app.register_blueprint(client_bp, url_prefix='/api/clients')
    app.register_blueprint(weight_bp, url_prefix='/api/weight')

    # Create database tables
    with app.app_context():
        db.create_all()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=8000, host='0.0.0.0')
