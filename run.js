const uuid = require('uuid');

// Generate a UUID (version 4)
const generatedUUID = uuid.v4();

// Remove hyphens and take the first 10 digits
const accountNumber = '05' + generatedUUID.replace(/-/g, '').slice(0, 8);

console.log(accountNumber);
