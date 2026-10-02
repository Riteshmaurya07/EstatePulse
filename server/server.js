import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { 
  initDB, 
  readJSON, 
  writeJSON, 
  USERS_FILE, 
  REQUESTS_FILE, 
  TOGGLES_FILE, 
  API_KEYS_FILE,
  PROJECTS_FILE 
} from './db.js';
import { 
  authenticateTokenOptional, 
  requireAuth, 
  requireRole, 
  JWT_SECRET 
} from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database Stores
initDB();

// Root API Health Check Endpoint
app.get(['/', '/api'], (req, res) => {
  res.json({
    status: 'online',
    message: 'EstatePulse B2B Real Estate Intelligence REST API Server is Running',
    version: '2.0.0',
    endpoints: {
      auth: ['POST /api/auth/register', 'POST /api/auth/verify-otp', 'POST /api/auth/login', 'POST /api/auth/admin-login', 'GET /api/auth/me'],
      projects: ['GET /api/projects (Supports X-API-KEY header)'],
      developer: ['GET /api/developer/api-keys', 'POST /api/developer/api-keys', 'DELETE /api/developer/api-keys/:id'],
      requests: ['POST /api/requests/access', 'GET /api/requests/my'],
      admin: ['GET /api/admin/dashboard', 'GET /api/admin/users', 'PUT /api/admin/users/:id', 'GET /api/admin/requests', 'PUT /api/admin/requests/:id', 'GET /api/admin/sample-toggles', 'PUT /api/admin/sample-toggles/:projectId']
    }
  });
});

// ==========================================
// 1. AUTHENTICATION & EMAIL OTP ENDPOINTS
// ==========================================

// Step 1: Register User (Sends 6-Digit Email Verification Code)
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, company, phone, reason } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const users = readJSON(USERS_FILE, []);
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    return res.status(400).json({ error: 'An account with this email address already exists.' });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const userId = `USR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Generate 6-Digit OTP Code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  const newUser = {
    id: userId,
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    company: company || 'Independent',
    phone: phone || '',
    reason: reason || 'B2B Real Estate Data Access',
    role: 'registered_user',
    status: 'pending_approval',
    isEmailVerified: false,
    otpCode: otpCode,
    otpExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 mins
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeJSON(USERS_FILE, users);

  res.status(201).json({
    message: `Account created! We have sent a 6-digit verification code to ${email}.`,
    email: newUser.email,
    requiresOtp: true,
    // Returned preview for easy demo testing
    otpPreview: otpCode
  });
});

// Step 2: Verify 6-Digit Email OTP Code
app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and 6-digit verification code are required.' });
  }

  const users = readJSON(USERS_FILE, []);
  const userIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

  if (userIdx === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const user = users[userIdx];

  if (user.isEmailVerified) {
    return res.status(400).json({ error: 'Email address is already verified.' });
  }

  if (user.otpCode !== String(otp).trim()) {
    return res.status(400).json({ error: 'Invalid 6-digit verification code. Please check and try again.' });
  }

  // Mark Email as Verified
  users[userIdx].isEmailVerified = true;
  users[userIdx].otpCode = null;
  writeJSON(USERS_FILE, users);

  // Automatically Log B2B Access Request for Admin Review
  const requests = readJSON(REQUESTS_FILE, []);
  const existingReq = requests.find(r => r.userId === user.id);
  if (!existingReq) {
    requests.push({
      id: `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      company: user.company,
      phone: user.phone,
      reason: user.reason || 'Requested full project & procurement access upon registration',
      status: 'pending',
      requestedAt: new Date().toISOString()
    });
    writeJSON(REQUESTS_FILE, requests);
  }

  // Issue Token
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role, status: user.status },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, otpCode: __, ...userWithoutPassword } = users[userIdx];

  res.json({
    message: 'Email address verified successfully! Your B2B access request has been submitted for Admin approval.',
    token,
    user: userWithoutPassword
  });
});

