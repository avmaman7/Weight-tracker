from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
from models import db, Client, User

client_bp = Blueprint('client', __name__)

# For testing purposes only - remove in production
def get_test_user():
    """Get or create a test user for development purposes"""
    test_user = User.query.filter_by(username="testuser").first()
    if not test_user:
        test_user = User(username="testuser", email="test@example.com")
        test_user.set_password("password123")
        db.session.add(test_user)
        db.session.commit()
    return test_user

# Add a new client
@client_bp.route('', methods=['POST'])
# @login_required  # Temporarily disabled for testing
def add_client():
    try:
        data = request.get_json()

        if not data or 'name' not in data or 'email' not in data:
            return jsonify({'error': 'Name and email are required'}), 400

        # Check if client with email already exists
        existing_client = Client.query.filter_by(email=data['email']).first()
        if existing_client:
            return jsonify({'error': 'Email already registered'}), 409

        # For testing: use test user instead of current_user
        test_user = get_test_user()

        # Create new client
        new_client = Client(name=data['name'], email=data['email'], user_id=test_user.id)
        db.session.add(new_client)
        db.session.commit()

        return jsonify({'message': 'Client added successfully', 'client': new_client.to_dict()}), 201
    except Exception as e:
        # Log the error
        current_app.logger.error(f"Error adding client: {str(e)}")
        # Return a more helpful error message
        return jsonify({'error': f'Failed to add client: {str(e)}'}), 500

# Get all clients
@client_bp.route('', methods=['GET'])
# @login_required  # Temporarily disabled for testing
def get_all_clients():
    try:
        # For testing: use test user instead of current_user
        test_user = get_test_user()

        # Only show clients belonging to the test user
        clients = Client.query.filter_by(user_id=test_user.id).all()
        return jsonify([client.to_dict() for client in clients])
    except Exception as e:
        # Log the error
        current_app.logger.error(f"Error getting clients: {str(e)}")
        # Return a more helpful error message
        return jsonify({'error': f'Failed to get clients: {str(e)}'}), 500

# Get a single client
@client_bp.route('/<int:client_id>', methods=['GET'])
# @login_required  # Temporarily disabled for testing
def get_client(client_id):
    try:
        client = Client.query.get_or_404(client_id)
        # For testing: use test user instead of current_user
        test_user = get_test_user()

        # Check if the client belongs to the test user
        if client.user_id != test_user.id:
            return jsonify({'error': 'Unauthorized access'}), 403
        return jsonify(client.to_dict())
    except Exception as e:
        # Log the error
        current_app.logger.error(f"Error getting client {client_id}: {str(e)}")
        # Return a more helpful error message
        return jsonify({'error': f'Failed to get client: {str(e)}'}), 500

# Delete a client
@client_bp.route('/<int:client_id>', methods=['DELETE'])
# @login_required  # Temporarily disabled for testing
def delete_client(client_id):
    try:
        client = Client.query.get_or_404(client_id)
        # For testing: use test user instead of current_user
        test_user = get_test_user()

        # Check if the client belongs to the test user
        if client.user_id != test_user.id:
            return jsonify({'error': 'Unauthorized access'}), 403
        db.session.delete(client)
        db.session.commit()
        return jsonify({'message': 'Client deleted successfully'})
    except Exception as e:
        # Log the error
        current_app.logger.error(f"Error deleting client {client_id}: {str(e)}")
        # Return a more helpful error message
        return jsonify({'error': f'Failed to delete client: {str(e)}'}), 500
