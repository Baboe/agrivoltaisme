from flask import Blueprint, render_template, request, jsonify
from src.models.models import db, Waitlist

landing_bp = Blueprint('landing', __name__)

@landing_bp.route('/')
def index():
    return render_template('index.html')

@landing_bp.route('/about')
def about():
    return render_template('about.html')

@landing_bp.route('/how-it-works')
def how_it_works():
    return render_template('how-it-works.html')

@landing_bp.route('/contact')
def contact():
    return render_template('contact.html')

@landing_bp.route('/waitlist', methods=['POST'])
def join_waitlist():
    if request.content_type == 'application/json':
        data = request.get_json()
    else:
        data = request.form
    
    # Check if email already exists
    if Waitlist.query.filter_by(email=data['email']).first():
        if request.content_type == 'application/json':
            return jsonify({'success': False, 'message': 'Email already registered!'}), 409
        return render_template('index.html', error='Email already registered!')
    
    new_entry = Waitlist(
        email=data['email'],
        name=data.get('name', ''),
        role=data.get('role', ''),
        location=data.get('location', '')
    )
    
    db.session.add(new_entry)
    db.session.commit()
    
    if request.content_type == 'application/json':
        return jsonify({'success': True, 'message': 'Added to waitlist successfully!'}), 201
    return render_template('thank-you.html')

# SEO-optimized regional pages
@landing_bp.route('/regions/<country>')
def country_page(country):
    return render_template('region.html', country=country, region=None)

@landing_bp.route('/regions/<country>/<region>')
def region_page(country, region):
    return render_template('region.html', country=country, region=region)
