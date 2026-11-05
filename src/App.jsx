import { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await fetch(`https://wttr.in/${encodeURIComponent(city.trim())}?format=j1`);

      if (!response.ok) {
        throw new Error('Город не найден или сервис недоступен');
      }

      const data = await response.json();

      if (!data.current_condition || !data.current_condition[0]) {
        throw new Error('Не удалось получить данные о погоде');
      }

      const current = data.current_condition[0];

      setWeather({
        cityName: city.trim(),
        temp: current.temp_C,
        wind: current.windspeedKmph,
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Погода сейчас</h1>
      
      <form onSubmit={fetchWeather} className="search-form">
        <input 
          type="text" 
          placeholder="Введите город..." 
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Узнать</button>
      </form>

      {loading && <p className="status">Загрузка...</p>}
      {error && <p className="status error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>{weather.cityName}</h2>
          <p className="temp">{weather.temp}°C</p>
          <p>Ветер: {weather.wind} км/ч</p>
        </div>
      )}
    </div>
  );
}

export default App;