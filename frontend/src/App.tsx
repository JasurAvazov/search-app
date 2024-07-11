import React, { useState, useRef } from 'react';
import axios, { CancelTokenSource } from 'axios';
import InputMask from 'react-input-mask';

interface User {
  email: string;
  number: string;
}

const App = () => {
  const [email, setEmail] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [results, setResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const cancelTokenSource = useRef<CancelTokenSource | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!validateEmail(email)) {
      alert('Invalid email format');
      return;
    }

    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel('Operation canceled by the user.');
    }
    cancelTokenSource.current = axios.CancelToken.source();

    setIsLoading(true);

    try {
      const response = await axios.post<User[]>('/api/search', { email, number }, {
        cancelToken: cancelTokenSource.current.token
      });
      setResults(response.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message);
      } else {
        console.error('Error fetching data:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Number:</label>
          <InputMask mask="99-99-99" value={number} onChange={(e) => setNumber(e.target.value)} />
        </div>
        <button type="submit">Submit</button>
      </form>
      {isLoading && <p>Loading...</p>}
      <ul>
        {results.map((user, index) => (
          <li key={index}>
            {user.email} - {user.number}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;