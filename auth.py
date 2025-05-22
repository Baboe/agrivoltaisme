from flask import Blueprint, request, jsonify, current_app
import jwt
from datetime import datetime, timedelta
from functools import wraps
from src.models.models import db, User, SolarFarmProfile, ShepherdProfile

auth_bp = Blueprint('auth', __name__)

# Authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['user_id']).first()
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
            
        return f(current_user, *args, **kwargs)
    
    return decorated

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists!'}), 409
    
    # Create new user
    new_user = User(
        email=data['email'],
        role=data['role']
    )
    new_user.set_password(data['password'])
    
    db.session.add(new_user)
    db.session.commit()
    
    # Create profile based on role
    if data['role'] == 'solar_farm':
        profile = SolarFarmProfile(
            user_id=new_user.id,
            company_name=data.get('company_name', ''),
            contact_person=data.get('contact_person', ''),
            phone=data.get('phone', ''),
            address=data.get('address', '')
        )
        db.session.add(profile)
        
    elif data['role'] == 'shepherd':
        profile = ShepherdProfile(
            user_id=new_user.id,
            name=data.get('name', ''),
            phone=data.get('phone', ''),
            address=data.get('address', ''),
            experience_years=data.get('experience_years', 0)
        )
        db.session.add(profile)
    
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully!'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid credentials!'}), 401
    
    # Generate JWT token
    token = jwt.encode({
        'user_id': user.id,
        'role': user.role,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, current_app.config['SECRET_KEY'], algorithm="HS256")
    
    return jsonify({
        'token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    if current_user.role == 'solar_farm' and current_user.solar_farm_profile:
        return jsonify(current_user.solar_farm_profile.to_dict()), 200
    elif current_user.role == 'shepherd' and current_user.shepherd_profile:
        return jsonify(current_user.shepherd_profile.to_dict()), 200
    else:
        return jsonify({'message': 'Profile not found!'}), 404

@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json()
    
    if current_user.role == 'solar_farm' and current_user.solar_farm_profile:
        profile = current_user.solar_farm_profile
        profile.company_name = data.get('company_name', profile.company_name)
        profile.contact_person = data.get('contact_person', profile.contact_person)
        profile.phone = data.get('phone', profile.phone)
        profile.address = data.get('address', profile.address)
        
    elif current_user.role == 'shepherd' and current_user.shepherd_profile:
        profile = current_user.shepherd_profile
        profile.name = data.get('name', profile.name)
        profile.phone = data.get('phone', profile.phone)
        profile.address = data.get('address', profile.address)
        profile.experience_years = data.get('experience_years', profile.experience_years)
    else:
        return jsonify({'message': 'Profile not found!'}), 404
    
    db.session.commit()
    return jsonify({'message': 'Profile updated successfully!'}), 200
