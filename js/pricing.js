// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Vehicle Filtering
    const tabButtons = document.querySelectorAll('.pricing-tabs .tab-btn');
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter vehicles
            pricingCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Duration Filter
    const durationSelect = document.getElementById('duration');
    const pricingOptions = document.querySelectorAll('.pricing-option');
    
    if (durationSelect) {
        durationSelect.addEventListener('change', function() {
            const selectedDuration = this.value;
            
            // Update pricing options display
            document.querySelectorAll('.pricing-options').forEach(optionsContainer => {
                // Hide all options
                optionsContainer.querySelectorAll('.pricing-option').forEach(option => {
                    option.classList.remove('active');
                });
                
                // Show selected option
                const selectedOption = optionsContainer.querySelector(`.pricing-option[data-duration="${selectedDuration}"]`);
                if (selectedOption) {
                    selectedOption.classList.add('active');
                }
            });
        });
    }
    
    // Sort By Filter
    const sortBySelect = document.getElementById('sort-by');
    const pricingContainer = document.querySelector('.pricing-container');
    
    if (sortBySelect && pricingContainer) {
        sortBySelect.addEventListener('change', function() {
            const sortValue = this.value;
            const cards = Array.from(pricingContainer.querySelectorAll('.pricing-card'));
            
            // Sort cards based on selected option
            cards.sort((a, b) => {
                if (sortValue === 'price-low') {
                    const priceA = getPriceValue(a);
                    const priceB = getPriceValue(b);
                    return priceA - priceB;
                } else if (sortValue === 'price-high') {
                    const priceA = getPriceValue(a);
                    const priceB = getPriceValue(b);
                    return priceB - priceA;
                } else if (sortValue === 'popularity') {
                    const isPopularA = a.querySelector('.pricing-tag') !== null;
                    const isPopularB = b.querySelector('.pricing-tag') !== null;
                    return isPopularB - isPopularA;
                } else {
                    // Default to newest (no specific sorting)
                    return 0;
                }
            });
            
            // Reappend sorted cards
            cards.forEach(card => {
                pricingContainer.appendChild(card);
            });
        });
    }
    
    // Helper function to get price value from card
    function getPriceValue(card) {
        const activeOption = card.querySelector('.pricing-option.active');
        if (activeOption) {
            const priceText = activeOption.querySelector('.price').textContent;
            // Extract numeric value from price text (e.g., "₹1,200/day" -> 1200)
            return parseInt(priceText.replace(/[^0-9]/g, ''));
        }
        return 0;
    }
    
    // Booking Modal
    const modal = document.getElementById('booking-modal');
    const bookButtons = document.querySelectorAll('.book-btn');
    const closeModal = document.querySelector('.close-modal');
    const bookingForm = document.getElementById('booking-form');
    const selectedVehicleInfo = document.getElementById('selected-vehicle-info');
    
    // Vehicle data (in a real application, this would come from a database)
    const vehicleData = {
        'Royal Enfield Classic 350': {
            type: '2-wheeler',
            rates: {
                daily: 1200,
                weekly: 6500,
                monthly: 22000
            },
            deposit: {
                daily: 2000,
                weekly: 3000,
                monthly: 5000
            },
            image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        'Honda Activa 6G': {
            type: '2-wheeler',
            rates: {
                daily: 500,
                weekly: 2800,
                monthly: 9000
            },
            deposit: {
                daily: 1000,
                weekly: 1500,
                monthly: 2000
            },
            image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        'KTM Duke 390': {
            type: '2-wheeler',
            rates: {
                daily: 1800,
                weekly: 10000,
                monthly: 35000
            },
            deposit: {
                daily: 3000,
                weekly: 4000,
                monthly: 6000
            },
            image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        'Maruti Suzuki Swift': {
            type: '4-wheeler',
            rates: {
                daily: 1500,
                weekly: 9000,
                monthly: 30000
            },
            deposit: {
                daily: 5000,
                weekly: 7000,
                monthly: 10000
            },
            image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        'Hyundai Creta': {
            type: '4-wheeler',
            rates: {
                daily: 2500,
                weekly: 15000,
                monthly: 50000
            },
            deposit: {
                daily: 8000,
                weekly: 10000,
                monthly: 15000
            },
            image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        'Toyota Innova Crysta': {
            type: '4-wheeler',
            rates: {
                daily: 3500,
                weekly: 21000,
                monthly: 70000
            },
            deposit: {
                daily: 10000,
                weekly: 15000,
                monthly: 20000
            },
            image: 'https://images.unsplash.com/photo-1617624085810-3df2165bd11b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        }
    };
    
    // Open modal when book button is clicked
    bookButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get vehicle name
            const vehicleName = this.getAttribute('data-vehicle');
            const vehicle = vehicleData[vehicleName];
            
            if (vehicle) {
                // Set selected vehicle info
                selectedVehicleInfo.innerHTML = `
                    <h3>${vehicleName}</h3>
                    <div class="vehicle-details">
                        <div class="vehicle-detail">
                            <strong>Type:</strong> ${vehicle.type === '2-wheeler' ? 'Two Wheeler' : 'Four Wheeler'}
                        </div>
                        <div class="vehicle-detail">
                            <strong>Rate:</strong> ₹${vehicle.rates[durationSelect.value].toLocaleString()}/
                            ${durationSelect.value === 'daily' ? 'day' : durationSelect.value === 'weekly' ? 'week' : 'month'}
                        </div>
                        <div class="vehicle-detail">
                            <strong>Security Deposit:</strong> ₹${vehicle.deposit[durationSelect.value].toLocaleString()}
                        </div>
                    </div>
                `;
                
                // Show/hide options based on vehicle type
                if (vehicle.type === '2-wheeler') {
                    document.getElementById('helmet-option').style.display = 'block';
                    document.getElementById('child-seat-option').style.display = 'none';
                } else {
                    document.getElementById('helmet-option').style.display = 'none';
                    document.getElementById('child-seat-option').style.display = 'block';
                }
                
                // Set minimum date for pickup to today
                const today = new Date().toISOString().split('T')[0];
                document.getElementById('pickup-date').setAttribute('min', today);
                document.getElementById('return-date').setAttribute('min', today);
                
                // Update booking summary
                updateBookingSummary(vehicleName);
                
                // Show modal
                modal.style.display = 'block';
                
                // Disable body scroll
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal when X is clicked
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Update booking summary when dates change
    const pickupDateInput = document.getElementById('pickup-date');
    const returnDateInput = document.getElementById('return-date');
    const additionalOptions = document.querySelectorAll('input[type="checkbox"]');
    
    if (pickupDateInput && returnDateInput) {
        // Set return date min when pickup date changes
        pickupDateInput.addEventListener('change', function() {
            returnDateInput.setAttribute('min', this.value);
            
            // If return date is before new pickup date, reset it
            if (returnDateInput.value && returnDateInput.value < this.value) {
                returnDateInput.value = this.value;
            }
            
            updateBookingSummary();
        });
        
        returnDateInput.addEventListener('change', function() {
            updateBookingSummary();
        });
    }
    
    // Update booking summary when additional options change
    additionalOptions.forEach(option => {
        option.addEventListener('change', function() {
            updateBookingSummary();
        });
    });
    
    // Update booking summary
    function updateBookingSummary(vehicleName) {
        const selectedVehicle = vehicleName || selectedVehicleInfo.querySelector('h3').textContent;
        const vehicle = vehicleData[selectedVehicle];
        
        if (!vehicle) return;
        
        const duration = durationSelect.value;
        const baseRate = vehicle.rates[duration];
        const securityDeposit = vehicle.deposit[duration];
        
        // Calculate rental duration
        let rentalDays = 0;
        let baseRental = 0;
        
        if (pickupDateInput.value && returnDateInput.value) {
            const pickupDate = new Date(pickupDateInput.value);
            const returnDate = new Date(returnDateInput.value);
            
            // Calculate difference in days
            const timeDiff = returnDate.getTime() - pickupDate.getTime();
            rentalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            // Calculate base rental cost
            if (duration === 'daily') {
                baseRental = baseRate * rentalDays;
            } else if (duration === 'weekly') {
                const weeks = Math.ceil(rentalDays / 7);
                baseRental = baseRate * weeks;
            } else if (duration === 'monthly') {
                const months = Math.ceil(rentalDays / 30);
                baseRental = baseRate * months;
            }
        } else {
            // If dates not selected, show rate for selected duration
            baseRental = baseRate;
        }
        
        // Calculate additional options cost
        let additionalCost = 0;
        
        if (document.getElementById('insurance').checked) {
            additionalCost += 500;
        }
        
        if (document.getElementById('gps').checked) {
            additionalCost += 200 * (rentalDays || 1);
        }
        
        if (vehicle.type === '2-wheeler' && document.getElementById('extra-helmet').checked) {
            additionalCost += 100 * (rentalDays || 1);
        }
        
        if (vehicle.type === '4-wheeler' && document.getElementById('child-seat').checked) {
            additionalCost += 300 * (rentalDays || 1);
        }
        
        // Update summary display
        document.getElementById('base-rental').textContent = `₹${baseRental.toLocaleString()}`;
        document.getElementById('additional-cost').textContent = `₹${additionalCost.toLocaleString()}`;
        document.getElementById('security-deposit').textContent = `₹${securityDeposit.toLocaleString()}`;
        document.getElementById('total-amount').textContent = `₹${(baseRental + additionalCost + securityDeposit).toLocaleString()}`;
    }
    
    // Booking Form Submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const pickupDate = document.getElementById('pickup-date').value;
            const returnDate = document.getElementById('return-date').value;
            const pickupLocation = document.getElementById('pickup-location').value;
            const returnLocation = document.getElementById('return-location').value;
            const driverLicense = document.getElementById('driver-license').value;
            const termsAgreed = document.getElementById('booking-terms').checked;
            
            if (!pickupDate || !returnDate) {
                alert('Please select both pickup and return dates.');
                return;
            }
            
            if (!pickupLocation || !returnLocation) {
                alert('Please select both pickup and return locations.');
                return;
            }
            
            if (!driverLicense) {
                alert('Please enter your driver\'s license number.');
                return;
            }
            
            if (!termsAgreed) {
                alert('You must agree to the Terms and Conditions and Rental Policy.');
                return;
            }
            
            // If validation passes, you would typically submit the form to a server
            // For demo purposes, we'll just show a success message
            alert('Booking successful! You will receive a confirmation email shortly.');
            
            // Close modal and reset form
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            bookingForm.reset();
        });
    }
});