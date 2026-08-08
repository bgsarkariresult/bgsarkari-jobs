document.addEventListener("DOMContentLoaded", function() {
    fetch('data/jobs.json')
        .then(response => response.json())
        .then(data => {
            const jobsContainer = document.getElementById('latest-jobs-list');
            const resultsContainer = document.getElementById('latest-results-list');
            const admitContainer = document.getElementById('latest-admitcards-list');

            if (jobsContainer) jobsContainer.innerHTML = '';
            if (resultsContainer) resultsContainer.innerHTML = '';
            if (admitContainer) admitContainer.innerHTML = '';

            let jobsCount = 0, resultsCount = 0, admitCount = 0;

            data.forEach(item => {
                const li = document.createElement('li');
                const targetUrl = item.page_url ? item.page_url : `jobs/${item.slug}.html`;

                li.innerHTML = `
                    <a href="${targetUrl}">
                        <strong>${item.title}</strong>
                    </a>
                    <span class="badge">${item.category || 'Notification'}</span>
                    <span class="date">${item.last_date ? 'Date: ' + item.last_date : ''}</span>
                `;

                // Category-wise distribution logic
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

            // Default fallback if any section is empty
            if (resultsCount === 0 && resultsContainer) {
                resultsContainer.innerHTML = '<li><a href="#">No recent result updates</a></li>';
            }
            if (admitCount === 0 && admitContainer) {
                admitContainer.innerHTML = '<li><a href="#">No recent admit card updates</a></li>';
            }
            if (jobsCount === 0 && jobsContainer) {
                jobsContainer.innerHTML = '<li><a href="#">No recent job updates</a></li>';
            }
        })
        .catch(err => console.error("Error loading JSON data:", err));
});
