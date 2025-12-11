import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MOCK_SOCIO_DATA } from '../mocks/mockData';
import SocioSidebar from '../components/SocioSidebar'; 

const DashboardSocio = () => {
  const { user, logout } = useContext(AuthContext);
  
  const mockSocio = MOCK_SOCIO_DATA;

  const Card = ({ children, title, icon, colorClass = 'border-neon-purple' }) => (
      <div className={`bg-dark-card p-6 rounded-xl shadow-neon-lg border-l-4 ${colorClass}`}>
          <h2 className="text-xl font-bold mb-4 text-neon-green flex items-center">
              <span className="mr-2 text-2xl">{icon}</span> {title}
          </h2>
          {children}
      </div>
  );


  return (
    <div className="flex min-h-screen bg-dark-bg text-gray-100">
      <SocioSidebar /> {/* Nuevo Sidebar */}
      <main className="flex-1 p-4 md:p-8">
        <header className="pb-4 mb-6 border-b border-gray-700">
            <h1 className="text-3xl md:text-4xl font-extrabold text-neon-purple">
                👋 Bienvenido, **{user?.nombre || 'Socio Entrena+'}**!
            </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Tarjeta 1: Acceso Rápido y Membresía */}
          <Card title="Membresía y Acceso" icon="✅" colorClass="border-neon-purple lg:col-span-1">
            <div className="w-40 h-40 mx-auto my-6 bg-gray-800 border-4 border-neon-green rounded-lg flex items-center justify-center text-neon-green text-sm font-mono shadow-inner">
                Código QR Dinámico (ID: {user?.id})
            </div>
            
            <p className="text-lg font-semibold mt-4">Tipo: {mockSocio.membresia.tipo}</p>
            <p className="text-md text-gray-400">
              Vencimiento: <span className="font-bold text-red-500">{mockSocio.membresia.vence}</span>
            </p>
            <button className="mt-4 w-full py-2 bg-neon-green text-dark-bg font-semibold rounded-lg hover:bg-neon-green/80 transition-colors shadow-md">
              Pagar / Renovar Ahora
            </button>
          </Card>

          {/* Columna de Widgets (Aforo y Progreso) */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Tarjeta Aforo (Requisito: ver que tan concurrido está) */}
              <Card title="Afluencia Actual del Gimnasio" icon="🏃" colorClass="border-neon-purple">
                  <p className="text-5xl font-extrabold text-neon-purple">
                      {mockSocio.aforo.actual} <span className="text-xl font-normal text-gray-400">/ {mockSocio.aforo.maximo}</span>
                  </p>
                  <p className={`text-sm mt-1 font-semibold ${mockSocio.aforo.trend === 'Alto' ? 'text-red-500' : 'text-neon-green'}`}>
                      Tendencia: **{mockSocio.aforo.trend}**
                  </p>
                  <button className="mt-4 w-full py-2 text-neon-green border border-neon-green hover:bg-neon-green/10 rounded-lg transition-colors">
                      Ver Horario Completo
                  </button>
              </Card>
              
              {/* Tarjeta Progreso (Requisito: registrar medidas, peso, registro rutinas/progreso) */}
              <Card title="Mis Datos y Progreso" icon="📈" colorClass="border-neon-green">
                  <div className="text-lg space-y-2">
                      <p>Peso: <span className="font-semibold text-neon-green">{mockSocio.progreso.peso}</span></p>
                      <p>IMC: <span className="font-semibold text-neon-green">{mockSocio.progreso.imc}</span></p>
                      <p className="flex items-center">Locker Asignado: <span className="font-semibold text-neon-purple ml-2">{mockSocio.locker}</span></p>
                  </div>
                  <button className="mt-4 w-full py-2 bg-neon-purple text-dark-bg font-semibold rounded-lg hover:bg-neon-purple/80 transition-colors">
                      Registrar Nuevas Medidas/Peso
                  </button>
              </Card>
              
              {/* Módulo de Clases - Extendido (Requisito: registrarse en clase) */}
              <div className="lg:col-span-2">
                  <Card title="Próximas Clases y Rutinas" icon="📅">
                      <ul className="space-y-3">
                          <li className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                              <span>**Zumba** (18:00 - 19:00) - Instructor Diana</span>
                              <button className="px-3 py-1 bg-neon-green text-dark-bg text-sm rounded-full hover:bg-neon-green/80 transition-colors">Reservar</button>
                          </li>
                          <li className="flex justify-between items-center p-3 bg-gray-800 rounded-lg opacity-50">
                              <span>**Yoga Funcional** (19:00 - 20:00) - Cupo Lleno</span>
                              <button disabled className="px-3 py-1 bg-gray-600 text-white text-sm rounded-full cursor-not-allowed">Lleno</button>
                          </li>
                          <li className="flex justify-between items-center p-3 bg-neon-purple/20 border border-neon-purple rounded-lg font-bold">
                              <span>🏋️ **Mi Rutina de Hoy:** Pierna Pesada</span>
                              <button className="px-3 py-1 bg-neon-purple text-dark-bg text-sm rounded-full hover:bg-neon-purple/80">Ver Rutina</button>
                          </li>
                      </ul>
                  </Card>
              </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardSocio;