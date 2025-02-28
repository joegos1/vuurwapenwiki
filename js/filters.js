document.addEventListener('DOMContentLoaded', function() {
    // Initialize collapsible filters
    const filterHeaders = document.querySelectorAll('.filter-header');
    
    filterHeaders.forEach(header => {
        // Attach click event to each filter header
        header.addEventListener('click', function() {
            // Toggle collapsed class on the header
            this.classList.toggle('collapsed');
            
            // Find the corresponding checkbox group
            const checkboxGroup = this.nextElementSibling;
            checkboxGroup.classList.toggle('collapsed');
        });
    });
    
    // Optional: Collapse all filters initially except the first one
    // Uncomment the following code if you want filters to start collapsed
    /*
    for (let i = 0; i < filterHeaders.length; i++) {
        if (i > 0) { // Skip the first filter
            filterHeaders[i].classList.add('collapsed');
            filterHeaders[i].nextElementSibling.classList.add('collapsed');
        }
    }
    */
});