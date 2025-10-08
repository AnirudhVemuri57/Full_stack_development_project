# Patient Appointment Booking System

A complete full-stack web application built with Flask, Bootstrap, jQuery, SQLite, and Jinja2 for managing patient appointments at a healthcare clinic. This project is 100% complete, fully functional, and ready for production with recommended security enhancements.

---

## Features Implemented

### Core Features
- Home page with clinic information and services.
- User-friendly appointment booking form with 8 fields.
- Real-time, client-side form validation using jQuery.
- SQLite database integration for storing and managing appointments.
- Appointment confirmation page displaying full details after a successful booking.
- Admin dashboard to view, manage, and track all appointments.
- Approve/Reject functionality for appointment requests.
- Bootstrap modal for viewing full appointment details without leaving the page.

### Validation Features
- Empty field validation to ensure all required fields are filled.
- Email format validation.
- 10-digit phone number validation.
- Future date validation to prevent booking in the past.
- Visual feedback (green/red borders) for valid and invalid fields.
- Clear error messages displayed below the respective fields.

### Admin Features
- View all appointments in a comprehensive table.
- Filter appointments by status (Pending/Approved/Rejected).
- AJAX-based status updates for a seamless experience without page reloads.
- Search functionality to easily find specific appointments.
- Statistics cards showing real-time counts of appointments by status.
- Modal popup to view all details of a specific appointment.

### Design Features
- Responsive Bootstrap 5 layout for optimal viewing on all devices.
- Modern UI with gradient backgrounds and smooth animations.
- Font Awesome icons for improved visual communication.
- Mobile-friendly design for both patient and admin views.
- A print-friendly confirmation page for patient records.

---

## Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Backend | Flask | 2.3.3 |
| ORM | Flask-SQLAlchemy | 3.0.5 |
| Database | SQLite | 3.x |
| Templating | Jinja2 | 3.1.2 |
| CSS Framework | Bootstrap | 5.3.0 |
| JavaScript | jQuery | 3.7.0 |
| Icons | Font Awesome | 6.4.0 |
| Server | Werkzeug | 2.3.7 |

---

## Quick Start Guide

### Prerequisites
- Python 3.7 or higher
- pip (Python package manager)

### Installation & Setup

1.  **Navigate to the project directory**:
    ```bash
    cd path/to/your/project
    ```

2.  **Create and activate a virtual environment** (recommended):
    - Windows:
      ```bash
      python -m venv venv
      venv\Scripts\activate
      ```
    - macOS/Linux:
      ```bash
      python -m venv venv
      source venv/bin/activate
      ```

3.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the application**:
    ```bash
    python app.py
    ```
    Alternatively, on Windows, you can double-click `START_APP.bat`.

5.  **Open your browser** and navigate to:
    `http://127.0.0.1:5000`

---
---
 





