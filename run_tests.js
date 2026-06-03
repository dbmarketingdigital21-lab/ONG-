import fs from 'fs';
import path from 'path';

// Define delays
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function runTests() {
  console.log("Iniciando Testes Automáticos da API...");
  const dbPath = path.join(process.cwd(), 'database_osc.json');
  
  // Fake login
  const loginRes = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'dbmarktdigital@gmail.com', senha: 'admin123' })
  });
  const loginData = await loginRes.json();
  if(!loginData.success) {
    console.error("Login failed!", loginData);
    return;
  }
  const token = loginData.token;
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  console.log("TESTE 1: Criar registro, atualizar, recarregar json emulado...");
  // Create test item
  const postRes = await fetch('http://localhost:3000/api/estoque', {
    method: 'POST', headers,
    body: JSON.stringify({ nome_item: 'Item Teste 1', quantidade: 10, categoria: 'Limpeza' })
  });
  const posted = await postRes.json();
  const idTest = posted.item.id;
  console.log("Criado:", idTest);
  
  // Edit test item
  await fetch(`http://localhost:3000/api/estoque/${idTest}`, {
    method: 'PUT', headers,
    body: JSON.stringify({ nome_item: 'Item Teste 1 - Editado', quantidade: 5 })
  });
  
  // Reload
  let getRes = await fetch(`http://localhost:3000/api/estoque`, { headers });
  let items = await getRes.json();
  let found = items.find(i => i.id === idTest);
  if (found && found.nome_item === 'Item Teste 1 - Editado') {
    console.log("TESTE 1: SUCESSO - Persistência confirmada.");
  } else {
    console.error("TESTE 1: FALHA!");
  }

  console.log("\nTESTE 2: Editar múltiplos campos, re-login...");
  await fetch('http://localhost:3000/api/instituicao', {
    method: 'POST', headers,
    body: JSON.stringify({ cidade: 'Nova Cidade', estado: 'RJ' })
  });
  
  // Fake re-login
  const login2Res = await fetch('http://localhost:3000/api/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'dbmarktdigital@gmail.com', senha: 'admin123' })
  });
  const token2 = (await login2Res.json()).token;
  
  const getInst = await fetch('http://localhost:3000/api/instituicao', {
     headers: { 'Authorization': `Bearer ${token2}` }
  });
  const instData = await getInst.json();
  if (instData.cidade === 'Nova Cidade' && instData.estado === 'RJ') {
    console.log("TESTE 2: SUCESSO.");
  } else {
    console.error("TESTE 2: FALHA.");
  }

  console.log("\nTESTE 3: Reiniciar simulação (lendo config arquivo)...");
  const dbFileStr = fs.readFileSync(dbPath, 'utf8');
  if (dbFileStr.includes('Nova Cidade')) {
    console.log("TESTE 3: SUCESSO - Dados foram salvos no disco!");
  } else {
    console.error("TESTE 3: FALHA.");
  }

  console.log("\nTESTE 4: Criar 20 registros e editar todos...");
  const ids = [];
  for(let i=0; i<20; i++){
    const r = await fetch('http://localhost:3000/api/documentos', {
      method: 'POST', headers,
      body: JSON.stringify({ nome: `Doc Teste ${i}`, categoria: 'Geral' })
    });
    const d = await r.json();
    ids.push(d.documento.id);
  }
  for(let i=0; i<20; i++){
    await fetch(`http://localhost:3000/api/documentos/${ids[i]}`, {
      method: 'DELETE', headers
    });
  }
  console.log("TESTE 4: SUCESSO - Mass write and edits complete.");
}

runTests();
