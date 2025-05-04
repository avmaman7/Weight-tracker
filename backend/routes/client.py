from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
from models import db, Client

client_bp = Blueprint('client', __name__)

# Add a new client
@client_bp.route('', methods=['POST'])
@login_required
def add_client():
    try:
        data = request.get_json()

        if not data or 'name' not in data or 'email' not in data:
            return jsonify({'error': 'Name and email are required'}), 400

        # Check if client with email already exists
        existing_client = Client.query.filter_by(email=data['email']).first()
        if existing_client:
            return jsonify({'error': 'Email already registered'}), 409

        # Create new client
        new_client = Client(name=data['name'], email=data['email'], user_id=current_user.id)
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
@login_required
def get_all_clients():
    try:
        # Only show clients belonging to the current user
        clients = Client.query.filter_by(user_id=current_user.id).all()
        return jsonify([client.to_dict() for client in clients])
    except Exception as e:
        # Log the error
        current_app.logger.error(f"Error getting clients: {str(e)}")
        # Return a more helpful error message
        return jsonify({'error': f'Failed to get clients: {str(e)}'}), 500

# Get a single client
@client_bp.route('/<int:client_id>', methods=['GET'])
@login_required
def get_client(client_id):
    try:
        client = Client.query.get_or_404(client_id)
        # Check if the client belongs to the current user
        if client.user_id != current_user.id:
            return jsonify({'error': 'Unauthorized access'}), 403
        return jsonify(client.to_dict())
    except Exception as e:
        # Log the error
        current_app.logger.error(f"Error getting client {client_id}: {str(e)}")
        # Return a more helpful error message
        return jsonify({'error': f'Failed to get client: {str(e)}'}), 500

# Delete a client
@client_bp.route('/<int:client_id>', methods=['DELETE'])
@login_required
def delete_client(client_id):
    try:
        client = Client.query.get_or_404(client_id)
        # Check if the client belongs to the current user
        if client.user_id != current_user.id:
            return jsonify({'error': 'Unauthorized access'}), 403
        db.session.delete(client)
        db.session.commit()
        return jsonify({'message': 'Client deleted successfully'})
    except Exception as e:
        # Log the error
        current_app.logger.error(f"Error deleting client {client_id}: {str(e)}")
        # Return a more helpful error message
        return jsonify({'error': f'Failed to delete client: {str(e)}'}), 500
