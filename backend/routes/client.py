from flask import Blueprint, request, jsonify
from models import db, Client

client_bp = Blueprint('client', __name__)

# Add a new client
@client_bp.route('', methods=['POST'])
def add_client():
    data = request.get_json()

    if not data or 'name' not in data or 'email' not in data:
        return jsonify({'error': 'Name and email are required'}), 400

    # Check if client with email already exists
    existing_client = Client.query.filter_by(email=data['email']).first()
    if existing_client:
        return jsonify({'error': 'Email already registered'}), 409

    # Create new client
    new_client = Client(name=data['name'], email=data['email'])
    db.session.add(new_client)
    db.session.commit()

    return jsonify({'message': 'Client added successfully', 'client': new_client.to_dict()}), 201

# Get all clients
@client_bp.route('', methods=['GET'])
def get_all_clients():
    clients = Client.query.all()
    return jsonify([client.to_dict() for client in clients])

# Get a single client
@client_bp.route('/<int:client_id>', methods=['GET'])
def get_client(client_id):
    client = Client.query.get_or_404(client_id)
    return jsonify(client.to_dict())

# Delete a client
@client_bp.route('/<int:client_id>', methods=['DELETE'])
def delete_client(client_id):
    client = Client.query.get_or_404(client_id)
    db.session.delete(client)
    db.session.commit()
    return jsonify({'message': 'Client deleted successfully'})
