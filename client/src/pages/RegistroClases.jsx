import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Calendar as CalendarIcon, Clock, Users, MapPin, Filter, Search, 
  CheckCircle, XCircle, User, TrendingUp, Heart, Zap, Activity, 
  Flame, Wind, Dumbbell, Music, Target, ChevronRight, Info, 
  Star, AlertCircle, X 
} from 'lucide-react';

const RegistroClases = () => {
  const { user } = useContext(AuthContext);
  const userName = user?.nombre || "Usuario";

  // Estados
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [userBookings, setUserBookings] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [activeTab, setActiveTab] = useState('browse');
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: '' }

  // Datos Mock
  const classes = [
    {
      id: '1', name: 'Yoga Flow Matutino', type: 'yoga', instructor: 'María González',
      date: new Date().toISOString().split('T')[0], time: '07:00', duration: 60,
      capacity: 20, booked: 15, location: 'Sala 1', level: 'all',
      description: 'Comienza tu día con energía positiva. Clase de yoga flow que combina posturas dinámicas con respiración consciente.',
      benefits: ['Flexibilidad', 'Reducción del estrés', 'Equilibrio mental']
    },
    {
      id: '2', name: 'Spinning Intenso', type: 'spinning', instructor: 'Carlos Ruiz',
      date: new Date().toISOString().split('T')[0], time: '08:00', duration: 45,
      capacity: 25, booked: 22, location: 'Sala de Spinning', level: 'intermediate',
      description: 'Clase de ciclismo indoor de alta intensidad. Quema calorías y mejora tu resistencia cardiovascular.',
      benefits: ['Cardio intenso', 'Quema de calorías', 'Resistencia']
    },
    {
      id: '3', name: 'CrossFit Avanzado', type: 'crossfit', instructor: 'David Fernández',
      date: new Date().toISOString().split('T')[0], time: '09:00', duration: 60,
      capacity: 15, booked: 12, location: 'Box CrossFit', level: 'advanced',
      description: 'Entrenamiento funcional de alta intensidad.',
      benefits: ['Fuerza funcional', 'Acondicionamiento', 'Trabajo en equipo']
    },
    {
      id: '4', name: 'Zumba Party', type: 'zumba', instructor: 'Laura Martínez',
      date: new Date().toISOString().split('T')[0], time: '18:00', duration: 60,
      capacity: 30, booked: 28, location: 'Sala 2', level: 'all',
      description: 'Baila y quema calorías con ritmos latinos.',
      benefits: ['Cardio divertido', 'Coordinación', 'Energía positiva']
    },
    {
      id: '5', name: 'Boxing Fit', type: 'boxing', instructor: 'Javier Santos',
      date: new Date().toISOString().split('T')[0], time: '19:00', duration: 60,
      capacity: 20, booked: 16, location: 'Ring de Boxing', level: 'all',
      description: 'Entrenamiento inspirado en boxeo.',
      benefits: ['Cardio explosivo', 'Coordinación', 'Liberación de estrés']
    },
    {
      id: '6', name: 'HIIT Extremo', type: 'hiit', instructor: 'Roberto García',
      date: new Date().toISOString().split('T')[0], time: '20:00', duration: 45,
      capacity: 25, booked: 20, location: 'Sala 1', level: 'intermediate',
      description: 'Intervalos de alta intensidad para máxima quema de grasa.',
      benefits: ['Quema de grasa', 'Metabolismo acelerado', 'Resistencia']
    }
  ];

  const classTypes = [
    { id: 'all', name: 'Todas', icon: Dumbbell, color: 'purple' },
    { id: 'yoga', name: 'Yoga', icon: Wind, color: 'blue' },
    { id: 'spinning', name: 'Spinning', icon: Activity, color: 'red' },
    { id: 'crossfit', name: 'CrossFit', icon: Zap, color: 'orange' },
    { id: 'zumba', name: 'Zumba', icon: Music, color: 'pink' },
    { id: 'boxing', name: 'Boxing', icon: Flame, color: 'yellow' },
    { id: 'hiit', name: 'HIIT', icon: TrendingUp, color: 'red' },
    { id: 'funcional', name: 'Funcional', icon: Heart, color: 'purple' }
  ];

  // Cargar reservas
  useEffect(() => {
    const savedBookings = localStorage.getItem('userBookings');
    if (savedBookings) {
      setUserBookings(JSON.parse(savedBookings));
    }
  }, []);

  // Guardar reservas
  useEffect(() => {
    localStorage.setItem('userBookings', JSON.stringify(userBookings));
  }, [userBookings]);

  // Limpiar notificaciones
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const handleBookClass = (classSession) => {
    const alreadyBooked = userBookings.some(
      b => b.classId === classSession.id && b.status === 'confirmed'
    );

    if (alreadyBooked) {
      showNotification('error', 'Ya tienes una reserva para esta clase');
      return;
    }

    if (classSession.booked >= classSession.capacity) {
      showNotification('error', 'Esta clase está completa');
      return;
    }

    const newBooking = {
      id: Date.now().toString(),
      classId: classSession.id,
      userName: userName,
      bookedAt: new Date().toISOString(),
      status: 'confirmed'
    };

    setUserBookings([...userBookings, newBooking]);
    showNotification('success', `¡Reserva confirmada para ${classSession.name}!`);
    setSelectedClass(null);
  };

  const handleCancelBooking = (bookingId) => {
    setUserBookings(userBookings.map(b => 
      b.id === bookingId ? { ...b, status: 'cancelled' } : b
    ));
    showNotification('success', 'Reserva cancelada exitosamente');
  };

  // Helpers de UI
  const getClassColor = (type) => {
    const map = { yoga: 'bg-blue-500', spinning: 'bg-red-500', crossfit: 'bg-orange-500', zumba: 'bg-pink-500', boxing: 'bg-yellow-500', hiit: 'bg-red-600', funcional: 'bg-purple-500' };
    return map[type] || 'bg-purple-500';
  };

  const getLevelBadge = (level) => {
    const map = {
      beginner: { text: 'Principiante', color: 'bg-green-100 text-green-700' },
      intermediate: { text: 'Intermedio', color: 'bg-yellow-100 text-yellow-700' },
      advanced: { text: 'Avanzado', color: 'bg-red-100 text-red-700' },
      all: { text: 'Todos los niveles', color: 'bg-purple-100 text-purple-700' }
    };
    return map[level] || map.all;
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'US';

  // Filtrado
  const filteredClasses = classes.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = selectedType === 'all' || c.type === selectedType;
    const matchLevel = selectedLevel === 'all' || c.level === selectedLevel || c.level === 'all';
    const matchDate = c.date === selectedDate;
    return matchSearch && matchType && matchLevel && matchDate;
  });

  const myBookings = userBookings.filter(b => b.status === 'confirmed').map(b => {
    const c = classes.find(cl => cl.id === b.classId);
    return c ? { ...b, class: c } : null;
  }).filter(Boolean);

  return (
    <div className="min-h-screen bg-neutral-50 py-8 relative">
      
      {/* Notificación Flotante */}
      {notification && (
        <div className={`fixed top-24 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-bold animate-bounce ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Reserva de Clases</h1>
          <p className="text-neutral-600">Encuentra y reserva las mejores clases del gimnasio</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Mis Reservas" value={userBookings.filter(b => b.status === 'confirmed').length} icon={CheckCircle} color="text-purple-600" bg="bg-purple-100" />
          <StatCard title="Clases Hoy" value={classes.filter(c => c.date === new Date().toISOString().split('T')[0]).length} icon={CalendarIcon} color="text-blue-600" bg="bg-blue-100" />
          <StatCard title="Instructores" value={new Set(classes.map(c => c.instructor)).size} icon={User} color="text-green-600" bg="bg-green-100" />
          <StatCard title="Tipos de Clase" value={classTypes.length - 1} icon={Dumbbell} color="text-orange-600" bg="bg-orange-100" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-2 rounded-xl border border-neutral-100 shadow-sm">
          <button 
            onClick={() => setActiveTab('browse')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === 'browse' ? 'bg-purple-500 text-white' : 'text-neutral-500 hover:bg-neutral-50'}`}
          >
            Explorar Clases
          </button>
          <button 
            onClick={() => setActiveTab('mybookings')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === 'mybookings' ? 'bg-purple-500 text-white' : 'text-neutral-500 hover:bg-neutral-50'}`}
          >
            Mis Reservas {myBookings.length > 0 && <span className="ml-2 bg-white/20 px-2 py-0.5 rounded text-xs">{myBookings.length}</span>}
          </button>
        </div>

        {/* CONTENIDO EXPLORAR */}
        {activeTab === 'browse' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Sidebar Filtros */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100">
                <h3 className="font-bold mb-4">Fecha</h3>
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Filter className="w-4 h-4"/> Filtros</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-neutral-500 mb-1 block">Tipo</label>
                    <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full p-2 border rounded-lg bg-white">
                      {classTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-500 mb-1 block">Nivel</label>
                    <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className="w-full p-2 border rounded-lg bg-white">
                      <option value="all">Todos</option>
                      <option value="beginner">Principiante</option>
                      <option value="intermediate">Intermedio</option>
                      <option value="advanced">Avanzado</option>
                    </select>
                  </div>
                  <button onClick={() => { setSelectedType('all'); setSelectedLevel('all'); setSearchTerm(''); }} className="w-full py-2 text-sm text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50">
                    Limpiar Filtros
                  </button>
                </div>
              </div>
            </div>

            {/* Lista Clases */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-2">
                <Search className="text-neutral-400 w-5 h-5" />
                <input 
                  placeholder="Buscar clase o instructor..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full outline-none"
                />
              </div>

              {filteredClasses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-neutral-200">
                  <CalendarIcon className="w-12 h-12 mx-auto text-neutral-300 mb-2" />
                  <p className="text-neutral-500">No hay clases disponibles para esta fecha o filtros.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredClasses.map(session => {
                    const isBooked = userBookings.some(b => b.classId === session.id && b.status === 'confirmed');
                    const isFull = session.booked >= session.capacity;
                    const Icon = classTypes.find(t => t.id === session.type)?.icon || Dumbbell;

                    return (
                      <div 
                        key={session.id} 
                        onClick={() => setSelectedClass(session)}
                        className={`bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:shadow-lg transition-all ${isBooked ? 'border-purple-300 bg-purple-50' : 'border-neutral-100'}`}
                      >
                        <div className="flex gap-4">
                          <div className={`${getClassColor(session.type)} p-4 rounded-xl text-white h-fit`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between mb-2">
                              <div>
                                <h4 className="font-bold text-lg text-neutral-900">{session.name}</h4>
                                <div className="flex items-center gap-2 text-sm text-neutral-500">
                                  <User className="w-4 h-4" /> {session.instructor}
                                </div>
                              </div>
                              {isBooked && <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold h-fit">Reservada</span>}
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-neutral-600 mb-3">
                              <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {session.time}</span>
                              <span className="flex items-center gap-1"><Activity className="w-4 h-4"/> {session.duration} min</span>
                              <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {session.location}</span>
                              <span className={`flex items-center gap-1 font-medium ${session.booked >= session.capacity ? 'text-red-500' : 'text-green-600'}`}>
                                <Users className="w-4 h-4"/> {session.capacity - session.booked} lugares
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${getLevelBadge(session.level).color}`}>{getLevelBadge(session.level).text}</span>
                              {!isBooked && !isFull && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleBookClass(session); }}
                                  className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-600"
                                >
                                  Reservar
                                </button>
                              )}
                              {isFull && !isBooked && <span className="text-red-500 font-bold text-sm">Completa</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONTENIDO MIS RESERVAS */}
        {activeTab === 'mybookings' && (
          <div className="space-y-4">
            {myBookings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-neutral-200">
                <p className="text-neutral-500">No tienes reservas activas.</p>
                <button onClick={() => setActiveTab('browse')} className="mt-4 text-purple-600 font-bold underline">Explorar Clases</button>
              </div>
            ) : (
              myBookings.map(booking => {
                const session = booking.class;
                const Icon = classTypes.find(t => t.id === session.type)?.icon || Dumbbell;
                
                return (
                  <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-sm border border-purple-200">
                    <div className="flex gap-4">
                      <div className={`${getClassColor(session.type)} p-4 rounded-xl text-white h-fit`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-bold text-lg text-neutral-900">{session.name}</h4>
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold h-fit">Confirmada</span>
                        </div>
                        <div className="flex gap-4 text-sm text-neutral-600 mb-3">
                          <span>{session.date}</span>
                          <span>{session.time}</span>
                          <span>{session.location}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-neutral-400">
                          <span>Reservado el {new Date(booking.bookedAt).toLocaleDateString()}</span>
                          <button 
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-red-500 hover:bg-red-50 px-3 py-1 rounded border border-red-200 transition-colors"
                          >
                            Cancelar Reserva
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* MODAL DETALLE DE CLASE */}
        {selectedClass && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedClass(null)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b flex justify-between items-start">
                <div className="flex gap-4 items-center">
                  <div className={`${getClassColor(selectedClass.type)} p-3 rounded-xl text-white`}>
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedClass.name}</h2>
                    <p className="text-neutral-500">Con {selectedClass.instructor}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedClass(null)}><X className="w-6 h-6 text-neutral-400" /></button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-neutral-50 p-3 rounded-lg"><p className="text-neutral-500 text-xs">Fecha</p> <p className="font-bold">{selectedClass.date}</p></div>
                  <div className="bg-neutral-50 p-3 rounded-lg"><p className="text-neutral-500 text-xs">Hora</p> <p className="font-bold">{selectedClass.time}</p></div>
                  <div className="bg-neutral-50 p-3 rounded-lg"><p className="text-neutral-500 text-xs">Duración</p> <p className="font-bold">{selectedClass.duration} min</p></div>
                  <div className="bg-neutral-50 p-3 rounded-lg"><p className="text-neutral-500 text-xs">Ubicación</p> <p className="font-bold">{selectedClass.location}</p></div>
                </div>

                <div>
                  <h4 className="font-bold mb-2">Descripción</h4>
                  <p className="text-neutral-600">{selectedClass.description}</p>
                </div>

                <div>
                  <h4 className="font-bold mb-2">Beneficios</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedClass.benefits.map((b, i) => (
                      <span key={i} className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                        <CheckCircle className="w-3 h-3"/> {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Botón de acción en el modal */}
                <div className="pt-4 border-t flex justify-end gap-3">
                  <button onClick={() => setSelectedClass(null)} className="px-4 py-2 border rounded-lg text-neutral-600 font-bold hover:bg-neutral-50">Cerrar</button>
                  {!userBookings.some(b => b.classId === selectedClass.id && b.status === 'confirmed') && selectedClass.booked < selectedClass.capacity && (
                    <button 
                      onClick={() => handleBookClass(selectedClass)}
                      className="px-6 py-2 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600"
                    >
                      Confirmar Reserva
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// Componente auxiliar simple para tarjetas
const StatCard = ({ title, value, icon: Icon, color, bg }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-between">
    <div>
      <p className="text-sm text-neutral-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
    </div>
    <div className={`p-3 rounded-xl ${bg}`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
  </div>
);

export default RegistroClases;