document.addEventListener("DOMContentLoaded", function() {
    // Detect relative path for JSON (Root vs Sub-folder)
    const isSubFolder = window.location.pathname.includes('/jobs/') || 
                        window.location.pathname.includes('/results/') || 
                        window.location.pathname.includes('/admit-card/') || 
                        window.location.pathname.includes('/answer-key/') || 
                        window.location.pathname.includes('/syllabus/') || 
                        window.location.pathname.includes('/current-affairs/');
                        
    const jsonPath = isSubFolder ? '../data/jobs.json' : 'data/jobs.json';

    fetch(jsonPath)
        .then(response => response.json())
        .then(data => {
            // --- 1. HOMEPAGE LOGIC ---
            const jobsContainer = document.getElementById('latest-jobs-list');
            const resultsContainer = document.getElementById('latest-results-list');
            const admitContainer = document.getElementById('latest-admitcards-list');

            if (jobsContainer || resultsContainer || admitContainer) {
                if (jobsContainer) jobsContainer.innerHTML = '';
                if (resultsContainer) resultsContainer.innerHTML = '';
                if (admitContainer) admitContainer.innerHTML = '';

                let jobsCount = 0, resultsCount = 0, admitCount = 0;

                data.forEach(item => {
                    const li = document.createElement('li');
                    
                    // URL Path resolution
                    let pageUrl = item.page_url;
                    if (!pageUrl) {
                        pageUrl = isSubFolder ? `../jobs/${item.slug}.html` : `jobs/${item.slug}.html`;
                    } else if (isSubFolder && !pageUrl.startsWith('http')) {
                        pageUrl = `../${pageUrl}`;
                    }

                    // Clean Category Label
                    const categoryLabel = item.category ? item.category : 'Govt Job';
                    const dateDisplay = item.last_date ? `Date: ${item.last_date}` : '';

                    li.innerHTML = `
                        <a href="${pageUrl}">
                            <strong>${item.title}</strong>
                        </a>
                        <span class="badge">${categoryLabel}</span>
                        <span class="date">${dateDisplay}</span>
                    `;

                    // Distribution according to category
                    if (item.category === "Admit Card" && admitContainer && admitCount < 10) {
                        admitContainer.appendChild(li);
                        admitCount++;
                    } else if (item.category === "Result" && resultsContainer && resultsCount < 10) {
                        resultsContainer.appendChild(li);
                        resultsCount++;
                    } else if (jobsContainer && jobsCount < 15) {
                        jobsContainer.appendChild(li);
                        jobsCount++;
                    }
                });

                // Fallbacks if section is empty
                if (resultsCount === 0 && resultsContainer) {
                    resultsContainer.innerHTML = '<li><a>No recent result updates available</a></li>';
                }
                if (admitCount === 0 && admitContainer) {
                    admitContainer.innerHTML = '<li><a>No recent admit card updates available</a></li>';
                }
                if (jobsCount === 0 && jobsContainer) {
                    jobsContainer.innerHTML = '<li><a>No recent job updates available</a></li>';
                }
            }

            // --- 2. SUB-PAGES TABLE LOGIC ---
            const dynamicTableBody = document.getElementById('dynamic-page-table-body');
            const pageCategory = document.body.getAttribute('data-category');

            if (dynamicTableBody && pageCategory) {
                dynamicTableBody.innerHTML = '';
                let filteredItems = data.filter(item => item.category === pageCategory);

                if (filteredItems.length > 0) {
                    filteredItems.forEach(item => {
                        const tr = document.createElement('tr');
                        let pageUrl = item.page_url ? item.page_url : `../jobs/${item.slug}.html`;

                        tr.innerHTML = `
                            <td><b>${item.title}</b></td>
                            <td><span style="color: green; font-weight: bold;">Available</span></td>
                            <td><a href="${pageUrl}" class="btn btn-apply" style="padding: 5px 10px; font-size: 12px; background:#28a745; color:white; text-decoration:none; border-radius:3px;">View Details</a></td>
                        `;
                        dynamicTableBody.appendChild(tr);
                    });
                } else {
                    dynamicTableBody.innerHTML = `<tr><td colspan="3" style="text-align:center;">No recent ${pageCategory} updates found.</td></tr>`;
                }
            }
        })
        .catch(err => console.error("Error loading JSON data:", err));
});
