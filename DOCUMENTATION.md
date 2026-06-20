# CloudAttend – Cloud-Based Attendance Management System
### Complete Project Documentation

---

## PROJECT ABSTRACT

CloudAttend is a lightweight, browser-based Attendance Management System built with
HTML, CSS, and JavaScript and deployed on Microsoft Azure Static Web Apps. The system
enables teachers or administrators to record, search, edit, and export student
attendance data in real time, without needing any database server or backend service.
Data is stored persistently in the browser's built-in Local Storage API, while the
application itself is served globally through Azure's CDN-backed static hosting
infrastructure. The project demonstrates key cloud computing concepts — including
global accessibility, scalability, availability, and cost-effective deployment — using
entirely free-tier services.

---

## 1. INTRODUCTION

Attendance management is one of the most routine and critical tasks in any educational
institution. Traditional paper-based systems are error-prone, slow, and difficult to
analyse. Digital systems often require expensive server infrastructure and complex
setup. CloudAttend bridges this gap by delivering a fully functional, professional-
grade attendance system that runs entirely in the browser, hosted for free on
Microsoft Azure's cloud platform.

The application provides a clean, responsive UI that works on desktops, tablets, and
mobile phones, and supports dark mode for comfort. Teachers can mark attendance,
instantly view statistics, search historical records, and export data to a CSV
spreadsheet — all within a single web page.

---

## 2. PROBLEM STATEMENT

Educational institutions still rely heavily on manual attendance registers, which
suffer from:

- **Data loss**: Physical registers can be damaged, lost, or tampered with.
- **No real-time analytics**: It is difficult to calculate attendance percentages
  quickly on paper.
- **Inaccessibility**: Records are tied to a physical location.
- **High infrastructure cost**: Server-based digital systems require hosting fees,
  database licenses, and IT maintenance.

**CloudAttend solves this** by providing a free, always-accessible, cloud-hosted
attendance system that requires zero server setup and stores data safely in the
browser.

---

## 3. OBJECTIVES

1. Build a complete attendance management system using only frontend technologies.
2. Implement all CRUD operations (Create, Read, Update, Delete) on attendance records.
3. Provide live statistics: total, present, absent, and attendance percentage.
4. Support full-text search across all record fields.
5. Enable one-click CSV export of attendance data.
6. Implement a professional UI with dark/light mode and responsive design.
7. Deploy the system on Microsoft Azure Static Web Apps for global accessibility.
8. Demonstrate cloud computing concepts using a free-tier cloud service.

---

## 4. SCOPE

**In Scope:**
- Marking attendance (Present / Absent) per student per date.
- Viewing, searching, editing, and deleting records.
- Exporting records to CSV format.
- Responsive design for mobile and desktop.
- Dark/Light mode toggle with preference persistence.
- Data persistence across browser sessions via localStorage.
- Deployment on Azure Static Web Apps (free tier).

**Out of Scope (Future Work):**
- User authentication and role-based access control.
- Cloud database integration (Azure Cosmos DB, SQL).
- Multi-device data synchronisation.
- Email/SMS notifications.
- Automated report generation.

---

## 5. SOFTWARE REQUIREMENTS

| Requirement         | Details                                      |
|---------------------|----------------------------------------------|
| **Languages**       | HTML5, CSS3, JavaScript (ES6+)               |
| **Fonts**           | Google Fonts – Space Grotesk, Inter          |
| **Icons**           | Lucide Icons (CDN, free and open source)     |
| **Browser Support** | Chrome 90+, Firefox 88+, Edge 90+, Safari 14+ |
| **Cloud Platform**  | Microsoft Azure Static Web Apps (Free Tier)  |
| **Version Control** | GitHub (Free)                                |
| **IDE/Editor**      | VS Code (recommended), Notepad++, or any editor |
| **Internet**        | Required for deployment; app works offline after first load |

---

## 6. SYSTEM ARCHITECTURE

