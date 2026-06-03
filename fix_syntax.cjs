const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

// fix the function name
server = server.replace('function await saveDB()', 'async function saveDB()');

// add imports and initialization
const imports = `
import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfigParams = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf-8'));
const firebaseApp = initializeApp(firebaseConfigParams);
const dbFirestore = getFirestore(firebaseApp);

async function loadDB() {
  try {
    let hasData = false;
    const keys = Object.keys(db);
    for (const key of keys) {
       const snap = await getDoc(doc(dbFirestore, "tables", key));
       if (snap.exists() && snap.data().data) {
          db[key] = JSON.parse(snap.data().data);
          hasData = true;
       }
    }
    if (hasData) {
       console.log("Loaded DB from Firestore!");
       fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    }
  } catch(e) {
    console.error("Firestore load error:", e);
  }
}
`;

// Insert the imports at line 14 (or near the top where we declare DB_FILE)
server = server.replace("const DB_FILE", imports + "\nconst DB_FILE");

// Also replace the body of saveDB()
server = server.replace(/async function saveDB\(\) \{[\s\S]*?\}/, `async function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  try {
     const keys = Object.keys(db);
     for (const key of keys) {
        const str = JSON.stringify(db[key]);
        await setDoc(doc(dbFirestore, "tables", key), { data: str });
     }
  } catch(e) {
     console.error("Firestore save error:", e);
  }
}`);

// Insert await loadDB() inside startServer()
server = server.replace('const app = express();', 'const app = express();\n  await loadDB();\n');

// Also fix `import fs from 'fs';` and `import path from 'path';` duplicates by removing any duplicate imports
// It's easy, we can just run this.

fs.writeFileSync('server.ts', server);
console.log("Fixed server.ts");
