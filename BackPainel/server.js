const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const iconv = require('iconv-lite'); // <-- Biblioteca para decodificar corretamente

const app = express();
app.use(cors());
app.use(express.json());

// Função para interpretar a saída da opção 2 (listar voos)
function parseVoos(text) {
  const lines = text.split('\n');
  const voos = [];

  for (let line of lines) {
    if (!line.includes('|')) continue;

    const partes = line.split('|').map(p => p.trim());
    if (partes.length < 6) continue;

    const [numeroVoo, companhia, destino, portao, horaVoo, status] = partes;

    voos.push({
      numeroVoo,
      companhia,
      destino,
      portao,
      horaVoo,
      status,
    });
  }

  return voos;
}

// Rota GET para listar voos
app.get('/listar-voos', (req, res) => {
  const terminalPath = path.join(__dirname, 'painel.exe');
  const proc = spawn(terminalPath, [], { stdio: ['pipe', 'pipe', 'pipe'], encoding: 'buffer' });

  let output = Buffer.alloc(0);

  proc.stdout.on('data', (data) => {
    output = Buffer.concat([output, data]);
  });

  proc.stderr.on('data', (data) => {
    output = Buffer.concat([output, data]);
  });

  proc.on('error', (err) => {
    console.error('Erro ao executar painel.exe:', err.message);
    res.status(500).send({ erro: 'Erro ao executar painel.exe' });
  });

  proc.on('close', () => {
    const decoded = iconv.decode(output, 'latin1');
    const json = parseVoos(decoded);
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
    numeroVoo,
    companhia,
    destino,
    portao,
    horaVoo,
    status
  } = req.body;

  const terminalPath = path.join(__dirname, 'painel.exe');
  const proc = spawn(terminalPath);

  proc.stdout.on('data', (data) => {
    console.log('[stdout]', iconv.decode(data, 'windows-1252'));
  });

  proc.stderr.on('data', (data) => {
    console.error('[stderr]', iconv.decode(data, 'windows-1252'));
  });

  proc.on('error', (err) => {
    console.error('Erro ao executar painel.exe:', err.message);
    res.status(500).send({ erro: 'Erro ao executar painel.exe' });
  });

  proc.on('close', () => {
    res.status(200).send({ mensagem: 'Voo cadastrado com sucesso!' });
  });

  setTimeout(() => {
    proc.stdin.write('1\n');
    proc.stdin.write(`${numeroVoo}\n`);
    proc.stdin.write(`${companhia}\n`);
    proc.stdin.write(`${destino}\n`);
    proc.stdin.write(`${portao}\n`);
    proc.stdin.write(`${horaVoo}\n`);
    proc.stdin.write(`${status}\n`);
    proc.stdin.write('5\n');
    proc.stdin.end();
  }, 500);
});

app.post('/alterar', (req, res) => {
  const {
    numeroVoo,
    companhia,
    destino,
    portao,
    horaVoo,
    status
  } = req.body;

  const terminalPath = path.join(__dirname, 'painel.exe');
  const proc = spawn(terminalPath);

  proc.stdout.on('data', (data) => {
    console.log('[stdout]', iconv.decode(data, 'windows-1252'));
  });

  proc.stderr.on('data', (data) => {
    console.error('[stderr]', iconv.decode(data, 'windows-1252'));
  });

  proc.on('error', (err) => {
    console.error('Erro ao executar painel.exe:', err.message);
    res.status(500).send({ erro: 'Erro ao executar painel.exe' });
  });

  proc.on('close', () => {
    res.status(200).send({ mensagem: 'Voo cadastrado com sucesso!' });
  });

  setTimeout(() => {
    proc.stdin.write('3\n');
    proc.stdin.write(`${numeroVoo}\n`);
    proc.stdin.write(`${companhia}\n`);
    proc.stdin.write(`${destino}\n`);
    proc.stdin.write(`${portao}\n`);
    proc.stdin.write(`${horaVoo}\n`);
    proc.stdin.write(`${status}\n`);
    proc.stdin.write('5\n');
    proc.stdin.end();
  }, 500);
});

app.get('/voo', (req, res) => {
  const numeroProcurado = req.query.numeroVoo;
  if (!numeroProcurado) {
    return res.status(400).send({ erro: 'Parâmetro numeroVoo é obrigatório' });
  }

  const terminalPath = path.join(__dirname, 'painel.exe');
  const proc = spawn(terminalPath, [], { stdio: ['pipe', 'pipe', 'pipe'] });

  let output = Buffer.alloc(0);

  proc.stdout.on('data', (data) => {
    output = Buffer.concat([output, data]);
  });

  proc.stderr.on('data', (data) => {
    output = Buffer.concat([output, data]);
  });

  proc.on('error', (err) => {
    console.error('Erro ao executar painel.exe:', err.message);
    res.status(500).send({ erro: 'Erro ao executar painel.exe' });
  });

  proc.on('close', () => {
  const decoded = iconv.decode(output, 'windows-1252');
  const voos = parseVoos(decoded);

  console.log("Lista de voos:", voos);
  console.log("Procurando por:", numeroProcurado);

  const vooEncontrado = voos.find(v => v.numeroVoo === numeroProcurado);

  if (vooEncontrado) {
    res.json(vooEncontrado);
  } else {
    res.status(404).send({ erro: 'Voo não encontrado' });
  }
});

  // envia opções para listar e sair
  setTimeout(() => {
    proc.stdin.write('2\n'); // opção listar voos
    proc.stdin.write('5\n'); // sair
    proc.stdin.end();
  }, 500);
});

// Inicia o servidor
app.listen(3001, () => {
  console.log('Servidor backend rodando na porta 3001');
});
