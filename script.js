/**
 * CloudAttend – script.js
 * Cloud-Based Attendance Management System
 *
 * All data is persisted in the browser's localStorage under the key
 * "cloudattend_records". No server or backend is required.
 *
 * Sections:
 *   1. Constants & State
 *   2. LocalStorage Helpers
 *   3. Utility Helpers
 *   4. Toast Notifications
 *   5. Statistics
 *   6. Render Table
 *   7. Form Handling (Add / Edit / Cancel)
 *   8. Delete
 *   9. Search / Filter
 *  10. Export CSV
 *  11. Clear All
 *  12. Dark / Light Theme
 *  13. Initialisation
 */

/* ══════════════════════════════════════════════════════
   1. Constants & State
══════════════════════════════════════════════════════ */
const STORAGE_KEY = 'cloudattend_records'; // key used in localStorage

// Runtime state
let records     = [];   // array of attendance record objects
let filterText  = '';   // current search filter string

/* ══════════════════════════════════════════════════════
   2. LocalStorage Helpers
══════════════════════════════════════════════════════ */

/** Load all records from localStorage into the records array */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    records = raw ? JSON.parse(raw) : [];
  } catch (e) {
    // If JSON is corrupted, start fresh
    console.error('CloudAttend: Failed to parse storage, resetting.', e);
    records = [];
  }
}

/** Save the current records array to localStorage */
function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    showToast('Storage full – could not save record.', 'error');
    console.error('CloudAttend: Storage write failed.', e);
  }
}

/* ══════════════════════════════════════════════════════
   3. Utility Helpers
══════════════════════════════════════════════════════ */

/** Generate a simple unique ID (timestamp + random) */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/** Format an ISO date string (YYYY-MM-DD) to a readable form (DD MMM YYYY) */
function formatDate(isoDate) {
  if (!isoDate) return '—';
  const [y, m, d] = isoDate.split('-').map(Number);
  const months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${String(d).padStart(2,'0')} ${months[m-1]} ${y}`;
}

/** Return today's date as YYYY-MM-DD (for auto-filling the date input) */
function todayISO() {
  const now = new Date();
  const y   = now.getFullYear();
  const m   = String(now.getMonth() + 1).padStart(2, '0');
  const d   = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Escape HTML to prevent XSS when inserting user content into innerHTML */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ══════════════════════════════════════════════════════
   4. Toast Notifications
══════════════════════════════════════════════════════ */
let toastTimer = null;

/**
 * Show a toast notification.
 * @param {string} message - Text to display
 * @param {'success'|'error'|'info'} type
 */
function showToast(message, type = 'info') {
  const toast   = document.getElementById('toast');
  const msgEl   = document.getElementById('toast-msg');
  const iconEl  = document.getElementById('toast-icon');

  // Set icon based on type
  const icons = {
    success: '✅',
    error:   '❌',
    info:    'ℹ️',
  };
  iconEl.textContent = icons[type] || icons.info;
  msgEl.textContent  = message;

  // Remove old type classes, add current
  toast.classList.remove('toast-success', 'toast-error', 'toast-info');
  toast.classList.add(`toast-${type}`, 'toast-show');

  // Auto-hide after 3 seconds
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('toast-show');
  }, 3000);
}

/* ══════════════════════════════════════════════════════
   5. Statistics
══════════════════════════════════════════════════════ */

/** Recalculate and update the four stat cards */
function updateStats() {
  const total   = records.length;
  const present = records.filter(r => r.status === 'Present').length;
  const absent  = records.filter(r => r.status === 'Absent').length;
  const pct     = total > 0 ? Math.round((present / total) * 100) : 0;

  document.getElementById('stat-total').textContent   = total;
  document.getElementById('stat-present').textContent = present;
  document.getElementById('stat-absent').textContent  = absent;
  document.getElementById('stat-percent').textContent = `${pct}%`;
}

/* ══════════════════════════════════════════════════════
   6. Render Table
══════════════════════════════════════════════════════ */

/** Re-render the table rows based on the current records + filter */
function renderTable() {
  const tbody      = document.getElementById('table-body');
  const emptyState = document.getElementById('empty-state');
  const countEl    = document.getElementById('record-count');

  // Apply search filter (case-insensitive, matches name / roll / date)
  const query = filterText.trim().toLowerCase();
  const filtered = query
    ? records.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.roll.toLowerCase().includes(query) ||
        r.date.includes(query)              ||
        formatDate(r.date).toLowerCase().includes(query)
      )
    : [...records];

  // Sort: most recent first (by date, then insertion order via id)
  filtered.sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date);
    return b.id.localeCompare(a.id);
  });

  // Show/hide empty state
  if (filtered.length === 0) {
    tbody.innerHTML = '';
    emptyState.classList.remove('hidden');
    countEl.textContent = query
      ? `No records match "${query}".`
      : 'No attendance records yet.';
    updateStats();
    return;
  }

  emptyState.classList.add('hidden');

  // Build table rows
  const rowsHTML = filtered.map((rec, index) => {
    const statusClass = rec.status === 'Present' ? 'badge-present' : 'badge-absent';
    const statusIcon  = rec.status === 'Present' ? '✅' : '❌';
    return `
      <tr data-id="${escapeHtml(rec.id)}">
        <td>${index + 1}</td>
        <td>${escapeHtml(rec.name)}</td>
        <td><code style="font-family:var(--font-mono);font-size:.82rem">${escapeHtml(rec.roll)}</code></td>
        <td>${escapeHtml(formatDate(rec.date))}</td>
        <td>
          <span class="badge ${statusClass}">${statusIcon} ${escapeHtml(rec.status)}</span>
        </td>
        <td>
          <div class="action-cell">
            <button class="btn-edit"   onclick="startEdit('${escapeHtml(rec.id)}')">✏️ Edit</button>
            <button class="btn-delete" onclick="deleteRecord('${escapeHtml(rec.id)}')">🗑️ Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  tbody.innerHTML = rowsHTML;
  countEl.textContent = `Showing ${filtered.length} of ${records.length} record${records.length !== 1 ? 's' : ''}`;
  updateStats();
}

