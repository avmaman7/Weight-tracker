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

    # Use a more permissive CORS configuration for testing
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
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

    # Add test routes that don't require authentication
    @app.route('/api/test/clients', methods=['GET'])
    def test_get_clients():
        try:
            # Create a test user if it doesn't exist
            from models import User
            test_user = User.query.filter_by(username="testuser").first()
            if not test_user:
                test_user = User(username="testuser", email="test@example.com")
                test_user.set_password("password123")
                db.session.add(test_user)
                db.session.commit()

            # Get clients for the test user
            from models import Client
            clients = Client.query.filter_by(user_id=test_user.id).all()
            return jsonify([client.to_dict() for client in clients])
        except Exception as e:
            app.logger.error(f"Error in test_get_clients: {str(e)}")
            return jsonify({"error": str(e)}), 500

    @app.route('/api/test/clients', methods=['POST'])
    def test_add_client():
        try:
            data = request.get_json()

            if not data or 'name' not in data or 'email' not in data:
                return jsonify({'error': 'Name and email are required'}), 400

            # Create a test user if it doesn't exist
            from models import User, Client
            test_user = User.query.filter_by(username="testuser").first()
            if not test_user:
                test_user = User(username="testuser", email="test@example.com")
                test_user.set_password("password123")
                db.session.add(test_user)
                db.session.commit()

            # Create new client
            new_client = Client(name=data['name'], email=data['email'], user_id=test_user.id)
            db.session.add(new_client)
            db.session.commit()

            return jsonify({'message': 'Client added successfully', 'client': new_client.to_dict()}), 201
        except Exception as e:
            app.logger.error(f"Error in test_add_client: {str(e)}")
            return jsonify({"error": str(e)}), 500

    @app.route('/api/test/user', methods=['GET'])
    def test_get_user():
        try:
            # Create a test user if it doesn't exist
            from models import User
            test_user = User.query.filter_by(username="testuser").first()
            if not test_user:
                test_user = User(username="testuser", email="test@example.com")
                test_user.set_password("password123")
                db.session.add(test_user)
                db.session.commit()

            return jsonify({'user': test_user.to_dict()}), 200
        except Exception as e:
            app.logger.error(f"Error in test_get_user: {str(e)}")
            return jsonify({"error": str(e)}), 500

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
