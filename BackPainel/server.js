const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Função para interpretar a saída da opção 2 (listar voos)
function parseVoos(text) {
  const lines = text.split('\n');
  const voos = [];
  let startParsing = false;

  for (let line of lines) {
    if (line.includes('VOO') && line.includes('COMPANHIA')) {
      startParsing = true;
      continue;
    }
    if (!startParsing || line.trim() === '' || line.includes('---')) continue;

    const voo = {
      voo: parseInt(line.slice(0, 5).trim()),
      companhia: line.slice(6, 18).trim(),
      destino: line.slice(18, 34).trim(),
      portao: line.slice(34, 42).trim(),
      hora: line.slice(42, 48).trim(),
      observacao: line.slice(48).trim(),
    };

    if (!isNaN(voo.voo)) {
      voos.push(voo);
    }
  }

  return voos;
}

// Rota GET para listar voos
app.get('/listar-voos', (req, res) => {
  const terminalPath = path.join(__dirname, 'painel.exe');
  const proc = spawn(terminalPath);

  let output = '';

  proc.stdout.on('data', (data) => {
    output += data.toString();
  });

  proc.stderr.on('data', (data) => {
    output += data.toString();
  });

  proc.on('error', (err) => {
    console.error('Erro ao executar painel.exe:', err.message);
    res.status(500).send({ erro: 'Erro ao executar painel.exe' });
  });

  proc.on('close', () => {
    const json = parseVoos(output);
    res.json(json);
  });

  // Envia opção 2 e 5 para listar voos e sair
  setTimeout(() => {
    proc.stdin.write('2\n');
    proc.stdin.write('5\n');
    proc.stdin.end();
  }, 500);
});

// Rota POST para cadastrar voo
app.post('/cadastrar-voo', (req, res) => {
  const {
    origemCidade,
    origemEstado,
    destinoCidade,
    destinoEstado,
    numeroVoo,
    dataVoo,
    horaVoo,
    companhia,
    classe,
    status
  } = req.body;

  const terminalPath = path.join(__dirname, 'painel.exe');
  const proc = spawn(terminalPath);

  proc.stdout.on('data', (data) => {
    console.log('[stdout]', data.toString());
  });

  proc.stderr.on('data', (data) => {
    console.error('[stderr]', data.toString());
  });

  proc.on('error', (err) => {
    console.error('Erro ao executar painel.exe:', err.message);
    res.status(500).send({ erro: 'Erro ao executar painel.exe' });
  });

  proc.on('close', () => {
    res.status(200).send({ mensagem: 'Voo cadastrado com sucesso!' });
  });

  // Envia dados simulando entrada do usuário
  setTimeout(() => {
    proc.stdin.write('1\n'); // Ativa opção de cadastro

    proc.stdin.write(`${numeroVoo}\n`);
    proc.stdin.write(`${companhia}\n`);
    proc.stdin.write(`${destinoCidade} - ${destinoEstado}\n`);
    proc.stdin.write(`${horaVoo}\n`);
    proc.stdin.write(`${status}\n`);

    proc.stdin.write('5\n'); // Encerra
    proc.stdin.end();
  }, 500);
});

// Inicia o servidor
app.listen(3001, () => {
  console.log('Servidor backend rodando na porta 3001');
});
