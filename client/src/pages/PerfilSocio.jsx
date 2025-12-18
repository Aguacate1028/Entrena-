import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  User, Mail, Phone, Calendar, MapPin, Edit, Save, 
  CreditCard, Award, TrendingUp, Dumbbell, QrCode, 
  CheckCircle, Clock, Target, Zap, Heart, Activity, X
} from 'lucide-react';

const PerfilSocio = () => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal'); // Estado para manejar las pestañas manualmente

  // Estado inicial con datos por defecto o del contexto
  const initialData = {
    name: user?.nombre || 'Usuario',
    email: user?.email || 'usuario@ejemplo.com',
    phone: '+52 55 1234 5678',
    birthdate: '1995-06-15',
    address: 'Ciudad de México, México',
    memberSince: '2024-01-01',
    membershipType: 'premium',
    membershipExpiry: '2025-01-01',
    emergencyContact: 'María Pérez',
    emergencyPhone: '+52 55 9876 5432',
    goals: ['Pérdida de peso', 'Ganar músculo', 'Mejorar resistencia'],
    height: 175,
    weight: 70
  };

  const [userData, setUserData] = useState(initialData);
  const [editData, setEditData] = useState(initialData);

  // Cargar datos de localStorage si existen
  useEffect(() => {
    const savedData = localStorage.getItem('userProfile');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setUserData(parsed);
      setEditData(parsed);
    }
  }, []);

  const handleSave = () => {
    setUserData(editData);
    localStorage.setItem('userProfile', JSON.stringify(editData));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const getMembershipInfo = (type) => {
    switch (type) {
      case 'basic': return { name: 'Básica', color: 'bg-blue-500', icon: Zap };
      case 'premium': return { name: 'Premium', color: 'bg-purple-500', icon: Award };
      case 'vip': return { name: 'VIP', color: 'bg-amber-500', icon: Award };
      default: return { name: 'Básica', color: 'bg-blue-500', icon: Zap };
    }
  };

  const membershipInfo = getMembershipInfo(userData.membershipType);
  const MembershipIcon = membershipInfo.icon;

  const getDaysRemaining = () => {
    const today = new Date();
    const expiry = new Date(userData.membershipExpiry);
    const diff = expiry.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'US';
  };

  const daysRemaining = getDaysRemaining();
  const membershipProgress = Math.min(100, Math.max(0, ((365 - daysRemaining) / 365) * 100));

  const stats = {
    totalWorkouts: 45,
    totalDays: 32,
    avgDuration: 65,
    caloriesBurned: 12450
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header del Perfil */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
              <Dumbbell className="w-64 h-64" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-purple-700 flex items-center justify-center text-3xl font-bold">
                {getInitials(userData.name)}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{userData.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-3">
                  <span className={`${membershipInfo.color} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm`}>
                    <MembershipIcon className="w-3 h-3" /> Membresía {membershipInfo.name}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
                    <Calendar className="w-3 h-3" /> Miembro desde {new Date(userData.memberSince).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-center md:justify-start items-center gap-4 text-sm opacity-90">
                  <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {userData.email}</span>
                  <span className="hidden md:inline">•</span>
                  <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {userData.phone}</span>
                </div>
              </div>

              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="bg-white text-purple-600 hover:bg-purple-50 px-6 py-2 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-md"
              >
                {isEditing ? <><Save className="w-4 h-4" /> Guardar</> : <><Edit className="w-4 h-4" /> Editar</>}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna Izquierda - Stats y Tarjeta */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Tarjeta de Membresía Digital */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
              <div className={`${membershipInfo.color} p-6 text-white`}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg"><CreditCard className="w-5 h-5" /></div>
                    <div>
                      <p className="text-xs opacity-80 uppercase tracking-wider">Membresía</p>
                      <p className="font-bold text-lg">{membershipInfo.name}</p>
                    </div>
                  </div>
                  <QrCode className="w-12 h-12 opacity-50" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="opacity-90">Vence en</span>
                    <span>{daysRemaining} días</span>
                  </div>
                  <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white/90 rounded-full" style={{ width: `${membershipProgress}%` }}></div>
                  </div>
                  <p className="text-xs opacity-75 text-right">Válida hasta {new Date(userData.membershipExpiry).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="p-6 bg-neutral-50 flex flex-col items-center justify-center text-center">
                <div className="p-3 bg-white border-2 border-dashed border-purple-200 rounded-xl mb-3">
                   <QrCode className="w-24 h-24 text-purple-600" />
                </div>
                <p className="text-xs text-neutral-400 font-mono">ID: {Date.now().toString().slice(-8)}</p>
                <p className="text-xs text-neutral-500 mt-1">Escanea para acceder al gimnasio</p>
              </div>
            </div>

            {/* Estadísticas Rápidas */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
              <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-500" /> Estadísticas
              </h3>
              <div className="space-y-3">
                <StatRow icon={Dumbbell} label="Entrenamientos" value={stats.totalWorkouts} color="text-purple-600" bg="bg-purple-50" />
                <StatRow icon={Calendar} label="Días activos" value={stats.totalDays} color="text-orange-600" bg="bg-orange-50" />
                <StatRow icon={Clock} label="Duración media" value={`${stats.avgDuration} min`} color="text-blue-600" bg="bg-blue-50" />
                <StatRow icon={Heart} label="Calorías" value={stats.caloriesBurned.toLocaleString()} color="text-green-600" bg="bg-green-50" />
              </div>
            </div>

            {/* Objetivos */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
              <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" /> Objetivos
              </h3>
              <div className="space-y-2">
                {userData.goals.map((goal, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-neutral-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-purple-500 shrink-0" />
                    <span className="text-sm text-neutral-700 font-medium">{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna Derecha - Formulario */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
              <div className="p-6 border-b border-neutral-100">
                <h2 className="text-xl font-bold text-neutral-900">Información Personal</h2>
                <p className="text-sm text-neutral-500">{isEditing ? 'Actualiza tu información personal' : 'Tus datos personales detallados'}</p>
              </div>
              
              <div className="p-6">
                {/* Navegación de Pestañas */}
                <div className="flex border-b border-neutral-200 mb-6">
                  <TabButton id="personal" label="Personal" activeTab={activeTab} setActiveTab={setActiveTab} />
                  <TabButton id="health" label="Salud" activeTab={activeTab} setActiveTab={setActiveTab} />
                  <TabButton id="emergency" label="Emergencia" activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                {/* Contenido Pestañas */}
                <div className="space-y-6">
                  
                  {activeTab === 'personal' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field label="Nombre Completo" id="name" icon={User} value={isEditing ? editData.name : userData.name} isEditing={isEditing} onChange={(e) => setEditData({...editData, name: e.target.value})} />
                      <Field label="Email" id="email" icon={Mail} value={isEditing ? editData.email : userData.email} isEditing={isEditing} type="email" onChange={(e) => setEditData({...editData, email: e.target.value})} />
                      <Field label="Teléfono" id="phone" icon={Phone} value={isEditing ? editData.phone : userData.phone} isEditing={isEditing} onChange={(e) => setEditData({...editData, phone: e.target.value})} />
                      <Field label="Fecha Nacimiento" id="birthdate" icon={Calendar} value={isEditing ? editData.birthdate : userData.birthdate} isEditing={isEditing} type="date" onChange={(e) => setEditData({...editData, birthdate: e.target.value})} />
                      <div className="md:col-span-2">
                        <Field label="Dirección" id="address" icon={MapPin} value={isEditing ? editData.address : userData.address} isEditing={isEditing} onChange={(e) => setEditData({...editData, address: e.target.value})} />
                      </div>
                    </div>
                  )}

                  {activeTab === 'health' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field label="Altura (cm)" id="height" icon={TrendingUp} value={isEditing ? editData.height : userData.height} isEditing={isEditing} type="number" onChange={(e) => setEditData({...editData, height: parseFloat(e.target.value)})} />
                      <Field label="Peso (kg)" id="weight" icon={TrendingUp} value={isEditing ? editData.weight : userData.weight} isEditing={isEditing} type="number" onChange={(e) => setEditData({...editData, weight: parseFloat(e.target.value)})} />
                      
                      <div className="md:col-span-2 bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-neutral-600 mb-1">IMC Actual</p>
                          <p className="text-3xl font-bold text-purple-600">{(userData.weight / Math.pow(userData.height / 100, 2)).toFixed(1)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-neutral-500 mb-1">Categoría</p>
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">Peso Saludable</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'emergency' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field label="Contacto Emergencia" id="emergencyContact" icon={User} value={isEditing ? editData.emergencyContact : userData.emergencyContact} isEditing={isEditing} onChange={(e) => setEditData({...editData, emergencyContact: e.target.value})} />
                        <Field label="Teléfono Emergencia" id="emergencyPhone" icon={Phone} value={isEditing ? editData.emergencyPhone : userData.emergencyPhone} isEditing={isEditing} onChange={(e) => setEditData({...editData, emergencyPhone: e.target.value})} />
                      </div>
                      <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-800 flex gap-3">
                         <Activity className="w-5 h-5 shrink-0" />
                         <p><strong>Importante:</strong> Esta información será utilizada únicamente por el personal del gimnasio en caso de accidente o emergencia médica.</p>
                      </div>
                    </div>
                  )}

                  {isEditing && (
                    <div className="pt-6 mt-6 border-t border-neutral-100 flex gap-4">
                      <button onClick={handleSave} className="flex-1 bg-purple-500 text-white py-3 rounded-xl font-bold hover:bg-purple-600 transition-colors flex justify-center items-center gap-2">
                        <Save className="w-4 h-4" /> Guardar Cambios
                      </button>
                      <button onClick={handleCancel} className="flex-1 bg-neutral-100 text-neutral-600 py-3 rounded-xl font-bold hover:bg-neutral-200 transition-colors flex justify-center items-center gap-2">
                        <X className="w-4 h-4" /> Cancelar
                      </button>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componentes auxiliares para limpieza del código
const StatRow = ({ icon: Icon, label, value, color, bg }) => (
  <div className={`flex items-center justify-between p-3 ${bg} rounded-xl`}>
    <div className="flex items-center gap-3">
      <Icon className={`w-4 h-4 ${color}`} />
      <span className="text-sm font-medium text-neutral-700">{label}</span>
    </div>
    <span className={`font-bold ${color}`}>{value}</span>
  </div>
);

const TabButton = ({ id, label, activeTab, setActiveTab }) => (
  <button 
    onClick={() => setActiveTab(id)}
    className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${
      activeTab === id ? 'border-purple-500 text-purple-600' : 'border-transparent text-neutral-400 hover:text-neutral-600'
    }`}
  >
    {label}
  </button>
);

const Field = ({ label, id, icon: Icon, value, isEditing, type = "text", onChange }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-xs font-bold text-neutral-500 uppercase tracking-wide">{label}</label>
    {isEditing ? (
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input 
          id={id} type={type} value={value} onChange={onChange}
          className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
        />
      </div>
    ) : (
      <div className="flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-100 rounded-lg text-neutral-800 font-medium text-sm">
        <Icon className="w-4 h-4 text-neutral-400" />
        {type === 'date' ? new Date(value).toLocaleDateString() : value}
      </div>
    )}
  </div>
);

export default PerfilSocio;