const API_BASE = '/api';
let token = localStorage.getItem('vps_token');
let user = null;

// State
const state = {
    view: 'overview', // overview, users, notes, tasks, files
    data: {
        stats: { users: 0, notes: 0, tasks: 0, files: 0 },
        users: [],
        notes: [],
        tasks: [],
        files: []
    }
};

// DOM Elements
const app = document.getElementById('app');
const authScreen = document.getElementById('auth-screen');
const dashboardScreen = document.getElementById('dashboard-screen');

// Init
function init() {
    if (token) {
        showDashboard();
        fetchInitialData();
    } else {
        showAuth();
    }
    setupNavigation();
}

// Navigation
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(el => {
        el.addEventListener('click', (e) => {
            const view = e.target.dataset.view;
            if (view === 'logout') return logout();
            switchView(view);
        });
    });
}

function switchView(view) {
    state.view = view;
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.view === view);
    });
    renderMainContent();
}

// Auth Logic
async function login(email, password) {
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.token) {
            token = data.token;
            localStorage.setItem('vps_token', token);
            showDashboard();
            fetchInitialData();
        } else {
            alert(data.msg || 'Login failed');
        }
    } catch (e) {
        console.error(e);
        alert('Login error');
    }
}

function logout() {
    token = null;
    localStorage.removeItem('vps_token');
    showAuth();
}

// UI Toggling
function showAuth() {
    authScreen.classList.remove('hidden');
    dashboardScreen.classList.add('hidden');
}

function showDashboard() {
    authScreen.classList.add('hidden');
    dashboardScreen.classList.remove('hidden');
    renderMainContent();
}

// Data Fetching
async function fetchInitialData() {
    await Promise.all([
        fetchStats(),
        fetchUsers(),
        fetchNotes(),
        fetchTasks(),
        fetchFiles()
    ]);
    renderMainContent();
}

async function authenticatedFetch(endpoint, options = {}) {
    const headers = {
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    if (res.status === 401) {
        logout();
        return null;
    }
    if (res.status === 403) {
        alert('Access Denied: Admin privileges required.');
        return null;
    }
    if (res.status === 204) return true;

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('API Error:', err);
        return null;
    }

    return res.json();
}

async function fetchStats() {
    const data = await authenticatedFetch('/admin/stats');
    return state.data.stats = data || { users: 0, notes: 0, tasks: 0, files: 0 };
}

async function fetchUsers() {
    const data = await authenticatedFetch('/admin/users');
    return state.data.users = Array.isArray(data) ? data : [];
}

async function fetchNotes() {
    const data = await authenticatedFetch('/admin/notes');
    return state.data.notes = Array.isArray(data) ? data : [];
}

async function fetchTasks() {
    const data = await authenticatedFetch('/admin/tasks');
    return state.data.tasks = Array.isArray(data) ? data : [];
}

async function fetchFiles() {
    const data = await authenticatedFetch('/admin/files');
    return state.data.files = Array.isArray(data) ? data : [];
}

// Rendering
function renderMainContent() {
    const content = document.getElementById('main-content-area');
    content.innerHTML = '';

    switch (state.view) {
        case 'overview': renderOverview(content); break;
        case 'users': renderUsers(content); break;
        case 'notes': renderNotes(content); break;
        case 'tasks': renderTasks(content); break;
        case 'files': renderFiles(content); break;
    }
}

function renderOverview(container) {
    container.innerHTML = `
        <div class="header">
            <h1 class="page-title">Dashboard Overview</h1>
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Total Users</div>
                <div class="stat-value">${state.data.stats.users}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Notes</div>
                <div class="stat-value">${state.data.stats.notes}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Tasks</div>
                <div class="stat-value">${state.data.stats.tasks}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Files Stored</div>
                <div class="stat-value">${state.data.stats.files}</div>
            </div>
        </div>
    `;
}

