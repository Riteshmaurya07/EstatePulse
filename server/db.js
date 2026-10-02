import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const REQUESTS_FILE = path.join(DATA_DIR, 'accessRequests.json');
const TOGGLES_FILE = path.join(DATA_DIR, 'sampleToggles.json');
const API_KEYS_FILE = path.join(DATA_DIR, 'apiKeys.json');
const PROJECTS_FILE = path.join(__dirname, '..', 'src', 'data', 'initialData.json');

// Read JSON helper
export function readJSON(filePath, defaultData = []) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultData;
  }
}

// Write JSON helper
export function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Initialize Database Seed
export function initDB() {
  let users = readJSON(USERS_FILE, []);
  let requests = readJSON(REQUESTS_FILE, []);
  let toggles = readJSON(TOGGLES_FILE, []);

  // Ensure Admin user exists
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@estatepulse.b2b';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123password';

  let admin = users.find(u => u.email.toLowerCase() === adminEmail.toLowerCase());
  if (!admin) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(adminPassword, salt);
    
    admin = {
      id: 'USR-001',
      name: 'System Admin',
      email: adminEmail,
      password: hashedPassword,
      company: 'EstatePulse B2B Intelligence',
      phone: '+91 98765 43210',
      role: 'admin',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    users.push(admin);
  }

  // Ensure Demo Approved Client exists
  let approvedClient = users.find(u => u.email === 'client@realestate.com');
  if (!approvedClient) {
    const salt = bcrypt.genSaltSync(10);
    approvedClient = {
      id: 'USR-002',
      name: 'Vikram Sharma (Approved B2B Client)',
      email: 'client@realestate.com',
      password: bcrypt.hashSync('client123password', salt),
      company: 'Apex Infrastructure Pvt Ltd',
      phone: '+91 99887 76655',
      role: 'approved_user',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    users.push(approvedClient);
  }

  // Ensure Demo Registered Pending User exists
  let pendingUser = users.find(u => u.email === 'user@investor.com');
  if (!pendingUser) {
    const salt = bcrypt.genSaltSync(10);
    pendingUser = {
      id: 'USR-003',
      name: 'Ananya Roy (Registered User)',
      email: 'user@investor.com',
      password: bcrypt.hashSync('user123password', salt),
      company: 'Roy Global Procurement',
      phone: '+91 91234 56789',
      role: 'registered_user',
      status: 'pending_approval',
      createdAt: new Date().toISOString()
    };
    users.push(pendingUser);

    // Add access request for pending user
    requests.push({
      id: 'REQ-001',
      userId: 'USR-003',
      userName: 'Ananya Roy',
      userEmail: 'user@investor.com',
      company: 'Roy Global Procurement',
      phone: '+91 91234 56789',
      reason: 'We require full contact details for purchasing sanitary fittings & MEP equipment.',
      status: 'pending',
      requestedAt: new Date().toISOString()
    });
  }

  // Initialize Sample Projects Contact Toggles (For 10 sample projects)
  const initialProjects = readJSON(PROJECTS_FILE, []);
  const sampleProjects = initialProjects.slice(0, 10);

  sampleProjects.forEach(proj => {
    const existingToggle = toggles.find(t => t.projectId === proj.id);
    if (!existingToggle) {
      toggles.push({
        projectId: proj.id,
        projectName: proj.projectName,
        developerName: proj.developerName,
        showContactDetails: proj.id === 'PRJ-001' // Pre-enable contact for 1 sample project so clients can verify
      });
    }
  });

  writeJSON(USERS_FILE, users);
  writeJSON(REQUESTS_FILE, requests);
  writeJSON(TOGGLES_FILE, toggles);

  console.log('Database initialized successfully with default Admin, Approved Client, and Sample Toggles.');
}

export { USERS_FILE, REQUESTS_FILE, TOGGLES_FILE, API_KEYS_FILE, PROJECTS_FILE };
