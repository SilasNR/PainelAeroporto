const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());

app.get('/run-terminal', (req, res) => {
  const terminalPath = path.join(__dirname, 'terminal.exe');
  const proc = spawn(terminalPath);

  let output = '';
  let responseSent = false;

  console.log('Executando terminal.exe...');

  proc.stdout.on('data', (data) => {
    console.log('stdout:', data.toString());
    output += data.toString();
  });

  proc.stderr.on('data', (data) => {
    console.log('stderr:', data.toString());
    output += data.toString();
  });

  proc.on('close', (code) => {
    console.log('Processo finalizado com código:', code);
    res.send(output);
  });

  proc.on('error', (err) => {
    console.error('Erro ao executar terminal.exe:', err.message);
    res.status(500).send('Erro ao executar terminal.exe: ' + err.message);
  });

  // Enviando dados como se fosse input
  proc.stdin.write("0\n"); // Isso simula escolher "Sair" direto
  proc.stdin.end();
});

app.listen(3001, () => {
  console.log('Servidor backend rodando na porta 3001');
});
