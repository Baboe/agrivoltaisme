from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

# User roles
ROLE_SOLAR_FARM = 'solar_farm'
ROLE_SHEPHERD = 'shepherd'
ROLE_ADMIN = 'admin'

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with profiles
    solar_farm_profile = db.relationship('SolarFarmProfile', backref='user', uselist=False)
    shepherd_profile = db.relationship('ShepherdProfile', backref='user', uselist=False)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat()
        }

class SolarFarmProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    company_name = db.Column(db.String(100), nullable=False)
    contact_person = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    sites = db.relationship('SolarSite', backref='profile', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'company_name': self.company_name,
            'contact_person': self.contact_person,
            'phone': self.phone,
            'address': self.address,
            'created_at': self.created_at.isoformat()
        }

class ShepherdProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    experience_years = db.Column(db.Integer, nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    flocks = db.relationship('Flock', backref='shepherd', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'phone': self.phone,
            'address': self.address,
            'experience_years': self.experience_years,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat()
        }

class Flock(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    shepherd_id = db.Column(db.Integer, db.ForeignKey('shepherd_profile.id'), nullable=False)
    size = db.Column(db.Integer, nullable=False)
    breed = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'shepherd_id': self.shepherd_id,
            'size': self.size,
            'breed': self.breed,
            'description': self.description,
            'created_at': self.created_at.isoformat()
        }

class SolarSite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    profile_id = db.Column(db.Integer, db.ForeignKey('solar_farm_profile.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    total_hectares = db.Column(db.Float, nullable=False)
    vegetation_type = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    listings = db.relationship('GrazingListing', backref='site', lazy=True)
    analytics = db.relationship('SiteAnalytics', backref='site', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'profile_id': self.profile_id,
            'name': self.name,
            'location': self.location,
            'total_hectares': self.total_hectares,
            'vegetation_type': self.vegetation_type,
            'created_at': self.created_at.isoformat()
        }

class GrazingListing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    site_id = db.Column(db.Integer, db.ForeignKey('solar_site.id'), nullable=False)
    hectares_available = db.Column(db.Float, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    price_per_hectare = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='open')  # open, matched, contracted, completed, cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    matches = db.relationship('ShepherdMatch', backref='listing', lazy=True)
    contract = db.relationship('GrazingContract', backref='listing', uselist=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'site_id': self.site_id,
            'hectares_available': self.hectares_available,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
            'price_per_hectare': self.price_per_hectare,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }

class ShepherdMatch(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    listing_id = db.Column(db.Integer, db.ForeignKey('grazing_listing.id'), nullable=False)
    shepherd_id = db.Column(db.Integer, db.ForeignKey('shepherd_profile.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, accepted, rejected
    match_score = db.Column(db.Float)  # Algorithm score for the match
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    shepherd = db.relationship('ShepherdProfile', backref='matches')
    
    def to_dict(self):
        return {
            'id': self.id,
            'listing_id': self.listing_id,
            'shepherd_id': self.shepherd_id,
            'status': self.status,
            'match_score': self.match_score,
            'created_at': self.created_at.isoformat()
        }

class GrazingContract(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    listing_id = db.Column(db.Integer, db.ForeignKey('grazing_listing.id'), nullable=False)
    shepherd_id = db.Column(db.Integer, db.ForeignKey('shepherd_profile.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    platform_fee = db.Column(db.Float, nullable=False)
    shepherd_payout = db.Column(db.Float, nullable=False)
    pdf_path = db.Column(db.String(255))
    solar_farm_signed = db.Column(db.Boolean, default=False)
    shepherd_signed = db.Column(db.Boolean, default=False)
    payment_status = db.Column(db.String(20), default='pending')  # pending, paid, refunded
    stripe_payment_id = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    shepherd = db.relationship('ShepherdProfile', backref='contracts')
    
    def to_dict(self):
        return {
            'id': self.id,
            'listing_id': self.listing_id,
            'shepherd_id': self.shepherd_id,
            'total_amount': self.total_amount,
            'platform_fee': self.platform_fee,
            'shepherd_payout': self.shepherd_payout,
            'solar_farm_signed': self.solar_farm_signed,
            'shepherd_signed': self.shepherd_signed,
            'payment_status': self.payment_status,
            'created_at': self.created_at.isoformat()
        }

class SiteAnalytics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    site_id = db.Column(db.Integer, db.ForeignKey('solar_site.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    ndvi_score = db.Column(db.Float)  # Normalized Difference Vegetation Index
    status = db.Column(db.String(20))  # green, yellow, red (traffic light system)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'site_id': self.site_id,
            'date': self.date.isoformat(),
            'ndvi_score': self.ndvi_score,
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat()
        }

class Waitlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100))
    role = db.Column(db.String(20))  # solar_farm, shepherd
    location = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'role': self.role,
            'location': self.location,
            'created_at': self.created_at.isoformat()
        }
