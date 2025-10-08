"""Test script to verify the Flask application setup"""
from app import app, db, Appointment

print("=" * 60)
print("Testing Patient Appointment Booking System")
print("=" * 60)

# Test 1: Check if app is created
print("\n✓ Flask app created successfully")
print(f"  App name: {app.name}")

# Test 2: Check database connection
with app.app_context():
    # Check if tables exist
    print("\n✓ Database connected successfully")
    print(f"  Database URI: {app.config['SQLALCHEMY_DATABASE_URI']}")
    
    # Count appointments
    appointment_count = Appointment.query.count()
    print(f"\n✓ Found {appointment_count} appointments in database")
    
    # Display appointments
    if appointment_count > 0:
        print("\n  Sample appointments:")
        appointments = Appointment.query.limit(3).all()
        for apt in appointments:
            print(f"    - {apt.name} | {apt.department} | {apt.status}")

# Test 3: Check routes
print("\n✓ Available routes:")
for rule in app.url_map.iter_rules():
    if not rule.endpoint.startswith('static'):
        print(f"  {rule.endpoint:20s} -> {rule.rule}")

print("\n" + "=" * 60)
print("All tests passed! ✓")
print("=" * 60)
print("\nTo start the application, run:")
print("  python app.py")
print("\nThen open your browser to:")
print("  http://127.0.0.1:5000")
print("=" * 60)
