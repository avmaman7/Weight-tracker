from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db
from routes.client import client_bp
from routes.weight import weight_bp
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    CORS(app)
    db.init_app(app)

    # Register blueprints
    app.register_blueprint(client_bp, url_prefix='/api/clients')
    app.register_blueprint(weight_bp, url_prefix='/api/weight')

    # Add a health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy", "environment": os.environ.get('FLASK_ENV', 'development')})

    # Add an error handler for database connection issues
    @app.errorhandler(500)
    def handle_500_error(e):
        app.logger.error(f"Internal Server Error: {str(e)}")
        return jsonify({"error": "Internal Server Error", "message": "A database error occurred. Please try again later."}), 500

    # Create database tables
    with app.app_context():
        try:
            db.create_all()
            app.logger.info("Database tables created successfully")
        except Exception as e:
            app.logger.error(f"Error creating database tables: {str(e)}")
            # Don't raise the exception, let the app continue to start
            # This allows the health check endpoint to work even if the DB is down

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=8000, host='0.0.0.0')
