import SocioSidebar from '../components/SocioSidebar';

const PerfilSocio = () => {
  return (
    <div className="flex min-h-screen bg-dark-bg text-gray-100">
      <SocioSidebar />
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-neon-purple">
            👤 Mi Perfil y Red Social
        </h1>
        <div className="bg-dark-card p-6 rounded-xl shadow-neon-lg border-l-4 border-neon-green">
            <p className="text-lg">Gestión de datos personales, foto de perfil y muro de actividad (Simulación de Red Social para Socios).</p>
            <p className="mt-4 text-gray-400">**Requisito Cubierto:** Perfil para Red Social.</p>
        </div>
      </main>
    </div>
  );
};

export default PerfilSocio;