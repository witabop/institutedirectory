import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import statements from './institute-transcripts.json';
import logo from './logo.png';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const logins = [['admin', 'root'], ['clive.dorothy', 'dolor'], ['elias.bouchard', 'omnividen'], ['eve.crawford', 'videre']]
  const handleSubmit = e => {
    e.preventDefault();
    let pair = [username, password];
    if (logins.some(
      ([user, pass]) =>
        user === pair[0] &&
        pass === pair[1]
    )) {
      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('username', username);
      onLogin(true);
    } else alert('Invalid credentials');
  };

  const terminalContainer = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#000'
  };
  const cardStyle = {
    backgroundColor: '#000',
    color: '#32b350',
    border: '1px solid #32b350',
    fontFamily: '"Courier New", Courier, monospace'
  };
  const inputStyle = {
    backgroundColor: '#000',
    color: '#32b350',
    border: '1px solid #32b350',
    fontFamily: '"Courier New", Courier, monospace',
    outline: 'none'
  };
  const labelStyle = {
    color: '#32b350',
    fontFamily: '"Courier New", Courier, monospace'
  };
  const buttonStyle = {
    backgroundColor: '#32b350',
    color: '#000',
    border: '1px solid #32b350',
    fontFamily: '"Courier New", Courier, monospace',
    outline: 'none'
  };

  return (
    <Container fluid style={terminalContainer}>
      <img
        src={logo}
        alt="Institute Logo"
        style={{ width: 250, marginBottom: '1rem' }}
      />
      <Card style={cardStyle} className="p-4">
        <Card.Title style={labelStyle}>Institute Directory Login</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername">
            <Form.Label style={labelStyle}>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              style={inputStyle}
            />
          </Form.Group>
          <Form.Group controlId="formPassword" className="mt-3">
            <Form.Label style={labelStyle}>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </Form.Group>
          <Button type="submit" style={buttonStyle} className="mt-4">
            Login
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

function Home() {
  const [keyword, setKeyword] = useState('');
  const [roll, setRoll] = useState(0);
  const [results, setResults] = useState([]);

  const highlight = (text, kw) => {
    const re = new RegExp(`(${kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    return text.replace(re, `<span style="color:#5e5a11;">$1</span>`);
  };

  const handleSearch = () => {
    const kw = keyword.toLowerCase();
    const r = Number(roll);

    const matches = statements
      .filter(stmt => stmt.transcript.toLowerCase().includes(kw))
      .map(stmt => {
        const text = stmt.transcript;
        const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
        const hitIdx = sentences.findIndex(s =>
          s.toLowerCase().includes(kw)
        );

        let snippet;
        if (hitIdx < 0 || r > 28) {
          snippet = text;
        } else {
          const start = Math.max(0, hitIdx - r);
          const end = Math.min(sentences.length, hitIdx + r + 1);
          const window = sentences.slice(start, end).join(' ');
          const prefix = start > 0 ? '… ' : '';
          const suffix = end < sentences.length ? ' …' : '';
          snippet = prefix + window + suffix;
        }

        return {
          ...stmt,
          snippet: highlight(snippet, keyword)
        };
      });

    setResults(matches);
  };

  const terminalBody = {
    backgroundColor: '#000',
    color: '#32b350',
    fontFamily: '"Courier New", Courier, monospace',
    minHeight: '100vh',
    padding: '100px',
    maxWidth: '800px',
    margin: '0 auto'
  };
  const inputStyle = {
    backgroundColor: '#000',
    color: '#32b350',
    border: '1px solid #32b350',
    fontFamily: '"Courier New", Courier, monospace',
    outline: 'none'
  };
  const buttonStyle = {
    backgroundColor: '#32b350',
    color: '#000',
    border: '1px solid #32b350',
    fontFamily: '"Courier New", Courier, monospace',
    outline: 'none'
  };
  const resultStyle = {
    backgroundColor: '#000',
    color: '#32b350',
    border: '1px solid #32b350',
    fontFamily: '"Courier New", Courier, monospace',
    marginBottom: '10px',
    outline: 'none'
  };

  return (
    <div style={terminalBody}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <img src={logo} alt="Institute Logo" style={{ width: 200 }} />
      </div>
      <Form className="d-flex align-items-end">
        <Form.Group controlId="formKeyword" className="flex-grow-1 me-3">
          <Form.Label style={{ color: '#32b350' }}>Search</Form.Label>
          <Form.Control
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="....."
            style={inputStyle}
          />
        </Form.Group>
        <Form.Group controlId="formRoll" className="me-3" style={{ width: '100px' }}>
          <Form.Label style={{ color: '#32b350' }}>Roll</Form.Label>
          <Form.Control
            type="number"
            value={roll}
            onChange={e => setRoll(e.target.value)}
            placeholder="0"
            style={inputStyle}
            className="no-spinner"
          />
        </Form.Group>
        <Button onClick={handleSearch} style={buttonStyle}>
          Search
        </Button>
      </Form>

      <div className="mt-4">
        {results.map(res => (
          <Card key={res.case_number} style={resultStyle}>
            <Card.Body>
              <Card.Title>
                Statement {res.case_number}{' '}
                <small>
                  ({res.date} by {res.person})
                </small>
              </Card.Title>
              <Card.Text
                style={{ color: '#32b350' }}
                dangerouslySetInnerHTML={{ __html: res.snippet }}
              />
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    if (localStorage.getItem('authenticated') === 'true') {
      setAuthenticated(true);
    }
  }, []);

  return (
    <>
      <div className="scanline-overlay" />
      {authenticated ? <Home /> : <Login onLogin={setAuthenticated} />}
    </>
  );
}

export default App;
