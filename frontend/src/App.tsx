import { useState } from 'react';
import './App.css';

type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'power' | 'sqrt' | 'percentage';

const operations: { value: Operation; label: string; symbol: string }[] = [
  { value: 'add', label: 'Suma', symbol: '+' },
  { value: 'subtract', label: 'Resta', symbol: '−' },
  { value: 'multiply', label: 'Multiplicación', symbol: '×' },
  { value: 'divide', label: 'División', symbol: '÷' },
  { value: 'power', label: 'Potenciación', symbol: '^' },
  { value: 'sqrt', label: 'Raíz cuadrada', symbol: '√' },
  { value: 'percentage', label: 'Porcentaje', symbol: '%' },
];

function App() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [operation, setOperation] = useState<Operation>('add');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isUnary = operation === 'sqrt';

  async function calculate() {
    setResult(null);
    setError('');

    if (a.trim() === '') {
      setError('Ingresa el número.');
      return;
    }

    if (!isUnary && b.trim() === '') {
      setError('Ingresa los dos números.');
      return;
    }

    const first = Number(a);
    const second = isUnary ? 0 : Number(b);

    if (!Number.isFinite(first) || (!isUnary && !Number.isFinite(second))) {
      setError('Ingresa números válidos.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation,
          a: first,
          b: isUnary ? 0 : second,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo realizar el cálculo.');
      }

      setResult(data.result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo conectar con el servidor.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="calculator">
        <div className="eyebrow">SEZZLE · TECHNICAL CHALLENGE</div>
        <h1>Calculadora</h1>
        <p className="subtitle">
          Operaciones matemáticas sencillas, resultados al instante.
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void calculate();
          }}
        >
          <label htmlFor="number-a">{isUnary ? 'Número' : 'Primer número'}</label>
          <input
            id="number-a"
            type="number"
            step="any"
            value={a}
            onChange={(event) => setA(event.target.value)}
            placeholder="Ej. 10"
          />

          <label htmlFor="operation">Operación</label>
          <select
            id="operation"
            value={operation}
            onChange={(event) => setOperation(event.target.value as Operation)}
          >
            {operations.map((item) => (
              <option key={item.value} value={item.value}>
                {item.symbol} — {item.label}
              </option>
            ))}
          </select>

          {!isUnary && (
            <>
              <label htmlFor="number-b">Segundo número</label>
              <input
                id="number-b"
                type="number"
                step="any"
                value={b}
                onChange={(event) => setB(event.target.value)}
                placeholder="Ej. 5"
              />
            </>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Calculando...' : 'Calcular resultado'}
          </button>
        </form>

        {error && (
          <div className="message error" role="alert">
            {error}
          </div>
        )}

        {result !== null && !error && (
          <div className="message success" role="status">
            <span>Resultado</span>
            <strong>{result}</strong>
          </div>
        )}

        <p className="footer">Procesado por nuestra API en Go</p>
      </section>
    </main>
  );
}

export default App;
