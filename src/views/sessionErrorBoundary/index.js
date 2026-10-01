import React from 'react';
import { useState, useEffect } from 'react';

function useSessionStorage(key) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const storedData = JSON.parse(sessionStorage.getItem(key));
      setData(storedData);
    } catch (error) {
      setError(error);
    }
  }, [key]);

  return { data, error };
}

function ComponentUsingSessionStorage() {
  const { data, error } = useSessionStorage('myKey');

  if (error) {
    return (
      <div>
        <h1>Something went wrong. Please try again later.</h1>
        <p>Error details: {error.message}</p>
      </div>
    );
  }

  return <div>Data: {data}</div>;
}

export default ComponentUsingSessionStorage;
