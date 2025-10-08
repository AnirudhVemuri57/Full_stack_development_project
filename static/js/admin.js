// Admin dashboard functionality

// Update appointment status (Approve/Reject)
function updateStatus(appointmentId, status) {
    // Confirm action
    var confirmMessage = status === 'Approved' 
        ? 'Are you sure you want to approve this appointment?' 
        : 'Are you sure you want to reject this appointment?';
    
    if (!confirm(confirmMessage)) {
        return;
    }

    // Show loading state
    var row = $('#row-' + appointmentId);
    var statusBadge = $('#status-' + appointmentId);
    var originalStatus = statusBadge.text();
    statusBadge.html('<span class="spinner-border spinner-border-sm"></span>');

    // Send AJAX request
    $.ajax({
        url: '/update_status/' + appointmentId,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ status: status }),
        success: function(response) {
            if (response.success) {
                // Update status badge
                statusBadge.removeClass('bg-warning bg-success bg-danger');
                if (status === 'Approved') {
                    statusBadge.addClass('bg-success');
                } else {
                    statusBadge.addClass('bg-danger');
                }
                statusBadge.text(status);

                // Remove action buttons
                row.find('.btn-success, .btn-danger').fadeOut(300, function() {
                    $(this).remove();
                });

                // Show success message
                showSuccessMessage(response.message);

                // Update statistics
                updateStatistics();

                // Highlight row briefly
                row.addClass('table-success');
                setTimeout(function() {
                    row.removeClass('table-success');
                }, 2000);
            } else {
                statusBadge.text(originalStatus);
                showErrorMessage(response.message);
            }
        },
        error: function(xhr, status, error) {
            statusBadge.text(originalStatus);
            showErrorMessage('Error updating appointment status. Please try again.');
            console.error('Error:', error);
        }
    });
}

// View appointment details in modal
function viewDetails(appointmentId) {
    // Show modal
    var modal = new bootstrap.Modal(document.getElementById('appointmentModal'));
    modal.show();

    // Show loading spinner
    $('#modalBody').html(`
        <div class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `);

    // Fetch appointment details
    $.ajax({
        url: '/appointment/' + appointmentId,
        type: 'GET',
        success: function(data) {
            var statusClass = '';
            if (data.status === 'Pending') statusClass = 'bg-warning';
            else if (data.status === 'Approved') statusClass = 'bg-success';
            else if (data.status === 'Rejected') statusClass = 'bg-danger';

            var detailsHtml = `
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <p class="mb-1"><strong><i class="fas fa-hashtag text-primary"></i> Appointment ID:</strong></p>
                        <p class="ms-4">#${data.id}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                        <p class="mb-1"><strong><i class="fas fa-info-circle text-primary"></i> Status:</strong></p>
                        <p class="ms-4"><span class="badge ${statusClass}">${data.status}</span></p>
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <p class="mb-1"><strong><i class="fas fa-user text-primary"></i> Patient Name:</strong></p>
                        <p class="ms-4">${data.name}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                        <p class="mb-1"><strong><i class="fas fa-envelope text-primary"></i> Email:</strong></p>
                        <p class="ms-4">${data.email}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <p class="mb-1"><strong><i class="fas fa-phone text-primary"></i> Phone:</strong></p>
                        <p class="ms-4">${data.phone}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                        <p class="mb-1"><strong><i class="fas fa-hospital text-primary"></i> Department:</strong></p>
                        <p class="ms-4">${data.department}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <p class="mb-1"><strong><i class="fas fa-user-doctor text-primary"></i> Doctor:</strong></p>
                        <p class="ms-4">${data.doctor}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                        <p class="mb-1"><strong><i class="fas fa-calendar text-primary"></i> Date:</strong></p>
                        <p class="ms-4">${data.date}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <p class="mb-1"><strong><i class="fas fa-clock text-primary"></i> Time:</strong></p>
                        <p class="ms-4">${data.time}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                        <p class="mb-1"><strong><i class="fas fa-calendar-plus text-primary"></i> Created At:</strong></p>
                        <p class="ms-4">${data.created_at}</p>
                    </div>
                </div>
                <hr>
                <div class="mb-3">
                    <p class="mb-1"><strong><i class="fas fa-notes-medical text-primary"></i> Symptoms:</strong></p>
                    <p class="ms-4">${data.symptoms}</p>
                </div>
            `;

            $('#modalBody').html(detailsHtml);
        },
        error: function(xhr, status, error) {
            $('#modalBody').html(`
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-circle"></i> Error loading appointment details. Please try again.
                </div>
            `);
            console.error('Error:', error);
        }
    });
}

// Update statistics cards
function updateStatistics() {
    var pendingCount = 0;
    var approvedCount = 0;
    var rejectedCount = 0;

    $('#appointmentsTable tbody tr').each(function() {
        var status = $(this).find('span.badge').text().trim();
        if (status === 'Pending') pendingCount++;
        else if (status === 'Approved') approvedCount++;
        else if (status === 'Rejected') rejectedCount++;
    });

    // Update cards with animation
    $('.bg-warning h3').fadeOut(200, function() {
        $(this).text(pendingCount).fadeIn(200);
    });
    $('.bg-success h3').fadeOut(200, function() {
        $(this).text(approvedCount).fadeIn(200);
    });
    $('.bg-danger h3').fadeOut(200, function() {
        $(this).text(rejectedCount).fadeIn(200);
    });
}

// Table search functionality
$(document).ready(function() {
    // Add search box above table
    if ($('#appointmentsTable').length) {
        var searchHtml = `
            <div class="mb-3">
                <input type="text" id="tableSearch" class="form-control" placeholder="Search appointments...">
            </div>
        `;
        $('#appointmentsTable').before(searchHtml);

        // Search functionality
        $('#tableSearch').on('keyup', function() {
            var value = $(this).val().toLowerCase();
            $('#appointmentsTable tbody tr').filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            });
        });
    }

    // Highlight new appointments (less than 1 hour old)
    var now = new Date();
    $('#appointmentsTable tbody tr').each(function() {
        var createdAt = $(this).data('created-at');
        if (createdAt) {
            var appointmentDate = new Date(createdAt);
            var diffHours = (now - appointmentDate) / (1000 * 60 * 60);
            if (diffHours < 1) {
                $(this).addClass('table-info');
            }
        }
    });
});

// Auto-refresh dashboard every 30 seconds
var autoRefresh = setInterval(function() {
    // Only refresh if user is on admin page
    if (window.location.pathname === '/admin') {
        location.reload();
    }
}, 30000);

// Stop auto-refresh when user leaves the page
$(window).on('beforeunload', function() {
    clearInterval(autoRefresh);
});