/* ══════════════════════════════════════════════════════
   7. Form Handling
══════════════════════════════════════════════════════ */

/** Retrieve and validate form values. Returns null if validation fails. */
function getFormValues() {
  const nameInput = document.getElementById('student-name');
  const rollInput = document.getElementById('roll-number');
  const dateInput = document.getElementById('date');
  const statusSel = document.getElementById('status');

  // Clear previous error highlights
  [nameInput, rollInput, dateInput].forEach(el => el.classList.remove('input-error'));

  const name   = nameInput.value.trim();
  const roll   = rollInput.value.trim();
  const date   = dateInput.value;
  const status = statusSel.value;

  let valid = true;
  const errors = [];

  if (!name) {
    nameInput.classList.add('input-error');
    errors.push('Student Name is required.');
    valid = false;
  }
  if (!roll) {
    rollInput.classList.add('input-error');
    errors.push('Roll Number is required.');
    valid = false;
  }
  if (!date) {
    dateInput.classList.add('input-error');
    errors.push('Date is required.');
    valid = false;
  }

  if (!valid) {
    showToast(errors[0], 'error');
    return null;
  }

  return { name, roll, date, status };
}

/** Reset the form to its default state */
function resetForm() {
  document.getElementById('student-name').value = '';
  document.getElementById('roll-number').value  = '';
  document.getElementById('date').value         = todayISO(); // keep today's date
  document.getElementById('status').value       = 'Present';
  document.getElementById('edit-id').value      = '';

  // Restore "Add" mode UI
  document.getElementById('add-btn-label').textContent = 'Add Attendance';
  document.getElementById('cancel-edit-btn').classList.add('hidden');

  // Clear any error highlights
  ['student-name', 'roll-number', 'date'].forEach(id =>
    document.getElementById(id).classList.remove('input-error')
  );
}

/** Handle the main form button click (Add or Save Edit) */
function handleFormSubmit() {
  const values = getFormValues();
  if (!values) return;  // validation failed

  const editId = document.getElementById('edit-id').value;

  if (editId) {
    // ── UPDATE EXISTING RECORD ──
    const idx = records.findIndex(r => r.id === editId);
    if (idx === -1) {
      showToast('Record not found. Please refresh.', 'error');
      return;
    }
    records[idx] = { ...records[idx], ...values }; // merge updated fields
    saveToStorage();
    renderTable();
    showToast(`Record for ${values.name} updated successfully!`, 'success');
    resetForm();
  } else {
    // ── ADD NEW RECORD ──
    // Check for duplicate: same roll number on same date
    const duplicate = records.find(
      r => r.roll.toLowerCase() === values.roll.toLowerCase() && r.date === values.date
    );
    if (duplicate) {
      showToast(`Roll No. ${values.roll} already has an entry for this date.`, 'error');
      document.getElementById('roll-number').classList.add('input-error');
      return;
    }

    const newRecord = {
      id:     generateId(),
      name:   values.name,
      roll:   values.roll,
      date:   values.date,
      status: values.status,
    };
    records.push(newRecord);
    saveToStorage();
    renderTable();
    showToast(`Attendance marked for ${values.name}! `, 'success');
    resetForm();
    // Focus back on name input for quick data entry
    document.getElementById('student-name').focus();
  }
}

