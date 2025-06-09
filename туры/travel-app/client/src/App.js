import React, { useState, useEffect, useMemo } from 'react';

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

function Navbar({ isAdmin, setPage, setShowAuthModal, onLogout }) {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-cyan-500/10">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-cyan-400 cursor-pointer" onClick={() => setPage('home')}>
          DAG WAY
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a onClick={() => setPage('home')} className="hover:text-cyan-400 transition-colors cursor-pointer">Главная</a>
          <a onClick={() => setPage('tours')} className="hover:text-cyan-400 transition-colors cursor-pointer">Наши Туры</a>
          <a onClick={() => setPage('about')} className="hover:text-cyan-400 transition-colors cursor-pointer">О нас</a>
        </div>
        <div className="flex items-center space-x-4">
          {isAdmin ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm hidden sm:block text-yellow-400">Режим админа</span>
              <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm">Выйти</button>
            </div>
          ) : (
            <button onClick={() => setShowAuthModal(true)} className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors">
              Вход
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

function HeroSection({ setPage }) {
  return (
    <div 
      className="h-screen bg-cover bg-center flex flex-col justify-center items-center text-center px-4 -mt-16" 
      style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://placehold.co/1920x1080/000000/FFFFFF?text=Welcome')" }}
    >
      <h1 className="text-5xl md:text-7xl font-extrabold mb-4">ИССЛЕДУЙ ДАГЕСТАН С НАМИ</h1>
      <p className="text-2xl md:text-4xl mb-8">ГОТОВЬТЕСЬ, ВПЕРЕДИ ВАС ЖДЕТ ЧТО-ТО НЕВЕРОЯТНОЕ :)</p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <button onClick={() => setPage('tours')} className="bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-cyan-600 transition-transform transform hover:scale-105">
          ВЫБРАТЬ ТУР
        </button>
        <a href="https://wa.me/79387940405" target="_blank" rel="noopener noreferrer" className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-gray-900 transition-all">
          НАПИСАТЬ В WHATSAPP
        </a>
      </div>
    </div>
  );
}

function ToursPage({ tours, isAdmin, onEdit, onDelete, onAdd, uniqueCountries, countryFilter, setCountryFilter, priceFilter, setPriceFilter }) {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-bold text-cyan-400">Наши Туры</h2>
          <p className="text-gray-400 mt-1">Выберите путешествие своей мечты</p>
        </div>
        {isAdmin && (
          <button onClick={onAdd} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Добавить новый тур
          </button>
        )}
      </div>
      <div className="bg-gray-800 p-6 rounded-lg mb-10 shadow-lg flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full md:w-1/3">
          <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">Направление</label>
          <select id="country" value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500">
            <option value="">Все</option>
            {uniqueCountries.map(country => <option key={country} value={country}>{country}</option>)}
          </select>
        </div>
        <div className="w-full md:w-2/3">
          <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">Макс. цена: {priceFilter.toLocaleString()} ₽</label>
          <input type="range" id="price" min="10000" max="500000" step="10000" value={priceFilter} onChange={(e) => setPriceFilter(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
        </div>
      </div>
      {tours.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map(tour => (
            <TourCard key={tour.id} tour={tour} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-400">Туры, соответствующие вашим критериям, не найдены.</p>
        </div>
      )}
    </div>
  );
}

function TourCard({ tour, isAdmin, onEdit, onDelete }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/30 transition-shadow duration-300 flex flex-col">
      <img src={tour.imageUrl || `https://placehold.co/600x400/1a202c/76e6e8?text=${tour.title}`} alt={tour.title} className="w-full h-56 object-cover"/>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-2xl font-bold mb-2 text-cyan-400">{tour.title}</h3>
        <div className="flex items-center text-gray-400 mb-4">
          <MapPinIcon />
          <span>{tour.country}</span>
        </div>
        <p className="text-gray-300 mb-4 flex-grow">{tour.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-2xl font-bold text-white">{tour.price.toLocaleString()} ₽</span>
          <button className="bg-cyan-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-cyan-600 transition-colors">Подробнее</button>
        </div>
      </div>
      {isAdmin && (
        <div className="bg-gray-700 p-2 flex justify-end space-x-2">
          <button onClick={() => onEdit(tour)} className="bg-yellow-500 text-white px-3 py-1 text-sm rounded hover:bg-yellow-600">Изменить</button>
          <button onClick={() => onDelete(tour.id)} className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600">Удалить</button>
        </div>
      )}
    </div>
  );
}

function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-4xl font-bold text-center mb-10 text-cyan-400">О Нас</h2>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <h3 className="text-2xl font-bold mb-4 text-cyan-300">DAG WAY - Ваш проводник в мир приключений!</h3>
          <p className="text-gray-300 mb-4">
            Мы - команда энтузиастов, влюбленных в Дагестан. Наша миссия - показать вам настоящий, нетуристический регион, его величие, красоту и гостеприимство. Мы организуем авторские туры, которые запомнятся на всю жизнь.
          </p>
          <div className="mt-6 space-y-3">
            <p className="flex items-center"><strong className="w-24 text-cyan-400">Email:</strong> <a href="mailto:info@dagway.com" className="hover:underline">info@dagway.com</a></p>
            <p className="flex items-center"><strong className="w-24 text-cyan-400">Телефон:</strong> <a href="tel:+79387940405" className="hover:underline">+7 (938) 794-04-05</a></p>
            <p className="flex items-center"><strong className="w-24 text-cyan-400">Адрес:</strong> г. Махачкала, ул. Ярагского, д. 5</p>
          </div>
        </div>
        <div className="lg:w-1/2 h-80 lg:h-auto rounded-lg overflow-hidden">
          <iframe 
            src="https://yandex.ru/map-widget/v1/?um=constructor%3A7a1e00e4e6955a16d84f22716382025359a39783859600e16e6328e1a141d575&source=constructor" 
            width="100%" 
            height="100%" 
            frameBorder="0"
            className="rounded-lg"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

function AdminPanel({ onAddTour, onUpdateTour, editingTour, setPage }) {
  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  useEffect(() => {
    if (editingTour) {
      setTitle(editingTour.title);
      setCountry(editingTour.country);
      setDescription(editingTour.description);
      setPrice(editingTour.price);
      setImageUrl(editingTour.imageUrl);
    } else {
      setTitle('');
      setCountry('');
      setDescription('');
      setPrice('');
      setImageUrl('');
    }
  }, [editingTour]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tourData = { title, country, description, price: Number(price), imageUrl };
    
    if (editingTour) {
      onUpdateTour({ ...tourData, id: editingTour.id });
    } else {
      onAddTour(tourData);
    }
    setPage('tours');
  };
  
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-cyan-400">{editingTour ? 'Редактировать тур' : 'Добавить новый тур'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Название тура" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-gray-700 border-gray-600 rounded p-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"/>
          <input type="text" placeholder="Страна / Регион" value={country} onChange={(e) => setCountry(e.target.value)} required className="w-full bg-gray-700 border-gray-600 rounded p-2 text-white"/>
          <textarea placeholder="Описание" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full bg-gray-700 border-gray-600 rounded p-2 h-32 text-white"></textarea>
          <input type="number" placeholder="Цена в рублях" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full bg-gray-700 border-gray-600 rounded p-2 text-white"/>
          <input type="url" placeholder="URL изображения" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required className="w-full bg-gray-700 border-gray-600 rounded p-2 text-white"/>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={() => setPage('tours')} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">Отмена</button>
            <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600">{editingTour ? 'Сохранить изменения' : 'Добавить тур'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AuthModal({ setShowModal, onLogin }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setError('');
    const success = await onLogin(login, password);
    if (!success) {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={() => setShowModal(false)}>
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-sm relative" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-center text-cyan-400">Вход для администратора</h2>
        <form onSubmit={handleAuthAction} className="space-y-4">
          <input type="text" placeholder="Логин" value={login} onChange={(e) => setLogin(e.target.value)} required autoComplete="username" className="w-full bg-gray-700 border-gray-600 rounded p-3 focus:ring-cyan-500 focus:border-cyan-500 text-white"/>
          <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="w-full bg-gray-700 border-gray-600 rounded p-3 text-white"/>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full bg-cyan-500 text-white py-3 rounded-lg font-semibold hover:bg-cyan-600 transition-colors">
            Войти
          </button>
        </form>
        <button onClick={() => setShowModal(false)} className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl">×</button>
      </div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-sm text-center">
        <p className="text-white text-lg mb-6">{message}</p>
        <div className="flex justify-center space-x-4">
          <button onClick={onCancel} className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            Отмена
          </button>
          <button onClick={onConfirm} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors">
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-12">
      <div className="container mx-auto px-6 py-6 text-center text-gray-400">
        <p>© {new Date().getFullYear()} DAG WAY. Все права защищены.</p>
        <p className="text-sm mt-2">Создано с ❤️ для незабываемых путешествий.</p>
      </div>
    </footer>
  );
}

export default function App() {
  const [page, setPage] = useState('home');
  const [tours, setTours] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [tourToDelete, setTourToDelete] = useState(null);
  const [countryFilter, setCountryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState(500000);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tours');
      const data = await response.json();
      setTours(data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };

  const uniqueCountries = useMemo(() => {
    return [...new Set(tours.map(tour => tour.country))];
  }, [tours]);

  const filteredTours = useMemo(() => {
    return tours
      .filter(tour => {
        const countryMatch = countryFilter
          ? tour.country.toLowerCase().includes(countryFilter.toLowerCase())
          : true;
        const priceMatch = tour.price <= priceFilter;
        return countryMatch && priceMatch;
      })
      .sort((a, b) => a.price - b.price);
  }, [tours, countryFilter, priceFilter]);

  const handleNavigate = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleLogin = async (login, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });
      const data = await response.json();
      if (data.success) {
        setIsAdmin(true);
        setShowAuthModal(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const handleAddTour = async (tour) => {
    try {
      const response = await fetch('http://localhost:5000/api/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tour),
      });
      const newTour = await response.json();
      setTours([...tours, newTour]);
    } catch (error) {
      console.error('Error adding tour:', error);
    }
  };

  const handleUpdateTour = async (updatedTour) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tours/${updatedTour.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTour),
      });
      const updated = await response.json();
      setTours(tours.map(tour => (tour.id === updated.id ? updated : tour)));
    } catch (error) {
      console.error('Error updating tour:', error);
    }
  };

  const requestDeleteTour = (tourId) => {
    setTourToDelete(tourId);
  };

  const confirmDeleteTour = async () => {
    try {
      await fetch(`http://localhost:5000/api/tours/${tourToDelete}`, {
        method: 'DELETE',
      });
      setTours(tours.filter(tour => tour.id !== tourToDelete));
      setTourToDelete(null);
    } catch (error) {
      console.error('Error deleting tour:', error);
    }
  };

  const cancelDeleteTour = () => {
    setTourToDelete(null);
  };

  const startEditing = (tour) => {
    setEditingTour(tour);
    setPage('admin');
  };

  const startCreating = () => {
    setEditingTour(null);
    setPage('admin');
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <Navbar
        isAdmin={isAdmin}
        setPage={handleNavigate}
        setShowAuthModal={setShowAuthModal}
        onLogout={handleLogout}
      />
      <main>
        {page === 'home' && <HeroSection setPage={handleNavigate} />}
        {page === 'tours' && (
          <ToursPage
            tours={filteredTours}
            isAdmin={isAdmin}
            onEdit={startEditing}
            onDelete={requestDeleteTour}
            onAdd={startCreating}
            uniqueCountries={uniqueCountries}
            countryFilter={countryFilter}
            setCountryFilter={setCountryFilter}
            priceFilter={priceFilter}
            setPriceFilter={setPriceFilter}
          />
        )}
        {page === 'about' && <AboutPage />}
        {page === 'admin' && (
          <AdminPanel
            onAddTour={handleAddTour}
            onUpdateTour={handleUpdateTour}
            editingTour={editingTour}
            setPage={handleNavigate}
          />
        )}
      </main>
      <Footer />
      {showAuthModal && (
        <AuthModal setShowModal={setShowAuthModal} onLogin={handleLogin} />
      )}
      {tourToDelete && (
        <ConfirmModal
          message="Вы уверены, что хотите удалить этот тур?"
          onConfirm={confirmDeleteTour}
          onCancel={cancelDeleteTour}
        />
      )}
    </div>
  );
}