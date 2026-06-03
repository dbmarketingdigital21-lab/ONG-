const fs = require('fs');
const files = [
  'src/App.tsx',
  'src/components/Financeiro.tsx',
  'src/components/ContasBancarias.tsx',
  'src/components/Instituicao.tsx',
  'src/components/Sidebar.tsx',
  'server.ts',
  'database_osc.json',
  'index.html'
];
files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/Associação Viva o Amanhã(?: - AVA)?/g, 'ONG Chico Xavier');
    content = content.replace(/Viva o Amanhã/g, 'ONG Chico Xavier');
    content = content.replace(/vivaamanha/g, 'chicoxavier');
    fs.writeFileSync(file, content);
  }
});
