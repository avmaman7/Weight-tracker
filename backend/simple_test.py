"""
A simple Flask application to test the database connection.
This can be deployed separately on Render.
"""
from flask import Flask, jsonify
from flask_cors import CORS
import os
import psycopg2
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/api/simple/clients', methods=['GET'])
def get_all_clients():
    """Get all clients without using SQLAlchemy."""
    try:
        # Get database URL from environment
        database_url = os.environ.get('DATABASE_URL')
        if database_url.startswith('postgres://'):
            database_url = database_url.replace('postgres://', 'postgresql://', 1)
            
        # Connect to the database
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        # Execute a simple query to get all clients
        cursor.execute("SELECT id, name, email, created_at FROM client")
        clients = cursor.fetchall()
        
        # Convert to JSON
        result = []
        for client in clients:
            result.append({
                'id': client[0],
                'name': client[1],
                'email': client[2],
                'created_at': client[3].isoformat() if client[3] else None
            })
            
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    app.run(debug=True, port=8001)