```
                        ┌─────────────────────────────┐
                        │           USER              │
                        │  (Browser on PC / Phone)    │
                        └────────────┬────────────────┘
                                     │  HTTPS Request
                                     ▼
                        ┌─────────────────────────────┐
                        │  AZURE STATIC WEB APPS      │
                        │  (Global CDN Edge Nodes)    │
                        │  Free Tier – 100 GB/month   │
                        └────────────┬────────────────┘
                                     │  Serves static files
                                     ▼
                        ┌─────────────────────────────┐
                        │  CLOUDATTEND APPLICATION    │
                        │  index.html                 │
                        │  style.css                  │
                        │  script.js                  │
                        └────────────┬────────────────┘
                                     │  Read / Write
                                     ▼
                        ┌─────────────────────────────┐
                        │  BROWSER LOCAL STORAGE      │
                        │  (Client-side persistence)  │
                        │  Key: "cloudattend_records" │
                        └─────────────────────────────┘
```

**Data Flow:**
1. User opens the URL in a browser.
2. Azure's CDN serves the HTML/CSS/JS files from the nearest edge location.
3. JavaScript reads/writes attendance records from/to localStorage.
4. All processing happens client-side — no data leaves the user's browser.

---

## 7. WORKING OF THE PROJECT

### Step-by-step Workflow:

1. **App Launch**: On page load, `init()` in script.js runs. It restores the saved
   theme, loads records from localStorage, auto-fills today's date, and renders the
   attendance table.

2. **Adding a Record**: The user fills in Student Name, Roll Number, Date (pre-filled),
   and selects Present or Absent. Clicking "Add Attendance" triggers validation, then
   pushes the new record to the `records` array and saves it to localStorage.

3. **Duplicate Check**: The app prevents adding two records with the same Roll Number
   on the same date, showing an error toast if attempted.

4. **Searching**: The search box filters the table in real time. It matches against
   the student name, roll number, and date (both ISO and formatted).

5. **Editing**: Clicking "Edit" on any row populates the form with that record's data
   and switches the button to "Save Changes". On save, the record is updated in-place.

6. **Deleting**: Clicking "Delete" prompts for confirmation, then removes the record
   from the array and updates localStorage and the table.

7. **Statistics**: After every add/edit/delete, `updateStats()` recalculates and
   displays Total, Present, Absent, and Attendance Percentage.

8. **Export CSV**: `exportCSV()` builds a comma-separated string from all records,
   wraps it in a Blob, creates a temporary download link, and triggers a browser
   download — no server needed.

9. **Dark Mode**: Toggling the moon/sun button calls `applyTheme()`, which sets
   `data-theme` on `<html>`, swaps the icon, and saves the preference to localStorage.

---

## 8. CLOUD COMPUTING CONCEPTS USED

### 8.1 Why Azure Static Web Apps?

Azure Static Web Apps is a cloud service that automatically builds and deploys full-
stack web apps from a GitHub repository. For a static website (HTML/CSS/JS), it is
completely **free** and includes:

- **Global CDN** – files served from the edge node closest to each user worldwide.
- **Custom domain support** – free SSL/HTTPS certificate included.
- **GitHub Actions CI/CD** – automatic deployment on every git push.
- **High availability** – Microsoft SLA guarantees 99.95% uptime.

### 8.2 Cloud Hosting vs Local Hosting

| Feature              | Local Hosting                  | Azure Cloud Hosting               |
|----------------------|--------------------------------|-----------------------------------|
| **Accessibility**    | Only on your machine           | Anywhere in the world             |
| **Availability**     | Only when PC is on             | 24/7/365                          |
| **Scalability**      | Limited to your hardware       | Scales to millions of users       |
| **Cost**             | Electricity + internet         | Free (Static Web Apps free tier)  |
| **SSL/HTTPS**        | Manual setup                   | Automatic, free                   |
| **Deployment**       | Manual file copy               | Auto-deploy on GitHub push        |
| **Speed**            | Depends on your connection     | CDN serves from nearest location  |

### 8.3 Scalability

Azure Static Web Apps uses Azure's global CDN. If 1 user or 1 million users access
the app simultaneously, the cloud handles it automatically. No server configuration
is needed.

