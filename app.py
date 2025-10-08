from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///appointments.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Initialize database
db = SQLAlchemy(app)

# Database Model for Appointments
class Appointment(db.Model):
    __tablename__ = 'appointments'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    department = db.Column(db.String(50), nullable=False)
    doctor = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(20), nullable=False)
    symptoms = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='Pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Appointment {self.name} - {self.date}>'

# Create database tables and add dummy data
with app.app_context():
    db.create_all()
    
    # Add dummy appointments if database is empty
    if Appointment.query.count() == 0:
        dummy_appointments = [
            Appointment(
                name='John Doe',
                email='john.doe@example.com',
                phone='9876543210',
                department='Cardiology',
                doctor='Dr. Sarah Johnson',
                date='2025-10-15',
                time='10:00',
                symptoms='Chest pain and irregular heartbeat',
                status='Pending'
            ),
            Appointment(
                name='Jane Smith',
                email='jane.smith@example.com',
                phone='9876543211',
                department='Orthopedics',
                doctor='Dr. Michael Brown',
                date='2025-10-16',
                time='14:30',
                symptoms='Knee pain after running',
                status='Approved'
            ),
            Appointment(
                name='Robert Wilson',
                email='robert.wilson@example.com',
                phone='9876543212',
                department='Dermatology',
                doctor='Dr. Emily Davis',
                date='2025-10-17',
                time='11:00',
                symptoms='Skin rash and itching',
                status='Pending'
            )
        ]
        db.session.bulk_save_objects(dummy_appointments)
        db.session.commit()
        print("✅ Dummy appointments added to database!")

# Route: Home Page
@app.route('/')
def home():
    """
    Renders the home page with clinic information and Book Appointment button
    """
    return render_template('home.html')

# Route: Appointment Booking Form
@app.route('/book')
def book():
    """
    Renders the appointment booking form page
    """
    return render_template('book.html')

# Route: Submit Appointment Form
@app.route('/submit_appointment', methods=['POST'])
def submit_appointment():
    """
    Handles form submission and saves appointment data to database
    """
    try:
        # Get form data
        name = request.form.get('name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        department = request.form.get('department')
        doctor = request.form.get('doctor')
        date = request.form.get('date')
        time = request.form.get('time')
        symptoms = request.form.get('symptoms')
        
        # Create new appointment
        new_appointment = Appointment(
            name=name,
            email=email,
            phone=phone,
            department=department,
            doctor=doctor,
            date=date,
            time=time,
            symptoms=symptoms,
            status='Pending'
        )
        
        # Save to database
        db.session.add(new_appointment)
        db.session.commit()
        
        # Redirect to success page with appointment ID
        return redirect(url_for('success', appointment_id=new_appointment.id))
    
    except Exception as e:
        print(f"Error: {e}")
        return "An error occurred while booking the appointment", 500

# Route: Success/Confirmation Page
@app.route('/success/<int:appointment_id>')
def success(appointment_id):
    """
    Displays appointment confirmation with details
    """
    appointment = Appointment.query.get_or_404(appointment_id)
    return render_template('success.html', appointment=appointment)

# Route: Doctor/Admin Dashboard
@app.route('/admin')
def admin():
    """
    Displays all appointments in a table with Approve/Reject buttons
    """
    appointments = Appointment.query.order_by(Appointment.created_at.desc()).all()
    return render_template('admin.html', appointments=appointments)

# Route: Update Appointment Status (AJAX)
@app.route('/update_status/<int:appointment_id>', methods=['POST'])
def update_status(appointment_id):
    """
    Updates appointment status (Approve/Reject) via AJAX
    """
    try:
        appointment = Appointment.query.get_or_404(appointment_id)
        new_status = request.json.get('status')
        
        if new_status in ['Approved', 'Rejected']:
            appointment.status = new_status
            db.session.commit()
            return jsonify({'success': True, 'message': f'Appointment {new_status}!'})
        else:
            return jsonify({'success': False, 'message': 'Invalid status'}), 400
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# Route: Get Appointment Details (for modal)
@app.route('/appointment/<int:appointment_id>')
def get_appointment(appointment_id):
    """
    Returns appointment details as JSON for modal display
    """
    appointment = Appointment.query.get_or_404(appointment_id)
    return jsonify({
        'id': appointment.id,
        'name': appointment.name,
        'email': appointment.email,
        'phone': appointment.phone,
        'department': appointment.department,
        'doctor': appointment.doctor,
        'date': appointment.date,
        'time': appointment.time,
        'symptoms': appointment.symptoms,
        'status': appointment.status,
        'created_at': appointment.created_at.strftime('%Y-%m-%d %H:%M:%S')
    })

# Run the application
if __name__ == '__main__':
    app.run(debug=True, port=5000)
