// Form validation for appointment booking

$(document).ready(function() {
    // Set minimum date to today
    var today = new Date().toISOString().split('T')[0];
    $('#date').attr('min', today);

    // Phone number validation (10 digits only)
    $('#phone').on('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
    });

    // Email validation
    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Phone validation
    function isValidPhone(phone) {
        return phone.length === 10 && /^\d{10}$/.test(phone);
    }

    // Date validation (must be future date)
    function isValidDate(dateString) {
        var selectedDate = new Date(dateString);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
    }

    // Real-time validation feedback
    $('#email').on('blur', function() {
        var email = $(this).val();
        if (email && !isValidEmail(email)) {
            $(this).addClass('is-invalid');
            $(this).removeClass('is-valid');
        } else if (email) {
            $(this).addClass('is-valid');
            $(this).removeClass('is-invalid');
        }
    });

    $('#phone').on('blur', function() {
        var phone = $(this).val();
        if (phone && !isValidPhone(phone)) {
            $(this).addClass('is-invalid');
            $(this).removeClass('is-valid');
            $(this).siblings('.invalid-feedback').text('Please enter a valid 10-digit phone number.');
        } else if (phone) {
            $(this).addClass('is-valid');
            $(this).removeClass('is-invalid');
        }
    });

    $('#date').on('change', function() {
        var date = $(this).val();
        if (date && !isValidDate(date)) {
            $(this).addClass('is-invalid');
            $(this).removeClass('is-valid');
            $(this).siblings('.invalid-feedback').text('Please select a future date.');
        } else if (date) {
            $(this).addClass('is-valid');
            $(this).removeClass('is-invalid');
        }
    });

    // Form submission validation
    $('#appointmentForm').on('submit', function(e) {
        e.preventDefault();
        
        var isValid = true;
        var form = this;

        // Remove previous validation classes
        $(form).find('.form-control, .form-select').removeClass('is-invalid is-valid');

        // Validate all required fields
        $(form).find('[required]').each(function() {
            if (!$(this).val()) {
                $(this).addClass('is-invalid');
                isValid = false;
            } else {
                $(this).addClass('is-valid');
            }
        });

        // Validate email
        var email = $('#email').val();
        if (!isValidEmail(email)) {
            $('#email').addClass('is-invalid');
            $('#email').siblings('.invalid-feedback').text('Please enter a valid email address.');
            isValid = false;
        }

        // Validate phone
        var phone = $('#phone').val();
        if (!isValidPhone(phone)) {
            $('#phone').addClass('is-invalid');
            $('#phone').siblings('.invalid-feedback').text('Please enter a valid 10-digit phone number.');
            isValid = false;
        }

        // Validate date
        var date = $('#date').val();
        if (!isValidDate(date)) {
            $('#date').addClass('is-invalid');
            $('#date').siblings('.invalid-feedback').text('Please select a future date.');
            isValid = false;
        }

        // If all validations pass, submit the form
        if (isValid) {
            // Show loading state
            var submitBtn = $(form).find('button[type="submit"]');
            submitBtn.html('<span class="spinner-border spinner-border-sm me-2"></span>Submitting...').prop('disabled', true);
            
            // Submit form
            form.submit();
        } else {
            // Scroll to first error
            $('html, body').animate({
                scrollTop: $('.is-invalid').first().offset().top - 100
            }, 500);
            
            // Show error message
            showErrorMessage('Please fill all required fields correctly.');
        }
    });

    // Clear validation on input
    $('.form-control, .form-select').on('input change', function() {
        if ($(this).val()) {
            $(this).removeClass('is-invalid');
        }
    });

    // Confirmation before leaving page if form is filled
    var formModified = false;
    $('#appointmentForm input, #appointmentForm select, #appointmentForm textarea').on('change', function() {
        formModified = true;
    });

    $(window).on('beforeunload', function() {
        if (formModified) {
            return 'You have unsaved changes. Are you sure you want to leave?';
        }
    });

    // Don't show warning after form submission
    $('#appointmentForm').on('submit', function() {
        formModified = false;
    });
});