### 8.4 Availability

Azure guarantees **99.95% uptime** for Static Web Apps. The app is replicated across
multiple data centres globally, so it remains available even if one data centre fails.

### 8.5 Accessibility

Once deployed, the app is accessible from any device (PC, tablet, phone) and any
location via a unique URL like `https://your-app.azurestaticapps.net`, as long as
there is internet access.

### 8.6 Local Storage as Client-Side Persistence

Although not a cloud database, localStorage provides a simple client-side key-value
store. Data persists across browser sessions. It is appropriate for single-user, demo,
or educational projects. In a production system, this would be replaced with Azure
Cosmos DB or Azure SQL Database.

---

## 9. ADVANTAGES OF CLOUD HOSTING

1. **No server management** – Azure handles all infrastructure.
2. **Zero cost** – The free tier supports unlimited traffic for static sites.
3. **Automatic SSL** – HTTPS is enabled automatically, improving security.
4. **Global CDN** – Users worldwide get fast load times via edge caching.
5. **CI/CD Pipeline** – Deploying a change is as simple as a `git push`.
6. **High availability** – Redundant infrastructure ensures near-zero downtime.
7. **Scalable** – No configuration needed to handle traffic spikes.
8. **Environment isolation** – Development and production environments are separate.

---

## 10. FUTURE SCOPE

1. **Azure Cosmos DB Integration** – Replace localStorage with a cloud NoSQL database
   for multi-device synchronisation.
2. **User Authentication** – Add Azure Active Directory B2C for teacher/admin login.
3. **Push Notifications** – Alert parents via Azure Notification Hubs when a student
   is absent.
4. **Analytics Dashboard** – Use Azure Static Web Apps with Azure Functions to
   generate detailed monthly/weekly reports.
5. **Offline PWA Support** – Add a Service Worker to make the app work offline and
   sync when back online.
6. **QR Code Attendance** – Allow students to scan a QR code to mark their own
   attendance.
7. **Multi-Class Support** – Manage multiple classes/subjects from a single interface.

---

## 11. CONCLUSION

CloudAttend successfully demonstrates that a fully functional, professional attendance
management system can be built using only HTML, CSS, and JavaScript, and hosted for
free on Microsoft Azure Static Web Apps. The project covers essential cloud computing
concepts — global accessibility, scalability, high availability, and CDN delivery —
without incurring any cost. It is simple enough for a beginner to deploy and extend,
while being robust enough to handle real-world use cases as a foundation for future
cloud-native enhancements.

---
---

# VIVA PREPARATION – 20 Questions & Answers

---

**Q1. What is Cloud Computing?**
A: Cloud computing is the delivery of computing services — including servers, storage,
databases, networking, software, and analytics — over the internet ("the cloud") to
offer faster innovation, flexible resources, and economies of scale. Examples include
AWS, Microsoft Azure, and Google Cloud.

---

**Q2. What is Microsoft Azure?**
A: Microsoft Azure is a cloud computing platform by Microsoft that provides a wide
range of services including computing (virtual machines, containers), storage,
databases, AI/ML, networking, and developer tools. It operates across 60+ data centre
regions worldwide.

---

**Q3. What is Azure Static Web Apps?**
A: Azure Static Web Apps is a free Azure service that automatically builds and deploys
full-stack web applications from a GitHub repository. It is designed for static
frontend apps (HTML/CSS/JS) and serves them through a global CDN with free SSL.

---

**Q4. Why did you choose Azure Static Web Apps for this project?**
A: Because it is free, easy to deploy, and provides global CDN-backed hosting with
HTTPS. Since our project uses only HTML, CSS, and JavaScript with no backend, a
static hosting service is perfectly suited. It also integrates natively with GitHub
for automated CI/CD deployments.

---

**Q5. What is a CDN (Content Delivery Network)?**
A: A CDN is a network of servers distributed across multiple geographic locations.
When a user requests a file, the CDN serves it from the server nearest to the user,
reducing latency and improving load times. Azure Static Web Apps uses Azure's global
CDN to deliver files quickly to users worldwide.

