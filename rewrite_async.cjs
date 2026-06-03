const fs = require('fs');

let server = fs.readFileSync('server.ts', 'utf8');

// replace express routes
server = server.replace(/app\.(get|post|put|delete)\(\"([^\"]+)\",\s*(async\s*)?\(\s*(req,\s*res)\s*\)\s*=>\s*\{/g, 'app.$1("$2", async (req, res) => {');

// logSystemAction to async
server = server.replace(/const logSystemAction = \(/g, 'const logSystemAction = async (');
server = server.replace(/logSystemAction\(/g, 'await logSystemAction(');
server = server.replace(/await async \(/g, 'async ('); // correct const logSystemAction = async ( that might be double-replaced

// await saveDB
server = server.replace(/saveDB\(\)/g, 'await saveDB()');
server = server.replace(/await await/g, 'await');

fs.writeFileSync('server.ts', server);
console.log("Rewrote server.ts to use async routes, async logs, and await saveDB");
