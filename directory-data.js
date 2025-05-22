// This JavaScript file integrates the processed solar park data into the Ombaa directory
// It loads the JSON data and dynamically creates directory listings

document.addEventListener('DOMContentLoaded', function() {
  // Function to load the solar parks data
  async function loadSolarParksData() {
    try {
      const response = await fetch('/data/processed_solar_parks.json');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error loading solar parks data:', error);
      return [];
    }
  }

  // Function to create a solar park listing element
  function createSolarParkElement(park) {
    const listingCard = document.createElement('div');
    listingCard.className = 'listing-card bg-gray-50 rounded-lg overflow-hidden shadow-md';
    
    // Format hectares with 1 decimal place if it's a number
    const hectaresDisplay = typeof park.total_hectares === 'number' 
      ? park.total_hectares.toFixed(1) 
      : park.total_hectares;
    
    // Create the inner HTML for the listing
    listingCard.innerHTML = `
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-bold">${park.name}</h3>
        </div>
        <p class="text-gray-600 mb-4">${park.location}</p>
        <div class="mb-4">
          <p class="font-medium">Size: ${hectaresDisplay} hectares</p>
          <p class="font-medium">Vegetation Type: ${park.vegetation_type}</p>
          ${park.region ? `<p class="font-medium">Region: ${park.region}</p>` : ''}
        </div>
        <p class="text-gray-700 mb-4">Solar park in the Netherlands seeking shepherds for eco-friendly vegetation management.</p>
        <button class="contact-button w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300" 
          data-id="${park.name.replace(/\s+/g, '-').toLowerCase()}" 
          data-type="solar-farm">Contact</button>
      </div>
    `;
    
    return listingCard;
  }

  // Function to populate the solar farms list
  async function populateSolarFarmsList() {
    const solarFarmsList = document.getElementById('solar-farms-list');
    if (!solarFarmsList) return; // Exit if the element doesn't exist on this page
    
    // Clear any existing content (like placeholders)
    solarFarmsList.innerHTML = '';
    
    // Load the data
    const solarParks = await loadSolarParksData();
    
    // Create and append elements for each solar park
    solarParks.forEach(park => {
      const parkElement = createSolarParkElement(park);
      solarFarmsList.appendChild(parkElement);
    });
    
    // If we have more than 6 parks, only show the first 6 initially
    const allListings = solarFarmsList.querySelectorAll('.listing-card');
    if (allListings.length > 6) {
      for (let i = 6; i < allListings.length; i++) {
        allListings[i].style.display = 'none';
        allListings[i].classList.add('hidden-listing');
      }
    }
    
    // Update the load more button visibility
    const loadMoreButton = document.getElementById('load-more-farms');
    if (loadMoreButton) {
      if (allListings.length > 6) {
        loadMoreButton.style.display = 'inline-block';
        
        // Add event listener to the load more button
        loadMoreButton.addEventListener('click', function() {
          const hiddenListings = solarFarmsList.querySelectorAll('.hidden-listing');
          
          // Show the next batch of listings (up to 6 more)
          for (let i = 0; i < Math.min(6, hiddenListings.length); i++) {
            hiddenListings[i].style.display = 'block';
            hiddenListings[i].classList.remove('hidden-listing');
          }
          
          // Hide the button if no more hidden listings
          if (solarFarmsList.querySelectorAll('.hidden-listing').length === 0) {
            loadMoreButton.style.display = 'none';
          }
        });
      } else {
        loadMoreButton.style.display = 'none';
      }
    }
  }

  // Initialize the directory with the data
  populateSolarFarmsList();
  
  // Add event listeners for filter functionality
  const applyFiltersButton = document.getElementById('apply-filters');
  if (applyFiltersButton) {
    applyFiltersButton.addEventListener('click', function() {
      const country = document.getElementById('country-filter').value;
      const region = document.getElementById('region-filter').value;
      const type = document.getElementById('type-filter').value;
      
      // If type is 'solar-farm' or 'all', refresh the solar farms list
      if (type === 'solar-farm' || type === 'all') {
        populateSolarFarmsList();
      }
    });
  }
});