// Step 3: Resend OTP Code
app.post('/api/auth/resend-otp', (req, res) => {
  const { email } = req.body;
  const users = readJSON(USERS_FILE, []);
  const userIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

  if (userIdx === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
  users[userIdx].otpCode = newOtp;
  users[userIdx].otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  writeJSON(USERS_FILE, users);

  res.json({
    message: `New verification code sent to ${email}`,
    otpPreview: newOtp
  });
});

// Standard Client Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const users = readJSON(USERS_FILE, []);
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Ensure Admin login goes through Secret Admin Route
  if (user.role === 'admin') {
    return res.status(403).json({ error: 'Admin accounts must sign in through the Secret Admin Portal.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role, status: user.status },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, otpCode: __, ...userWithoutPassword } = user;

  res.json({
    message: 'Login successful!',
    token,
    user: userWithoutPassword
  });
});

// SECRET ADMIN DIRECT PORTAL LOGIN
app.post('/api/auth/admin-login', (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@estatepulse.b2b';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123password';

  const users = readJSON(USERS_FILE, []);
  const adminUser = users.find(u => u.role === 'admin' && u.email.toLowerCase() === email.toLowerCase());

  if (!adminUser) {
    return res.status(401).json({ error: 'Invalid Admin credentials.' });
  }

  const isMatch = bcrypt.compareSync(password, adminUser.password) || (email === adminEmail && password === adminPassword);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid Admin credentials.' });
  }

  const token = jwt.sign(
    { id: adminUser.id, email: adminUser.email, name: adminUser.name, role: 'admin', status: 'active' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...adminWithoutPassword } = adminUser;

  res.json({
    message: 'Welcome to EstatePulse B2B Secret Admin Portal',
    token,
    user: adminWithoutPassword
  });
});

// Get Current User Profile
app.get('/api/auth/me', requireAuth, (req, res) => {
  const users = readJSON(USERS_FILE, []);
  const user = users.find(u => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User profile not found.' });
  }

  const { password: _, otpCode: __, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

// ==========================================
// 2. DEVELOPER B2B API KEY MANAGEMENT
// ==========================================

// Generate New B2B API Key (For Approved Users & Admins)
app.post('/api/developer/api-keys', requireAuth, requireRole(['approved_user', 'admin']), (req, res) => {
  const { name, scopes } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'API Key name is required.' });
  }

  const apiKeys = readJSON(API_KEYS_FILE, []);
  
  // Generate random 32-byte hex key: ep_live_...
  const randomHex = crypto.randomBytes(16).toString('hex');
  const apiKey = `ep_live_${randomHex}`;

  const newKey = {
    id: `KEY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId: req.user.id,
    userEmail: req.user.email,
    name,
    apiKey,
    scopes: scopes || ['read:projects', 'read:procurement'],
    status: 'active',
    createdAt: new Date().toISOString(),
    lastUsedAt: 'Never'
  };

  apiKeys.push(newKey);
  writeJSON(API_KEYS_FILE, apiKeys);

  res.status(201).json({
    message: 'B2B API Key generated successfully! Keep this key secure.',
    apiKey: newKey
  });
});

// Get Active API Keys
app.get('/api/developer/api-keys', requireAuth, (req, res) => {
  const apiKeys = readJSON(API_KEYS_FILE, []);
  const myKeys = apiKeys.filter(k => k.userId === req.user.id);
  res.json({ apiKeys: myKeys });
});

// Revoke API Key
app.delete('/api/developer/api-keys/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  let apiKeys = readJSON(API_KEYS_FILE, []);
  
  const keyIdx = apiKeys.findIndex(k => k.id === id && k.userId === req.user.id);
  if (keyIdx === -1) {
    return res.status(404).json({ error: 'API Key not found.' });
  }

  apiKeys[keyIdx].status = 'revoked';
  writeJSON(API_KEYS_FILE, apiKeys);

  res.json({ message: 'API Key revoked successfully.' });
});

// ==========================================
// 3. PROTECTED REAL ESTATE DATA ENDPOINTS
// ==========================================

// Get Real Estate Projects (Supports X-API-KEY header and JWT tokens)
app.get('/api/projects', authenticateTokenOptional, (req, res) => {
  const allProjects = readJSON(PROJECTS_FILE, []);
  const toggles = readJSON(TOGGLES_FILE, []);

  // Determine user authorization dynamically from DB store
  let isApproved = false;

  if (req.user) {
    if (req.user.isApiKey) {
      isApproved = true; // API Key header valid
    } else if (req.user.id || req.user.email) {
      const users = readJSON(USERS_FILE, []);
      const currentUser = users.find(u => (req.user.id && u.id === req.user.id) || (req.user.email && u.email.toLowerCase() === req.user.email.toLowerCase()));
      if (currentUser) {
        isApproved = currentUser.role === 'admin' || (currentUser.role === 'approved_user' && currentUser.status === 'active');
      }
    }
  }

  if (isApproved) {
    // Approved B2B Clients & Admins get FULL UNFILTERED DATA across all 27 projects
    return res.json({
      accessLevel: 'full',
      isApproved: true,
      totalCount: allProjects.length,
      projects: allProjects
    });
  }

  // Non-approved / Unauthenticated users get 10 Sample Projects with protected contacts
  const sampleProjectIds = new Set(allProjects.slice(0, 10).map(p => p.id));

  const sanitizedProjects = allProjects.map((project, index) => {
    const isSample = sampleProjectIds.has(project.id) || index < 10;
    const projectToggle = toggles.find(t => t.projectId === project.id);
    const allowContacts = projectToggle ? projectToggle.showContactDetails : false;

    if (isSample) {
      if (allowContacts) {
        return {
          ...project,
          isSample: true,
          contactProtected: false,
          adminContactOverride: true
        };
      } else {
        return {
          ...project,
          isSample: true,
          contactProtected: true,
          builderContactDetails: '🔒 Contact details protected - Request B2B Access',
          builderEmail: '🔒 Hidden (Request Access)',
          procurementContact: '🔒 Phone Hidden (Request Access)',
          procurementInfo: project.procurementInfo ? project.procurementInfo.replace(/[\w\.-]+@[\w\.-]+/, '🔒 email hidden') : '🔒 Procurement Details Protected',
          siteManagerContact: project.siteManagerContact ? '🔒 Phone Hidden' : '',
          mepContact: project.mepContact ? '🔒 Phone Hidden' : ''
        };
      }
    } else {
      return {
        id: project.id,
        pmid: project.pmid,
        developerName: project.developerName,
        projectName: project.projectName,
        micromarket: project.micromarket,
        segment: project.segment,
        launchedSqft: project.launchedSqft,
        launchedUnits: project.launchedUnits,
        unitsAbsorbed: project.unitsAbsorbed,
        percentSold: project.percentSold,
        bspInrSqftRange: project.bspInrSqftRange,
        constructionStatus: project.constructionStatus,
        isSample: false,
        contactProtected: true,
        isLocked: true,
        builderContactDetails: '🔒 Locked - Upgrade to B2B Approved Client',
        builderEmail: '🔒 Locked',
        procurementContact: '🔒 Locked',
        procurementInfo: '🔒 Locked',
        siteManagerName: '🔒 Locked',
        siteManagerContact: '🔒 Locked',
        mepConsultant: '🔒 Locked',
        mepContact: '🔒 Locked',
        architectDetails: '🔒 Locked',
        sanitaryBrands: project.sanitaryBrands,
        modularKitchen: project.modularKitchen,
        buildingStructure: project.buildingStructure,
        siteAddress: project.siteAddress,
        reraNo: project.reraNo,
        latitude: project.latitude,
        longitude: project.longitude
      };
    }
  });

  return res.json({
    accessLevel: 'sample',
    isApproved: false,
    totalCount: allProjects.length,
    sampleCount: 10,
    projects: sanitizedProjects
  });
});

// Submit Access Request
app.post('/api/requests/access', requireAuth, (req, res) => {
  const { reason, company, phone } = req.body;
  const requests = readJSON(REQUESTS_FILE, []);

  const existingReq = requests.find(r => r.userId === req.user.id && r.status === 'pending');
  if (existingReq) {
    return res.status(400).json({ 
      error: 'You already have a pending access request under review by the Admin.',
      request: existingReq 
    });
  }

  const newRequest = {
    id: `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId: req.user.id,
    userName: req.user.name,
    userEmail: req.user.email,
    company: company || req.user.company || 'N/A',
    phone: phone || req.user.phone || 'N/A',
    reason: reason || 'Requested full project & procurement access',
    status: 'pending',
    requestedAt: new Date().toISOString()
  };

  requests.push(newRequest);
  writeJSON(REQUESTS_FILE, requests);

  res.status(201).json({
    message: 'Access request submitted successfully! An Admin will review your request.',
    request: newRequest
  });
});

// Get My Access Request
app.get('/api/requests/my', requireAuth, (req, res) => {
  const requests = readJSON(REQUESTS_FILE, []);
  const myRequest = requests.find(r => r.userId === req.user.id);
  res.json({ request: myRequest || null });
});

// ==========================================
// 4. ADMIN CONTROL PANEL API ENDPOINTS
// ==========================================

// Admin Dashboard Summary
app.get('/api/admin/dashboard', requireAuth, requireRole(['admin']), (req, res) => {
  const users = readJSON(USERS_FILE, []);
  const requests = readJSON(REQUESTS_FILE, []);
  const toggles = readJSON(TOGGLES_FILE, []);
  const allProjects = readJSON(PROJECTS_FILE, []);

  const totalUsers = users.length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const approvedUsers = users.filter(u => u.role === 'approved_user' && u.status === 'active').length;
  const sampleProjects = allProjects.slice(0, 10);

  res.json({
    totalUsers,
    pendingRequests,
    approvedUsers,
    sampleProjectsCount: sampleProjects.length,
    toggles
  });
});

// Admin Get Users
app.get('/api/admin/users', requireAuth, requireRole(['admin']), (req, res) => {
  const users = readJSON(USERS_FILE, []);
  const safeUsers = users.map(({ password, otpCode, ...u }) => u);
  res.json({ users: safeUsers });
});

// Admin Update User Role / Status
app.put('/api/admin/users/:id', requireAuth, requireRole(['admin']), (req, res) => {
  const { id } = req.params;
  const { role, status } = req.body;

  const users = readJSON(USERS_FILE, []);
  const userIdx = users.findIndex(u => u.id === id);

  if (userIdx === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (role) users[userIdx].role = role;
  if (status) users[userIdx].status = status;

  writeJSON(USERS_FILE, users);

  const { password: _, otpCode: __, ...updatedUser } = users[userIdx];
  res.json({ message: 'User updated successfully.', user: updatedUser });
});

// Admin Get Access Requests
app.get('/api/admin/requests', requireAuth, requireRole(['admin']), (req, res) => {
  const requests = readJSON(REQUESTS_FILE, []);
  res.json({ requests });
});

// Admin Approve / Reject Access Request
app.put('/api/admin/requests/:id', requireAuth, requireRole(['admin']), (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status must be approved or rejected.' });
  }

  const requests = readJSON(REQUESTS_FILE, []);
  const reqIdx = requests.findIndex(r => r.id === id);

  if (reqIdx === -1) {
    return res.status(404).json({ error: 'Request not found.' });
  }

  requests[reqIdx].status = status;
  requests[reqIdx].updatedAt = new Date().toISOString();
  writeJSON(REQUESTS_FILE, requests);

  const users = readJSON(USERS_FILE, []);
  const userId = requests[reqIdx].userId;
  const userIdx = users.findIndex(u => u.id === userId);

  if (userIdx !== -1 && status === 'approved') {
    users[userIdx].role = 'approved_user';
    users[userIdx].status = 'active';
    writeJSON(USERS_FILE, users);
  }

  res.json({ 
    message: `Access request ${status} successfully!`, 
    request: requests[reqIdx] 
  });
});

// Admin Get Sample Projects Contact Toggles
app.get('/api/admin/sample-toggles', requireAuth, requireRole(['admin']), (req, res) => {
  const toggles = readJSON(TOGGLES_FILE, []);
  res.json({ toggles });
});

// Admin Toggle Contact Visibility for Sample Project
app.put('/api/admin/sample-toggles/:projectId', requireAuth, requireRole(['admin']), (req, res) => {
  const { projectId } = req.params;
  const { showContactDetails } = req.body;

  const toggles = readJSON(TOGGLES_FILE, []);
  const toggleIdx = toggles.findIndex(t => t.projectId === projectId);

  if (toggleIdx === -1) {
    const allProjects = readJSON(PROJECTS_FILE, []);
    const proj = allProjects.find(p => p.id === projectId);
    toggles.push({
      projectId,
      projectName: proj ? proj.projectName : projectId,
      developerName: proj ? proj.developerName : '',
      showContactDetails: Boolean(showContactDetails)
    });
  } else {
    toggles[toggleIdx].showContactDetails = Boolean(showContactDetails);
  }

  writeJSON(TOGGLES_FILE, toggles);
  res.json({ 
    message: `Contact details visibility for ${projectId} updated to ${showContactDetails}`, 
    toggles 
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Backend API Server v2.0 running on http://localhost:${PORT}`);
});
