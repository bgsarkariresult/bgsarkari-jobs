import json
import os
import subprocess
from datetime import datetime

# 1. json फ़ाइल का नाम
JSON_FILE = 'jobs.json'

def add_job(title, category, link):
    """
    नया जॉब डेटा JSON फ़ाइल में जोड़ने का फंक्शन
    category options: 'latest_jobs', 'results', 'admit_card', 'answer_key', 'syllabus', 'current_affairs'
    """
    today_date = datetime.now().strftime("%Y-%m-%d")
    
    new_entry = {
        "title": title,
        "category": category,
        "link": link,
        "date": today_date
    }

    # JSON फ़ाइल पढ़ें और अपडेट करें
    try:
        with open(JSON_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        data = {"jobs": []}

    # नए पोस्ट को लिस्ट में सबसे ऊपर (Top) जोड़ने के लिए insert(0, ...)
    data["jobs"].insert(0, new_entry)

    # अपडेटेड डेटा वापस फ़ाइल में लिखें
    with open(JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"✅ Success: '{title}' added to {JSON_FILE}")

def auto_github_push(commit_message):
    """
    Git commands चलाकर GitHub पर ऑटो-पुश करने का फंक्शन
    """
    try:
        print("🚀 GitHub पर डेटा पुश किया जा रहा है...")
        
        # Git Commands Execute करें
        subprocess.run(["git", "add", JSON_FILE], check=True)
        subprocess.run(["git", "commit", "-m", commit_message], check=True)
        subprocess.run(["git", "push", "origin", "main"], check=True) # अगर आपकी ब्रांच master है तो 'main' की जगह 'master' लिखें
        
        print("🎉 BG Jobs वेबसाइट सफलतापूर्वक अपडेट हो गई है!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error during Git Push: {e}")

# ==================== MAIN EXECUTION ====================
if __name__ == "__main__":
    # उदाहरण: यहाँ अपनी नई पोस्ट की डिटेल्स डालें
    job_title = "RRB Technician Grade III Admit Card 2026 Out"
    job_category = "admit_card"
    job_link = "https://example.com/admit-card"

    # 1. JSON अपडेट करें
    add_job(job_title, job_category, job_link)

    # 2. GitHub पर ऑटो पुश करें
    auto_github_push(f"Auto-update: Added {job_title}")
