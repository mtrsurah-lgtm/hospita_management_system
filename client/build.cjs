const fs = require('fs');
const { execSync } = require('child_process');

console.log('[Build] Starting Hospital Management System build process...');

if (fs.existsSync('client') && fs.existsSync('client/package.json')) {
  console.log('[Build] Detected root directory. Compiling client application...');
  execSync('cd client && npm install && npm run build', { stdio: 'inherit' });
  try {
    fs.cpSync('client/dist', 'dist', { recursive: true });
    console.log('[Build] Mirrored client/dist to root dist directory.');
  } catch (err) {
    console.warn('[Build] Mirror warning:', err.message);
  }
} else {
  console.log('[Build] Already inside client directory. Executing vite build...');
  execSync('npm run build', { stdio: 'inherit' });
}

console.log('[Build] Build completed successfully.');
