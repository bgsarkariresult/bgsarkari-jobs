document.addEventListener("DOMContentLoaded", function() {
    fetch('data/jobs.json')
        .then(response => response.json())
        .then(data => {
            const jobsContainer = document.getElementById('latest-jobs-list');
            if(!jobsContainer) return;
            
            jobsContainer.innerHTML = '';
            data.slice(0, 15).forEach(job => {
                const li = document.createElement('li');
                li.className = 'job-card';
                li.innerHTML = `
                    <a href="jobs/${job.slug}.html">
                        <strong>${job.title}</strong>
                    </a>
                    <span class="badge">Vacancies: ${job.vacancies}</span>
                    <span class="date">Last Date: ${job.last_date}</span>
                `;
                jobsContainer.appendChild(li);
            });
        })
        .catch(err => console.error("Error loading job listings:", err));
});
