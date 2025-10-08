// Main JavaScript file for common functionality

$(document).ready(function() {
    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if(target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 70
            }, 1000);
        }
    });

    // Add active class to current nav item
    var currentPath = window.location.pathname;
    $('.navbar-nav .nav-link').each(function() {
        var linkPath = $(this).attr('href');
        if (currentPath === linkPath || (currentPath === '/' && linkPath === '/')) {
            $(this).addClass('active');
        }
    });

    // Fade in animations on scroll
    $(window).scroll(function() {
        $('.card').each(function() {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('fade-in');
            }
        });
    });

    // Show loading spinner on form submission
    $('form').on('submit', function() {
        var submitBtn = $(this).find('button[type="submit"]');
        var originalText = submitBtn.html();
        submitBtn.html('<span class="spinner-border spinner-border-sm me-2"></span>Processing...').prop('disabled', true);
    });

    // Tooltip initialization (if Bootstrap tooltips are used)
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Auto-hide alerts after 5 seconds
    setTimeout(function() {
        $('.alert').fadeOut('slow');
    }, 5000);
});

// Show success message with animation
function showSuccessMessage(message) {
    var alertHtml = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="fas fa-check-circle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $('main').prepend(alertHtml);
    
    setTimeout(function() {
        $('.alert').fadeOut('slow');
    }, 5000);
}

// Show error message with animation
function showErrorMessage(message) {
    var alertHtml = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="fas fa-exclamation-circle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $('main').prepend(alertHtml);
    
    setTimeout(function() {
        $('.alert').fadeOut('slow');
    }, 5000);
}

// Format date to readable format
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Format time to 12-hour format
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}
