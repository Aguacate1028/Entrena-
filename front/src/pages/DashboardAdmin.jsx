import AdminSidebar from '../components/AdminSidebar';
import { MOCK_administrador_STATS } from '../mocks/mockData';

const DashboardAdmin = () => {
  return (
    <div className="flex min-h-screen bg-gray-900">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8">

        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-green-400">
            Dashboard de Administración
        </h1>
        
        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {MOCK_administrador_STATS.map((stat, index) => (
            <div 
              key={index} 

              className={`p-6 rounded-xl shadow-lg border-l-4 ${stat.color} bg-gray-800 flex items-center justify-between transition-transform hover:scale-[1.02] duration-300 border-blue-400`}
            >
              <div>
                <h3 className="text-sm font-medium text-gray-400">{stat.title}</h3>
           
                <p className="text-3xl font-extrabold text-green-400 mt-1">{stat.value}</p>
              </div>
              <span className="text-4xl text-blue-400">{stat.icon}</span>
            </div>
          ))}
        </div>

        {/* AFORD CHART */}

        <section className="bg-gray-800 p-6 rounded-xl shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Afluencia Histórica y Proyectada</h2>

          <div className="h-80 bg-gray-700 border-2 border-dashed border-blue-400/50 rounded-lg flex items-center justify-center text-gray-400">
             Gráfica de Barras Simulada: Muestra el aforo por hora para ayudar al Staff a gestionar la saturación (Problema identificado: Aglomeración).
          </div>
        </section>

      </main>
    </div>
  );
};

export default DashboardAdmin;