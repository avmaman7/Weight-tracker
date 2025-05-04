from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
from models import db, WeightEntry, Client
from datetime import datetime

weight_bp = Blueprint('weight', __name__)

# Add a weight entry
@weight_bp.route('', methods=['POST'])
@login_required
def add_weight_entry():
    data = request.get_json()

    if not data or 'weight' not in data or 'client_id' not in data:
        return jsonify({'error': 'Weight and client_id are required'}), 400

    # Check if client exists
    client = Client.query.get(data['client_id'])
    if not client:
        return jsonify({'error': 'Client not found'}), 404

    # Check if the client belongs to the current user
    if client.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized access'}), 403

    # Parse date if provided, otherwise use today's date
    date = datetime.now().date()
    if 'date' in data and data['date']:
        try:
            date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

    # Create new weight entry
    entry = WeightEntry(
        weight=data['weight'],
        date=date,
        client_id=data['client_id']
    )

    db.session.add(entry)
    db.session.commit()

    return jsonify({'message': 'Weight entry added', 'entry': entry.to_dict()}), 201

# Get all weight entries for a client
@weight_bp.route('/client/<int:client_id>', methods=['GET'])
@login_required
def get_client_weight_entries(client_id):
    # Check if client exists
    client = Client.query.get_or_404(client_id)

    # Check if the client belongs to the current user
    if client.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized access'}), 403

    # Get all entries ordered by date
    entries = WeightEntry.query.filter_by(client_id=client_id).order_by(WeightEntry.date).all()
    return jsonify([entry.to_dict() for entry in entries])

# Update a weight entry
@weight_bp.route('/<int:entry_id>', methods=['PUT'])
@login_required
def update_weight_entry(entry_id):
    entry = WeightEntry.query.get_or_404(entry_id)

    # Check if the entry belongs to a client owned by the current user
    client = Client.query.get(entry.client_id)
    if client.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized access'}), 403

    data = request.get_json()

    if 'weight' in data:
        entry.weight = data['weight']

    if 'date' in data:
        try:
            entry.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

    db.session.commit()
    return jsonify({'message': 'Weight entry updated', 'entry': entry.to_dict()})

# Delete a weight entry
@weight_bp.route('/<int:entry_id>', methods=['DELETE'])
@login_required
def delete_weight_entry(entry_id):
    entry = WeightEntry.query.get_or_404(entry_id)

    # Check if the entry belongs to a client owned by the current user
    client = Client.query.get(entry.client_id)
    if client.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized access'}), 403

    db.session.delete(entry)
    db.session.commit()
    return jsonify({'message': 'Weight entry deleted'})
