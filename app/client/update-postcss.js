const fs = require('fs');
const path = require('path');

// Read the package.json file
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = require(packageJsonPath);

// Update resolutions for PostCSS
packageJson.resolutions = {
  ...packageJson.resolutions,
  'postcss': '^8.4.31'
};

// Write the updated package.json
fs.writeFileSync(
  packageJsonPath,
  JSON.stringify(packageJson, null, 2)
);

console.log('Added PostCSS resolution to package.json');
console.log('Please run: npm install && npm audit');
