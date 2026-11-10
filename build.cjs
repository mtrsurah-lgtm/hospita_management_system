const fs = require('fs');
const { execSync } = require('child_process');

console.log('[Build] Starting Hospital Management System build process...');

const run = (cmd) => {
  console.log(`[Build] Executing: ${cmd}`);
  execSync(cmd, { stdio: 'inherit', env: { ...process.env, NODE_ENV: 'development' } });
};

try {
  if (fs.existsSync('client') && fs.existsSync('client/package.json')) {
    console.log('[Build] Detected root directory. Compiling client application...');
    run('cd client && npm install --include=dev && npm run build');
    try {
      fs.cpSync('client/dist', 'dist', { recursive: true });
      console.log('[Build] Mirrored client/dist to root dist directory.');
    } catch (err) {
      console.warn('[Build] Mirror warning:', err.message);
    }
  } else {
    console.log('[Build] Already inside client directory. Executing build...');
    run('npm install --include=dev && npm run build');
  }
  console.log('[Build] Build completed successfully.');
} catch (error) {
  console.error('[Build Error]:', error.message);
  process.exit(1);
}
