import React, { useState } from 'react';

function App() {
  const [pingData, setPingData] = useState([]);

  const fetchPingData = async () => {
    try {
      const response = await fetch('http://localhost:3001/run-terminal');
      const data = await response.json();
      setPingData(data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchPingData}>Mostrar</button>
      {pingData.length > 0 && (
        <table border="1" cellPadding="5" style={{ marginTop: '20px' }}>
          <thead>
            <tr>
              <th>IP</th>
              <th>Bytes</th>
              <th>Tempo (ms)</th>
              <th>TTL</th>
              {pingData[0].icmp_seq !== undefined && <th>ICMP Seq</th>}
            </tr>
          </thead>
          <tbody>
            {pingData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.ip}</td>
                <td>{entry.bytes}</td>
                <td>{entry.time}</td>
                <td>{entry.ttl}</td>
                {entry.icmp_seq !== undefined && <td>{entry.icmp_seq}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