function renderUsers(container) {
    const html = `
        <div class="header">
            <h1 class="page-title">Users</h1>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.data.users.map(u => `
                        <tr>
                            <td style="font-weight:500">${u.fullName || 'N/A'}</td>
                            <td>${u.email}</td>
                            <td><span class="badge ${u.role === 'admin' ? 'badge-blue' : 'badge-gray'}">${u.role || 'standard'}</span></td>
                            <td>${new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                    ${state.data.users.length === 0 ? '<tr><td colspan="4" style="text-align:center; padding: 2rem; color: var(--text-muted)">No users found</td></tr>' : ''}
                </tbody>
            </table>
        </div>
    `;
    container.innerHTML = html;
}

function renderNotes(container) {
    const html = `
        <div class="header">
            <h1 class="page-title">Notes</h1>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Owner</th>
                        <th>Preview</th>
                        <th>Tags</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.data.notes.map(note => `
                        <tr>
                            <td style="font-weight:500">${note.title || 'Untitled'}</td>
                            <td>${note.userId ? note.userId.fullName : 'N/A'}</td>
                            <td style="color:var(--text-muted);">${(note.content || '').substring(0, 50)}...</td>
                            <td>${(note.tags || []).map(t => `<span class="badge badge-blue">${t}</span>`).join(' ')}</td>
                            <td>
                                <button class="btn btn-secondary" style="padding:0.25rem 0.5rem" onclick="deleteNote('${note._id}')">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                    ${state.data.notes.length === 0 ? '<tr><td colspan="4" style="text-align:center; padding: 2rem; color: var(--text-muted)">No notes found</td></tr>' : ''}
                </tbody>
            </table>
        </div>
    `;
    container.innerHTML = html;
}

function renderTasks(container) {
    const html = `
        <div class="header">
            <h1 class="page-title">Tasks</h1>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.data.tasks.map(task => `
                        <tr>
                            <td style="font-weight:500">${task.title}</td>
                            <td>${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                            <td>
                                <span class="badge ${task.completed ? 'badge-green' : 'badge-red'}">
                                    ${task.completed ? 'Completed' : 'Pending'}
                                </span>
                            </td>
                            <td>
                                <button class="btn btn-secondary" style="padding:0.25rem 0.5rem" onclick="toggleTask('${task._id}')">Toggle</button>
                                <button class="btn btn-secondary" style="padding:0.25rem 0.5rem" onclick="deleteTask('${task._id}')">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                    ${state.data.tasks.length === 0 ? '<tr><td colspan="4" style="text-align:center; padding: 2rem; color: var(--text-muted)">No tasks found</td></tr>' : ''}
                </tbody>
            </table>
        </div>
    `;
    container.innerHTML = html;
}

function renderFiles(container) {
    const html = `
        <div class="header">
            <h1 class="page-title">Files</h1>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Filename</th>
                        <th>Owner</th>
                        <th>Size</th>
                        <th>Uploaded</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.data.files.map(file => `
                        <tr>
                            <td style="font-weight:500">${file.originalName || file.filename}</td>
                            <td>${file.userId ? file.userId.fullName : 'N/A'}</td>
                            <td>${(file.size / 1024).toFixed(1)} KB</td>
                            <td>${new Date(file.uploadedAt).toLocaleDateString()}</td>
                            <td>
                                <button class="btn btn-danger" style="padding:0.25rem 0.5rem" onclick="deleteFile('${file._id}')">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                    ${state.data.files.length === 0 ? '<tr><td colspan="5" style="text-align:center; padding: 2rem; color: var(--text-muted)">No files uploaded</td></tr>' : ''}
                </tbody>
            </table>
        </div>
    `;
    container.innerHTML = html;
}

// Actions
async function promptCreateNote() {
    const title = prompt('Note Title:');
    if (!title) return;
    const content = prompt('Note Content:');
    await authenticatedFetch('/notes', {
        method: 'POST',
        body: JSON.stringify({ title, content })
    });
    fetchNotes().then(renderMainContent);
}

async function deleteNote(id) {
    if (!confirm('Delete this note?')) return;
    await authenticatedFetch(`/notes/${id}`, { method: 'DELETE' });
    fetchNotes().then(renderMainContent);
}

async function promptCreateTask() {
    const title = prompt('Task Title:');
    if (!title) return;
    await authenticatedFetch('/tasks', {
        method: 'POST',
        body: JSON.stringify({ title, dueDate: new Date() })
    });
    fetchTasks().then(renderMainContent);
}

async function toggleTask(id) {
    await authenticatedFetch(`/tasks/${id}/complete`, { method: 'PATCH' });
    fetchTasks().then(renderMainContent);
}

async function deleteTask(id) {
    if (!confirm('Delete this task?')) return;
    await authenticatedFetch(`/tasks/${id}`, { method: 'DELETE' });
    fetchTasks().then(renderMainContent);
}

async function handleUpload(input) {
    if (input.files && input.files[0]) {
        const formData = new FormData();
        formData.append('file', input.files[0]);
        await authenticatedFetch('/files', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }, // specific header for multipart
            body: formData
        });
        fetchFiles().then(renderMainContent);
    }
}

async function deleteFile(id) {
    if (!confirm('Delete this file?')) return;
    await authenticatedFetch(`/files/${id}`, { method: 'DELETE' });
    fetchFiles().then(renderMainContent);
}

async function downloadFile(id, filename) {
    const res = await fetch(`${API_BASE}/files/${id}/download`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
    } else {
        alert('Download failed');
    }
}

// Event Listeners for Auth
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    login(email, pass);
});

// Run
init();
