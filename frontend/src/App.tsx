import React, { useState, useRef } from 'react';
import axios, { CancelTokenSource } from 'axios';
import InputMask from 'react-input-mask';

import styles from './styles/modules/App.module.scss'

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

  const handleSubmit = async (event: React.FormEvent) => {
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
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputWithTitle}>
          <label className={styles.title}>Email</label>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputWithTitle}>
          <label className={styles.title}>Number:</label>
          <InputMask
            className={styles.input}
            mask="99-99-99"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {isLoading && <p>Loading...</p>}
      {results.length > 0 &&
        <div className={styles.list}>
          {results.map((user, index) => (
            <div key={index} className={styles.item}>
              {user.email} - {user.number}
            </div>
          ))}
        </div>
      }
    </div>
  );
};

export default App;