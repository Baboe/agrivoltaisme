from flask import Blueprint, request, jsonify
from src.models.models import db, GrazingListing, SolarSite, ShepherdProfile, ShepherdMatch
from src.routes.auth import token_required
from datetime import datetime

marketplace_bp = Blueprint('marketplace', __name__)

@marketplace_bp.route('/listings', methods=['GET'])
def get_listings():
    status = request.args.get('status', 'open')
    listings = GrazingListing.query.filter_by(status=status).all()
    return jsonify([listing.to_dict() for listing in listings]), 200

@marketplace_bp.route('/listings/<int:listing_id>', methods=['GET'])
def get_listing(listing_id):
    listing = GrazingListing.query.get_or_404(listing_id)
    return jsonify(listing.to_dict()), 200

@marketplace_bp.route('/listings', methods=['POST'])
@token_required
def create_listing(current_user):
    if current_user.role != 'solar_farm':
        return jsonify({'message': 'Unauthorized!'}), 403
    
    data = request.get_json()
    
    # Verify site belongs to user
    site = SolarSite.query.get_or_404(data['site_id'])
    if site.profile.user_id != current_user.id:
        return jsonify({'message': 'Unauthorized!'}), 403
    
    # Create new listing
    new_listing = GrazingListing(
        site_id=data['site_id'],
        hectares_available=data['hectares_available'],
        start_date=datetime.fromisoformat(data['start_date']),
        end_date=datetime.fromisoformat(data['end_date']),
        price_per_hectare=data['price_per_hectare'],
        status='open'
    )
    
    db.session.add(new_listing)
    db.session.commit()
    
    # Generate matches for this listing
    generate_matches(new_listing.id)
    
    return jsonify(new_listing.to_dict()), 201

@marketplace_bp.route('/listings/<int:listing_id>', methods=['PUT'])
@token_required
def update_listing(current_user, listing_id):
    listing = GrazingListing.query.get_or_404(listing_id)
    
    # Verify ownership
    if listing.site.profile.user_id != current_user.id:
        return jsonify({'message': 'Unauthorized!'}), 403
    
    data = request.get_json()
    
    # Update fields
    if 'hectares_available' in data:
        listing.hectares_available = data['hectares_available']
    if 'start_date' in data:
        listing.start_date = datetime.fromisoformat(data['start_date'])
    if 'end_date' in data:
        listing.end_date = datetime.fromisoformat(data['end_date'])
    if 'price_per_hectare' in data:
        listing.price_per_hectare = data['price_per_hectare']
    if 'status' in data:
        listing.status = data['status']
    
    db.session.commit()
    
    # If significant changes, regenerate matches
    if any(field in data for field in ['hectares_available', 'start_date', 'end_date']):
        regenerate_matches(listing_id)
    
    return jsonify(listing.to_dict()), 200

@marketplace_bp.route('/sites', methods=['GET'])
@token_required
def get_sites(current_user):
    if current_user.role != 'solar_farm':
        return jsonify({'message': 'Unauthorized!'}), 403
    
    sites = SolarSite.query.filter_by(profile_id=current_user.solar_farm_profile.id).all()
    return jsonify([site.to_dict() for site in sites]), 200

@marketplace_bp.route('/sites', methods=['POST'])
@token_required
def create_site(current_user):
    if current_user.role != 'solar_farm':
        return jsonify({'message': 'Unauthorized!'}), 403
    
    data = request.get_json()
    
    new_site = SolarSite(
        profile_id=current_user.solar_farm_profile.id,
        name=data['name'],
        location=data['location'],
        total_hectares=data['total_hectares'],
        vegetation_type=data.get('vegetation_type', '')
    )
    
    db.session.add(new_site)
    db.session.commit()
    
    return jsonify(new_site.to_dict()), 201

@marketplace_bp.route('/matches', methods=['GET'])
@token_required
def get_matches(current_user):
    if current_user.role == 'solar_farm':
        # Get matches for all listings owned by this farm
        matches = []
        for site in current_user.solar_farm_profile.sites:
            for listing in site.listings:
                matches.extend(listing.matches)
        
        return jsonify([match.to_dict() for match in matches]), 200
    
    elif current_user.role == 'shepherd':
        # Get matches for this shepherd
        matches = ShepherdMatch.query.filter_by(shepherd_id=current_user.shepherd_profile.id).all()
        return jsonify([match.to_dict() for match in matches]), 200
    
    return jsonify({'message': 'Unauthorized!'}), 403

@marketplace_bp.route('/matches/<int:match_id>', methods=['PUT'])
@token_required
def update_match(current_user, match_id):
    match = ShepherdMatch.query.get_or_404(match_id)
    
    # Verify permissions
    if current_user.role == 'shepherd' and match.shepherd_id != current_user.shepherd_profile.id:
        return jsonify({'message': 'Unauthorized!'}), 403
    elif current_user.role == 'solar_farm' and match.listing.site.profile.user_id != current_user.id:
        return jsonify({'message': 'Unauthorized!'}), 403
    
    data = request.get_json()
    
    if 'status' in data:
        match.status = data['status']
    
    db.session.commit()
    
    return jsonify(match.to_dict()), 200

# Helper functions for matching algorithm
def generate_matches(listing_id):
    """Generate shepherd matches for a new listing"""
    listing = GrazingListing.query.get(listing_id)
    if not listing:
        return
    
    # Find all verified shepherds
    shepherds = ShepherdProfile.query.filter_by(is_verified=True).all()
    
    for shepherd in shepherds:
        # Simple matching algorithm - can be enhanced later
        # Calculate a match score based on various factors
        match_score = calculate_match_score(listing, shepherd)
        
        # Only create matches with a reasonable score
        if match_score > 0.5:
            new_match = ShepherdMatch(
                listing_id=listing.id,
                shepherd_id=shepherd.id,
                match_score=match_score,
                status='pending'
            )
            db.session.add(new_match)
    
    db.session.commit()

def regenerate_matches(listing_id):
    """Regenerate matches for an updated listing"""
    # Delete existing pending matches
    ShepherdMatch.query.filter_by(listing_id=listing_id, status='pending').delete()
    db.session.commit()
    
    # Generate new matches
    generate_matches(listing_id)

def calculate_match_score(listing, shepherd):
    """Calculate a match score between a listing and a shepherd"""
    # This is a placeholder for a more sophisticated algorithm
    # In a real implementation, this would consider:
    # - Geographic proximity
    # - Flock size vs. hectares needed
    # - Previous performance
    # - Availability during the listing dates
    # - etc.
    
    # For now, return a random score between 0.5 and 1.0
    import random
    return 0.5 + random.random() * 0.5