---

**Q6. What is Local Storage in a browser?**
A: localStorage is a Web Storage API built into browsers that allows websites to store
key-value pairs in the user's browser persistently. Data stored in localStorage
survives page refreshes and browser restarts, but is tied to the specific browser and
device. In this project, all attendance records are stored in localStorage under the
key "cloudattend_records".

---

**Q7. What is the difference between localStorage and sessionStorage?**
A: localStorage persists data until it is explicitly cleared — data survives browser
restarts. sessionStorage stores data only for the duration of the current browser tab
session — it is cleared when the tab is closed. For this project, localStorage was
chosen so records are not lost when the browser is closed.

---

**Q8. What is scalability in cloud computing?**
A: Scalability is the ability of a system to handle increasing workload by adding
resources. Azure Static Web Apps scales automatically — whether 1 user or 1 million
users access the app, Azure's CDN serves all requests without any manual intervention
or configuration.

---

**Q9. What is High Availability?**
A: High availability means a system is operational and accessible for the maximum
possible time, with minimal downtime. Azure Static Web Apps guarantees 99.95% uptime
through redundant infrastructure across multiple data centres.

---

**Q10. What is CI/CD in the context of this project?**
A: CI/CD stands for Continuous Integration / Continuous Deployment. When a code change
is pushed to GitHub, Azure Static Web Apps automatically builds and deploys the updated
app via GitHub Actions — no manual upload is needed. This is CI/CD in action.

---

**Q11. What is HTTPS and why is it important?**
A: HTTPS (Hypertext Transfer Protocol Secure) is the encrypted version of HTTP. Azure
Static Web Apps provides a free SSL/TLS certificate, enabling HTTPS automatically.
HTTPS ensures that data between the user's browser and the server is encrypted,
protecting against eavesdropping and man-in-the-middle attacks.

---

**Q12. What is the difference between frontend and backend?**
A: The frontend (client-side) is everything the user sees and interacts with in the
browser — HTML, CSS, JavaScript. The backend (server-side) handles business logic,
databases, and APIs — typically Node.js, Python, Java, etc. This project is entirely
frontend; localStorage replaces the backend database for simplicity.

---

**Q13. How is data stored in this project?**
A: All attendance records are stored in the browser's localStorage as a JSON string.
The app reads and writes to the key "cloudattend_records". When a record is added,
edited, or deleted, the updated records array is serialised with JSON.stringify() and
saved back to localStorage.

---

**Q14. What is JSON? How is it used here?**
A: JSON (JavaScript Object Notation) is a lightweight data format for storing and
exchanging data, structured as key-value pairs. In this project, the attendance
records array is converted to a JSON string using JSON.stringify() before saving to
localStorage, and parsed back using JSON.parse() when loading.

---

**Q15. What is GitHub and how is it used for deployment?**
A: GitHub is a cloud-based version control platform using Git. In this project, the
project files (index.html, style.css, script.js) are uploaded to a GitHub repository.
Azure Static Web Apps connects to this repository and automatically deploys the files
to its CDN every time you push a change.

---

**Q16. What are the limitations of localStorage?**
A: localStorage has several limitations: (1) ~5 MB storage limit per origin,
(2) data is only accessible in the same browser on the same device — it cannot sync
across devices, (3) it is not encrypted, so sensitive data should not be stored in it,
(4) it is synchronous and can block the main thread if reading large amounts of data.

---

**Q17. What is the difference between IaaS, PaaS, and SaaS?**
A: IaaS (Infrastructure as a Service) provides virtual machines and raw computing
resources — e.g., Azure Virtual Machines. PaaS (Platform as a Service) provides a
managed platform for deploying apps without managing the OS — e.g., Azure App Service.
SaaS (Software as a Service) provides ready-to-use software over the internet —
e.g., Microsoft 365. Azure Static Web Apps is closest to PaaS.

---

**Q18. How does the export to CSV feature work?**
A: The exportCSV() function builds a comma-separated string from the records array,
wraps it in a Blob object with type "text/csv", creates a temporary object URL using
URL.createObjectURL(), attaches it to a hidden anchor tag, triggers a programmatic
click to download the file, and then revokes the URL to free memory. No server is
needed.

