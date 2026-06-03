const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

server = server.replace(
  'const dbFirestore = getFirestore(firebaseApp);',
  'const dbFirestore = getFirestore(firebaseApp, firebaseConfigParams.firestoreDatabaseId);'
);

fs.writeFileSync('server.ts', server);
