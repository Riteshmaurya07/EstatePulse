import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { readJSON, API_KEYS_FILE, USERS_FILE } from '../db.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'estate_pulse_b2b_super_secret_jwt_key_2026_production';

// Helper to check API Key
function checkApiKey(apiKeyHeader) {
  if (!apiKeyHeader) return null;
  const apiKeys = readJSON(API_KEYS_FILE, []);
  const keyEntry = apiKeys.find(k => k.apiKey === apiKeyHeader && k.status === 'active');

  if (!keyEntry) return null;

  const users = readJSON(USERS_FILE, []);
  const user = users.find(u => u.id === keyEntry.userId);
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
    isApiKey: true,
    keyName: keyEntry.name
  };
}

// Extract token or API Key from Header
export function authenticateTokenOptional(req, res, next) {
  // 1. Check X-API-KEY header
  const apiKeyHeader = req.headers['x-api-key'];
  if (apiKeyHeader) {
    const userFromKey = checkApiKey(apiKeyHeader);
    if (userFromKey) {
      req.user = userFromKey;
      return next();
    }
  }

  // 2. Check Authorization Bearer Token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  });
}

export function requireAuth(req, res, next) {
  // 1. Check X-API-KEY header
  const apiKeyHeader = req.headers['x-api-key'];
  if (apiKeyHeader) {
    const userFromKey = checkApiKey(apiKeyHeader);
    if (userFromKey) {
      req.user = userFromKey;
      return next();
    } else {
      return res.status(401).json({ error: 'Invalid or revoked B2B API Key.' });
    }
  }

  // 2. Check Authorization Bearer Token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please login or provide a valid X-API-KEY header.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token. Please login again.' });
    }
    req.user = user;
    next();
  });
}

export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    let currentRole = req.user.role;

    if (req.user.id || req.user.email) {
      const users = readJSON(USERS_FILE, []);
      const dbUser = users.find(u => (req.user.id && u.id === req.user.id) || (req.user.email && u.email.toLowerCase() === req.user.email.toLowerCase()));
      if (dbUser) {
        currentRole = dbUser.role;
        req.user.role = dbUser.role;
        req.user.status = dbUser.status;
      }
    }

    if (!allowedRoles.includes(currentRole)) {
      return res.status(403).json({ error: `Access denied. Insufficient permissions. Role required: ${allowedRoles.join(', ')} (Your role: ${currentRole})` });
    }

    next();
  };
}

export { JWT_SECRET };
