const fs = require('fs');
const path = require('path');

// Read the package.json file
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = require(packageJsonPath);

// Add resolutions field if it doesn't exist
if (!packageJson.resolutions) {
  packageJson.resolutions = {};
}

// Add specific resolutions for vulnerable packages
packageJson.resolutions = {
  ...packageJson.resolutions,
  'nth-check': '^2.0.1',
  'css-select': '^4.1.3',
  'svgo': '^2.8.0',
  '@svgr/plugin-svgo': '^6.2.0',
  '@svgr/webpack': '^6.2.1',
  'resolve-url-loader': '^5.0.0'
};

// Add preinstall script to enforce resolutions
if (!packageJson.scripts.preinstall) {
  packageJson.scripts.preinstall = "npx npm-force-resolutions";
}

// Write the updated package.json
fs.writeFileSync(
  packageJsonPath,
  JSON.stringify(packageJson, null, 2)
);

console.log('Added resolutions to package.json to fix vulnerabilities');
console.log('Please run the following commands:');
console.log('1. npm install -g npm-force-resolutions');
console.log('2. npm install');
console.log('3. npm audit to verify the fixes');
