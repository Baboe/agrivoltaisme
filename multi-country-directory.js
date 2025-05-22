// This JavaScript file integrates the processed multi-country solar park data into the Ombaa directory
// It loads the combined JSON data and dynamically creates directory listings with country/region filtering

document.addEventListener('DOMContentLoaded', function() {
  // Function to load the solar parks data
  async function loadSolarParksData() {
    try {
      const response = await fetch('/data/processed_solar_parks_combined.json');
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
    listingCard.dataset.country = park.country.toLowerCase();
    listingCard.dataset.region = park.region ? park.region.toLowerCase() : '';
    
    // Format hectares with 1 decimal place if it's a number
    const hectaresDisplay = typeof park.total_hectares === 'number' 
      ? park.total_hectares.toFixed(1) 
      : park.total_hectares;
    
    // Create the inner HTML for the listing
    listingCard.innerHTML = `
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-bold">${park.name}</h3>
          <span class="country-badge px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">${park.country}</span>
        </div>
        <p class="text-gray-600 mb-4">${park.location}</p>
        <div class="mb-4">
          <p class="font-medium">Size: ${hectaresDisplay} hectares</p>
          <p class="font-medium">Vegetation Type: ${park.vegetation_type}</p>
          ${park.region ? `<p class="font-medium">Region: ${park.region}</p>` : ''}
        </div>
        <p class="text-gray-700 mb-4">Solar park seeking shepherds for eco-friendly vegetation management.</p>
        <button class="contact-button w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300" 
          data-id="${park.name.replace(/\s+/g, '-').toLowerCase()}" 
          data-type="solar-farm">Contact</button>
      </div>
    `;
    
    return listingCard;
  }

  // Function to populate the solar farms list
  async function populateSolarFarmsList(filters = {}) {
    const solarFarmsList = document.getElementById('solar-farms-list');
    if (!solarFarmsList) return; // Exit if the element doesn't exist on this page
    
    // Clear any existing content (like placeholders)
    solarFarmsList.innerHTML = '';
    
    // Load the data
    const solarParks = await loadSolarParksData();
    
    // Filter the data based on selected filters
    const filteredParks = solarParks.filter(park => {
      // Filter by country if specified
      if (filters.country && filters.country !== 'all') {
        if (park.country.toLowerCase() !== filters.country.toLowerCase()) {
          return false;
        }
      }
      
      // Filter by region if specified
      if (filters.region && filters.region !== 'all') {
        if (!park.region || park.region.toLowerCase() !== filters.region.toLowerCase()) {
          return false;
        }
      }
      
      return true;
    });
    
    // Create and append elements for each solar park
    filteredParks.forEach(park => {
      const parkElement = createSolarParkElement(park);
      solarFarmsList.appendChild(parkElement);
    });
    
    // Update the count display
    const countElement = document.getElementById('solar-farms-count');
    if (countElement) {
      countElement.textContent = filteredParks.length;
    }
    
    // If we have more than 12 parks, only show the first 12 initially
    const allListings = solarFarmsList.querySelectorAll('.listing-card');
    if (allListings.length > 12) {
      for (let i = 12; i < allListings.length; i++) {
        allListings[i].style.display = 'none';
        allListings[i].classList.add('hidden-listing');
      }
    }
    
    // Update the load more button visibility
    const loadMoreButton = document.getElementById('load-more-farms');
    if (loadMoreButton) {
      if (allListings.length > 12) {
        loadMoreButton.style.display = 'inline-block';
        
        // Add event listener to the load more button
        loadMoreButton.addEventListener('click', function() {
          const hiddenListings = solarFarmsList.querySelectorAll('.hidden-listing');
          
          // Show the next batch of listings (up to 12 more)
          for (let i = 0; i < Math.min(12, hiddenListings.length); i++) {
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
    
    // If no results, show a message
    if (filteredParks.length === 0) {
      const noResults = document.createElement('div');
      noResults.className = 'col-span-full text-center py-8';
      noResults.innerHTML = `
        <p class="text-gray-500 text-lg">No solar farms found matching your criteria.</p>
        <p class="text-gray-500">Try adjusting your filters or <a href="#" class="text-green-600 hover:underline" id="reset-filters">reset all filters</a>.</p>
      `;
      solarFarmsList.appendChild(noResults);
      
      // Add event listener to reset filters link
      document.getElementById('reset-filters').addEventListener('click', function(e) {
        e.preventDefault();
        const countryFilter = document.getElementById('country-filter');
        const regionFilter = document.getElementById('region-filter');
        if (countryFilter) countryFilter.value = 'all';
        if (regionFilter) regionFilter.value = 'all';
        populateSolarFarmsList();
      });
    }
  }

  // Function to populate the region filter based on selected country
  async function populateRegionFilter(country) {
    const regionFilter = document.getElementById('region-filter');
    if (!regionFilter) return;
    
    // Clear existing options except the first one
    while (regionFilter.options.length > 1) {
      regionFilter.remove(1);
    }
    
    if (country === 'all') {
      regionFilter.disabled = true;
      return;
    }
    
    // Load the data
    const solarParks = await loadSolarParksData();
    
    // Get unique regions for the selected country
    const regions = new Set();
    solarParks.forEach(park => {
      if (park.country.toLowerCase() === country.toLowerCase() && park.region) {
        regions.add(park.region);
      }
    });
    
    // Add options for each region
    const sortedRegions = Array.from(regions).sort();
    sortedRegions.forEach(region => {
      const option = document.createElement('option');
      option.value = region.toLowerCase();
      option.textContent = region;
      regionFilter.appendChild(option);
    });
    
    regionFilter.disabled = sortedRegions.length === 0;
  }

  // Initialize the directory with the data
  populateSolarFarmsList();
  
  // Add event listeners for filter functionality
  const countryFilter = document.getElementById('country-filter');
  const regionFilter = document.getElementById('region-filter');
  const applyFiltersButton = document.getElementById('apply-filters');
  
  if (countryFilter) {
    countryFilter.addEventListener('change', function() {
      populateRegionFilter(this.value);
    });
  }
  
  if (applyFiltersButton) {
    applyFiltersButton.addEventListener('click', function() {
      const country = countryFilter ? countryFilter.value : 'all';
      const region = regionFilter ? regionFilter.value : 'all';
      const type = document.getElementById('type-filter') ? document.getElementById('type-filter').value : 'all';
      
      // If type is 'solar-farm' or 'all', refresh the solar farms list
      if (type === 'solar-farm' || type === 'all') {
        populateSolarFarmsList({ country, region });
      }
    });
  }
  
  // Populate country filter with available countries
  async function populateCountryFilter() {
    const countryFilter = document.getElementById('country-filter');
    if (!countryFilter) return;
    
    // Load the data
    const solarParks = await loadSolarParksData();
    
    // Get unique countries
    const countries = new Set();
    solarParks.forEach(park => {
      countries.add(park.country);
    });
    
    // Add options for each country
    const sortedCountries = Array.from(countries).sort();
    sortedCountries.forEach(country => {
      const option = document.createElement('option');
      option.value = country.toLowerCase();
      option.textContent = country;
      countryFilter.appendChild(option);
    });
  }
  
  // Initialize country filter
  populateCountryFilter();
});
