from flask import Flask, send_from_directory, render_template, request, jsonify, redirect, url_for
import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.models.models import db, User, ShepherdProfile, SolarSite, Waitlist
from src.routes.auth import auth_bp
from src.routes.directory import directory_bp
from src.routes.landing import landing_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(directory_bp, url_prefix='/api/directory')
app.register_blueprint(landing_bp)

# Enable database
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('DB_USERNAME', 'root')}:{os.getenv('DB_PASSWORD', 'password')}@{os.getenv('DB_HOST', 'localhost')}:{os.getenv('DB_PORT', '3306')}/{os.getenv('DB_NAME', 'mydb')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Create database tables
with app.app_context():
    db.create_all()
    
    # Add some initial data if the tables are empty
    if User.query.count() == 0:
        # Create admin user
        admin = User(email='admin@ombaa.eu', role='admin')
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()

# Routes for static HTML pages
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/directory')
def directory():
    return send_from_directory(app.static_folder, 'directory.html')

@app.route('/regions/<country>')
def country_page(country):
    # Check if country page exists
    country_file = f'regions/{country}.html'
    if os.path.exists(os.path.join(app.static_folder, country_file)):
        return send_from_directory(app.static_folder, country_file)
    return render_template('region.html', country=country)

@app.route('/regions/<country>/<region>')
def region_page(country, region):
    # Check if region page exists
    region_file = f'regions/{country}/{region}.html'
    if os.path.exists(os.path.join(app.static_folder, region_file)):
        return send_from_directory(app.static_folder, region_file)
    return render_template('region.html', country=country, region=region)

# Language-specific routes
@app.route('/fr')
def index_fr():
    return send_from_directory(app.static_folder, 'fr/index.html')

@app.route('/fr/directory')
def directory_fr():
    return send_from_directory(app.static_folder, 'fr/directory.html')

@app.route('/fr/regions/<country>')
def country_page_fr(country):
    # Check if French country page exists
    country_file = f'fr/regions/{country}.html'
    if os.path.exists(os.path.join(app.static_folder, country_file)):
        return send_from_directory(app.static_folder, country_file)
    return render_template('fr/region.html', country=country)

@app.route('/fr/regions/<country>/<region>')
def region_page_fr(country, region):
    # Check if French region page exists
    region_file = f'fr/regions/{country}/{region}.html'
    if os.path.exists(os.path.join(app.static_folder, region_file)):
        return send_from_directory(app.static_folder, region_file)
    return render_template('fr/region.html', country=country, region=region)

# Fallback route for all other paths
@app.route('/<path:path>')
def serve(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    elif os.path.exists(os.path.join(app.static_folder, f'{path}.html')):
        return send_from_directory(app.static_folder, f'{path}.html')
    elif path.endswith('/'):
        index_path = os.path.join(path, 'index.html')
        if os.path.exists(os.path.join(app.static_folder, index_path)):
            return send_from_directory(app.static_folder, index_path)
    
    # If no specific page exists, return index.html for SPA routing
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
