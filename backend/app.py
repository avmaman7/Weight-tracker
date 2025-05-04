from flask import Flask, jsonify
from flask_cors import CORS
from flask_login import LoginManager
from config import Config
from models import db, User
from routes.client import client_bp
from routes.weight import weight_bp
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions with simpler CORS configuration
    CORS(app,
         origins=["http://localhost:3000", "http://localhost:3001",
                 "http://192.168.1.167:3000", "http://192.168.1.167:3001",
                 "https://weight-tracker-frontend-three.vercel.app",
                 "https://weight-tracker-frontend-1s2bk3dpe-avmaman7s-projects.vercel.app",
                 "https://weight-tracker-lilac.vercel.app"],
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         expose_headers=["Content-Type", "Authorization"])
    db.init_app(app)

    # Initialize Flask-Login
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    # Handle unauthorized access for API requests
    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({'error': 'Authentication required'}), 401

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Register blueprints
    app.register_blueprint(client_bp, url_prefix='/api/clients')
    app.register_blueprint(weight_bp, url_prefix='/api/weight')

    # Import and register auth blueprint
    from routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

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
