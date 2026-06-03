const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

// The lines 15 and 16 represent the imports I added. Or 7 and 8. Let's just remove the first ones.
server = server.replace(/import fs from 'fs';\n/, '');
server = server.replace(/import path from 'path';\n/, '');

fs.writeFileSync('server.ts', server);
