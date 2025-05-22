from flask import Blueprint, request, jsonify
from src.models.models import db, ShepherdProfile, SolarSite, Waitlist
from src.routes.auth import token_required
from datetime import datetime

directory_bp = Blueprint('directory', __name__)

@directory_bp.route('/shepherds', methods=['GET'])
def get_shepherds():
    country = request.args.get('country', '')
    region = request.args.get('region', '')
    
    query = ShepherdProfile.query.filter_by(is_verified=True)
    
    if country:
        query = query.filter(ShepherdProfile.address.like(f'%{country}%'))
    if region:
        query = query.filter(ShepherdProfile.address.like(f'%{region}%'))
    
    shepherds = query.all()
    return jsonify([shepherd.to_dict() for shepherd in shepherds]), 200

@directory_bp.route('/solar-parks', methods=['GET'])
def get_solar_parks():
    country = request.args.get('country', '')
    region = request.args.get('region', '')
    
    query = SolarSite.query
    
    if country:
        query = query.filter(SolarSite.location.like(f'%{country}%'))
    if region:
        query = query.filter(SolarSite.location.like(f'%{region}%'))
    
    parks = query.all()
    return jsonify([park.to_dict() for park in parks]), 200

@directory_bp.route('/enquiry', methods=['POST'])
def submit_enquiry():
    data = request.get_json()
    
    # Store in waitlist table for now
    new_enquiry = Waitlist(
        email=data['email'],
        name=data.get('name', ''),
        role=data.get('role', ''),
        location=data.get('location', '')
    )
    
    db.session.add(new_enquiry)
    db.session.commit()
    
    # In a real implementation, you would also send an email notification
    
    return jsonify({'message': 'Enquiry submitted successfully!'}), 201

@directory_bp.route('/waitlist', methods=['POST'])
def join_waitlist():
    data = request.get_json()
    
    # Check if email already exists
    if Waitlist.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered!'}), 409
    
    new_entry = Waitlist(
        email=data['email'],
        name=data.get('name', ''),
        role=data.get('role', ''),
        location=data.get('location', '')
    )
    
    db.session.add(new_entry)
    db.session.commit()
    
    return jsonify({'message': 'Added to waitlist successfully!'}), 201

@directory_bp.route('/regions', methods=['GET'])
def get_regions():
    # This would be expanded with actual region data
    # For now, return some sample regions for demonstration
    regions = {
        'France': ['Bretagne', 'Normandie', 'Provence', 'Dordogne'],
        'Germany': ['Bavaria', 'Brandenburg', 'Saxony'],
        'Spain': ['Andalusia', 'Catalonia', 'Valencia'],
        'Italy': ['Tuscany', 'Sicily', 'Lombardy']
    }
    
    country = request.args.get('country', '')
    if country and country in regions:
        return jsonify(regions[country]), 200
    
    return jsonify(regions), 200