/** Load a record's data into the form for editing */
function startEdit(id) {
  const rec = records.find(r => r.id === id);
  if (!rec) {
    showToast('Record not found.', 'error');
    return;
  }

  // Fill form fields
  document.getElementById('student-name').value = rec.name;
  document.getElementById('roll-number').value  = rec.roll;
  document.getElementById('date').value         = rec.date;
  document.getElementById('status').value       = rec.status;
  document.getElementById('edit-id').value      = rec.id;

  // Switch button label to "Save Changes"
  document.getElementById('add-btn-label').textContent = 'Save Changes';
  document.getElementById('cancel-edit-btn').classList.remove('hidden');

  // Scroll the form into view on mobile
  document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.getElementById('student-name').focus();
}

/** Cancel an in-progress edit and reset to add mode */
function cancelEdit() {
  resetForm();
  showToast('Edit cancelled.', 'info');
}

/* ══════════════════════════════════════════════════════
   8. Delete Record
══════════════════════════════════════════════════════ */

/** Delete a single attendance record by ID */
function deleteRecord(id) {
  const rec = records.find(r => r.id === id);
  if (!rec) return;

  // Simple confirm dialog before deleting
  if (!confirm(`Delete attendance record for ${rec.name} (${formatDate(rec.date)})?`)) return;

  records = records.filter(r => r.id !== id);
  saveToStorage();
  renderTable();
  showToast(`Record for ${rec.name} deleted.`, 'info');
}

/* ══════════════════════════════════════════════════════
   9. Search / Filter
══════════════════════════════════════════════════════ */

/** Handle live search input */
function handleSearch(e) {
  filterText = e.target.value;
  renderTable();
}

/* ══════════════════════════════════════════════════════
   10. Export CSV
══════════════════════════════════════════════════════ */

/**
 * Build and download a CSV file of all attendance records.
 * Uses a hidden <a> tag with a Blob URL trick — no libraries needed.
 */
function exportCSV() {
  if (records.length === 0) {
    showToast('No records to export.', 'error');
    return;
  }

  // CSV header row
  const headers = ['#', 'Student Name', 'Roll Number', 'Date', 'Status'];

  // Data rows
  const rows = records.map((rec, i) => [
    i + 1,
    `"${rec.name.replace(/"/g, '""')}"`,  // escape quotes inside names
    rec.roll,
    formatDate(rec.date),
    rec.status,
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  // Create a downloadable blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href     = url;
  a.download = `CloudAttend_${todayISO()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // free memory

  showToast(`Exported ${records.length} record(s) to CSV.`, 'success');
}

/* ══════════════════════════════════════════════════════
   11. Clear All Records
══════════════════════════════════════════════════════ */

/** Delete every attendance record after confirmation */
function clearAllRecords() {
  if (records.length === 0) {
    showToast('There are no records to clear.', 'info');
    return;
  }
  if (!confirm(`Are you sure you want to delete ALL ${records.length} attendance records? This cannot be undone.`)) return;

  records = [];
  saveToStorage();
  renderTable();
  showToast('All records cleared.', 'info');
}

/* ══════════════════════════════════════════════════════
   12. Dark / Light Theme
══════════════════════════════════════════════════════ */

/** Apply a theme ('light' or 'dark') and persist the choice */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('cloudattend_theme', theme);

  // Swap the icon shown on the toggle button
  const iconEl = document.getElementById('theme-icon');
  iconEl.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
  // Re-render Lucide icons so the new icon appears
  if (window.lucide) window.lucide.createIcons();
}

/** Toggle between light and dark mode */
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

/* ══════════════════════════════════════════════════════
   13. Initialisation
══════════════════════════════════════════════════════ */

/** Boot the application */
function init() {
  // 1. Restore saved theme (or default to light)
  const savedTheme = localStorage.getItem('cloudattend_theme') || 'light';
  applyTheme(savedTheme);

  // 2. Load data from localStorage
  loadFromStorage();

  // 3. Pre-fill today's date in the form
  document.getElementById('date').value = todayISO();

  // 4. Render initial table & stats
  renderTable();

  // 5. Wire up Lucide icon library
  if (window.lucide) window.lucide.createIcons();

  // 6. Attach event listeners
  document.getElementById('add-btn')
    .addEventListener('click', handleFormSubmit);

  document.getElementById('cancel-edit-btn')
    .addEventListener('click', cancelEdit);

  document.getElementById('search-input')
    .addEventListener('input', handleSearch);

  document.getElementById('export-btn')
    .addEventListener('click', exportCSV);

  document.getElementById('clear-all-btn')
    .addEventListener('click', clearAllRecords);

  document.getElementById('theme-toggle')
    .addEventListener('click', toggleTheme);

  // 7. Allow pressing Enter in any form input to submit
  ['student-name', 'roll-number', 'date'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleFormSubmit();
    });
  });
}

// Run init when the DOM is ready
document.addEventListener('DOMContentLoaded', init);
