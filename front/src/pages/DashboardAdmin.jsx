import AdminSidebar from '../components/AdminSidebar';
import { MOCK_ADMINISTRADOR_STATS } from '../mocks/mockData'; 

const DashboardAdmin = () => {
  return (
    <div className="flex min-h-screen bg-dark-bg">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-neon-green">
            Dashboard de Administración
        </h1>
        
        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {MOCK_ADMINISTRADOR_STATS.map((stat, index) => (
            <div 
              key={index} 
              // Estilos oscuros y neón para tarjetas de estadísticas
              className={`p-6 rounded-xl shadow-lg border-l-4 ${stat.color} bg-dark-card/80 flex items-center justify-between transition-transform hover:scale-[1.02] duration-300 border-neon-purple`}
            >
              <div>
                <h3 className="text-sm font-medium text-gray-400">{stat.title}</h3>
                <p className="text-3xl font-extrabold text-neon-green mt-1">{stat.value}</p>
              </div>
              <span className="text-4xl text-neon-purple">{stat.icon}</span>
            </div>
          ))}
        </div>

        {/* AFORD CHART */}
        <section className="bg-dark-card p-6 rounded-xl shadow-neon-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Afluencia Histórica y Proyectada</h2>
          <div className="h-80 bg-gray-800 border-2 border-dashed border-neon-purple/50 rounded-lg flex items-center justify-center text-gray-400">
             Gráfica de Barras Simulada: Muestra el aforo por hora para ayudar al Staff a gestionar la saturación (Problema identificado: Aglomeración).
          </div>
        </section>

      </main>
    </div>
  );
};

export default DashboardAdmin;