---

**Q19. How does dark mode work in this project?**
A: Dark mode is implemented using a CSS custom property system. A `data-theme`
attribute on the `<html>` element switches between two sets of CSS variables defined
in `:root` (light) and `[data-theme="dark"]` (dark). JavaScript toggles this attribute
and saves the preference to localStorage so it persists across sessions.

---

**Q20. Can this project be scaled to a real production system? What changes would be
needed?**
A: Yes. To scale to production, you would: (1) replace localStorage with Azure Cosmos
DB or Azure SQL Database for cloud-based, multi-device data storage, (2) add Azure
Functions as a backend API layer for secure data operations, (3) implement Azure Active
Directory B2C for user authentication, (4) add role-based access control for
teachers/admins/students, and (5) set up Azure Monitor for logging and performance
monitoring. The frontend can remain largely unchanged.

---
---

# POWERPOINT PRESENTATION – 10 Slides

---

## SLIDE 1: TITLE SLIDE

**Title:** CloudAttend
**Subtitle:** Cloud-Based Attendance Management System
**Line 3:** Hosted on Microsoft Azure Static Web Apps
**Presented by:** [Your Name] | [Roll Number]
**Subject:** Cloud Computing | [Your College Name]
**Date:** [Today's Date]

*Design note: Use a dark navy background with indigo and white text.
Add the Azure logo and a cloud SVG illustration.*

---

## SLIDE 2: INTRODUCTION

**Heading:** What is CloudAttend?

**Bullet Points:**
- A fully functional Attendance Management System
- Built with HTML, CSS, and JavaScript — no backend needed
- Hosted for free on Microsoft Azure Static Web Apps
- Accessible from any device, anywhere in the world
- Data stored securely in the browser's Local Storage
- Supports dark mode, CSV export, and live search

**Visual:** Screenshot of the app (light mode, with data filled in)

---

## SLIDE 3: PROBLEM STATEMENT

**Heading:** The Problem With Traditional Attendance

| Problem                  | Impact                                      |
|--------------------------|---------------------------------------------|
| Paper registers          | Prone to loss, damage, tampering            |
| No real-time analytics   | Manual calculation of percentages           |
| Inaccessible records     | Tied to a physical location                 |
| Expensive digital systems| Require servers, databases, IT staff        |

**Solution:** A free, cloud-hosted, browser-based attendance system that anyone can
use immediately without installation.

---

## SLIDE 4: OBJECTIVES

**Heading:** Project Objectives

1. Build a complete attendance system with no backend server
2. Implement full CRUD: Create, Read, Update, Delete records
3. Calculate live statistics: Present %, Absent, Total
4. Support full-text search across all attendance records
5. Enable one-click CSV export for offline analysis
6. Deploy on Azure cloud for global accessibility
7. Demonstrate real-world cloud computing concepts

---

## SLIDE 5: SYSTEM ARCHITECTURE

**Heading:** How CloudAttend Works in the Cloud

```
        USER (Browser)
              │
              ▼  HTTPS Request
    ┌─────────────────────────┐
    │  AZURE STATIC WEB APPS  │
    │  Global CDN – Free Tier │
    └────────────┬────────────┘
                 │  Serves HTML / CSS / JS
                 ▼
    ┌─────────────────────────┐
    │   CLOUDATTEND APP       │
    │   index.html            │
    │   style.css             │
    │   script.js             │
    └────────────┬────────────┘
                 │  Read / Write
                 ▼
    ┌─────────────────────────┐
    │   BROWSER LOCAL STORAGE │
    │   (Client-side data)    │
    └─────────────────────────┘
```

**Key Point:** No database server. No backend server. 100% cloud-hosted.

---

## SLIDE 6: FEATURES

**Heading:** Key Features

**Column 1 – Data Management:**
- ✅ Add attendance records (Name, Roll No, Date, Status)
- ✅ Edit existing records inline
- ✅ Delete individual records
- ✅ Clear all records at once
- ✅ Duplicate entry prevention

**Column 2 – Analytics & UI:**
- 📊 Live statistics: Total / Present / Absent / %
- 🔍 Real-time search across all fields
- 📥 Export all records to CSV
- 🌙 Dark / Light mode toggle
- 📱 Fully responsive (mobile + desktop)
- 🔔 Success and error notifications

---

## SLIDE 7: CLOUD COMPUTING CONCEPTS USED

**Heading:** Cloud Concepts Demonstrated

| Concept              | How It's Applied                               |
|----------------------|------------------------------------------------|
| **Cloud Hosting**    | Azure Static Web Apps serves the app globally  |
| **CDN**              | Azure CDN delivers files from nearest edge node|
| **Scalability**      | Handles any number of users automatically       |
| **High Availability**| 99.95% Azure uptime SLA                        |
| **CI/CD**            | GitHub → Azure auto-deploy pipeline             |
| **HTTPS / SSL**      | Free SSL certificate from Azure                |
| **Pay-as-you-go**    | Free tier – zero cost for static apps           |
| **Accessibility**    | Available from any device via public URL        |

---

## SLIDE 8: SCREENSHOTS

**Heading:** Application Screenshots

Include screenshots of:
1. **Main Dashboard** – showing stat cards and the form
2. **Filled Table** – records with Present/Absent badges
3. **Dark Mode** – the app in dark theme
4. **Mobile View** – responsive layout on a phone screen
5. **CSV Export** – the downloaded file opened in Excel
6. **Azure Portal** – the deployed Static Web App URL

*Tip: Take screenshots after adding 5-6 demo records so the app looks populated.*

---

## SLIDE 9: FUTURE SCOPE

**Heading:** Future Enhancements

- 🗄️ **Azure Cosmos DB** – Cloud database for multi-device sync
- 🔐 **Azure AD B2C** – User authentication (teacher/student login)
- ⚡ **Azure Functions** – Serverless backend API for secure operations
- 📈 **Analytics Dashboard** – Weekly/monthly attendance trend charts
- 📲 **Progressive Web App (PWA)** – Offline capability + install on phone
- 📧 **Email Alerts** – Notify parents of absence via Azure Communication Services
- 🔲 **QR Code Check-in** – Students scan QR to mark their own attendance

---

## SLIDE 10: CONCLUSION

**Heading:** Conclusion

**Key Takeaways:**
- CloudAttend proves that a production-grade attendance system can be built with
  only HTML, CSS, and JavaScript — no backend required.
- Deployed on Microsoft Azure Static Web Apps for **free**, globally accessible
  via HTTPS with a CDN.
- Demonstrates cloud computing concepts: scalability, availability, CDN, CI/CD,
  and cost efficiency.
- A solid foundation that can be extended with Azure Functions and Cosmos DB for
  a full enterprise system.

**Live Demo URL:** https://[your-app-name].azurestaticapps.net

**Thank you!**

---
---

# DEPLOYMENT GUIDE – Step-by-Step

## How to Deploy CloudAttend on Azure Static Web Apps

---

### PHASE 1: SET UP GITHUB REPOSITORY

**Step 1 – Create a GitHub Account (if you don't have one)**
1. Open your browser and go to https://github.com
2. Click "Sign up" and follow the instructions to create a free account.
3. Verify your email address.

**Step 2 – Create a New Repository**
1. After logging in, click the green "New" button (top left) or go to:
   https://github.com/new
2. Fill in the details:
   - **Repository name:** `cloud-attendance-system`
   - **Description:** Cloud-Based Attendance Management System
   - **Visibility:** Public (required for free Azure deployment)
   - **Check:** "Add a README file"
3. Click **"Create repository"**.

**Step 3 – Upload Your Project Files**
1. On your new repository page, click **"Add file"** → **"Upload files"**.
2. Drag and drop (or click "choose your files") and select all three files:
   - `index.html`
   - `style.css`
   - `script.js`
3. Scroll down and type a commit message: `Initial project upload`
4. Click **"Commit changes"**.
5. Verify all three files now appear in your repository.

---

### PHASE 2: CREATE AZURE ACCOUNT

**Step 4 – Sign Up for Azure (Free)**
1. Go to https://azure.microsoft.com/free
2. Click "Start free" and sign in with a Microsoft account
   (or create one – it's free).
3. You will need a phone number and a credit card for identity verification.
   **You will NOT be charged** for Azure Static Web Apps (it's free tier).
4. Complete the sign-up process. You'll get $200 free credits for 30 days
   plus always-free services including Static Web Apps.

---

### PHASE 3: DEPLOY ON AZURE STATIC WEB APPS

**Step 5 – Go to Azure Portal**
1. Open https://portal.azure.com
2. Log in with your Microsoft account.

**Step 6 – Search for Static Web Apps**
1. In the top search bar, type: `Static Web Apps`
2. Click on "Static Web Apps" under Services.

**Step 7 – Create a New Static Web App**
1. Click the **"+ Create"** button (top left).
2. Fill in the form:
   - **Subscription:** "Azure for Students" or "Free Trial"
   - **Resource Group:** Click "Create new" → type `attendance-rg` → click OK
   - **Name:** `cloud-attendance-system` (must be globally unique)
   - **Plan type:** Free
   - **Region:** East Asia (or the region closest to you)
   - **Source:** GitHub

**Step 8 – Connect to GitHub**
1. Click **"Sign in with GitHub"**.
2. Authorise Azure to access your GitHub account.
3. Select:
   - **Organisation:** your GitHub username
   - **Repository:** `cloud-attendance-system`
   - **Branch:** `main`

**Step 9 – Configure Build Settings**
1. **Build Presets:** Select "Custom" (since we have no build step)
2. **App location:** `/`  (root of the repository)
3. **Api location:** leave BLANK
4. **Output location:** leave BLANK
5. Click **"Review + Create"** at the bottom.

**Step 10 – Review and Create**
1. Review the summary page.
2. Click **"Create"**.
3. Azure will now:
   - Create the Static Web App resource.
   - Add a GitHub Actions workflow file to your repository.
   - Automatically start deploying your files.

**Step 11 – Wait for Deployment**
1. You'll see "Deployment is in progress…" — this takes about 2–5 minutes.
2. Once done, click **"Go to resource"**.

---

### PHASE 4: GET YOUR LIVE URL

**Step 12 – Find Your Live URL**
1. On the Static Web App resource page, look for **"URL"** on the Overview panel.
2. It will look like: `https://wonderful-tree-0abc1234.azurestaticapps.net`
3. Click the URL — your CloudAttend app is now live!

**Step 13 – Verify Everything Works**
1. Open the URL in your browser.
2. Add a few attendance records.
3. Test search, edit, delete, export, and dark mode.
4. Open the URL on your phone to verify responsive design.

---

### PHASE 5: MAKING FUTURE UPDATES

**Step 14 – Updating Your App**
Whenever you change your code:
1. Go to your GitHub repository.
2. Click the file you want to edit → click the pencil (edit) icon.
3. Make your changes.
4. Click "Commit changes".
5. Azure will **automatically redeploy** within 2–3 minutes. No manual steps!

---

### TROUBLESHOOTING

| Problem                        | Solution                                        |
|--------------------------------|-------------------------------------------------|
| App shows blank page           | Check browser console (F12) for JS errors       |
| Deployment failed on Azure     | Check GitHub Actions tab in your repository for error logs |
| Changes not reflected          | Wait 3-5 minutes for CDN to propagate           |
| URL not found                  | Ensure repository is Public, not Private        |
| Files missing from GitHub      | Re-upload all three files: index.html, style.css, script.js |

---

### USEFUL LINKS

- Azure Portal: https://portal.azure.com
- Azure Static Web Apps Docs: https://docs.microsoft.com/azure/static-web-apps
- GitHub: https://github.com
- Azure Free Account: https://azure.microsoft.com/free

---

*Once deployed, send me (Claude) a screenshot of each step if you get stuck,
and I will guide you through it!*
