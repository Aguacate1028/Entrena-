import SocioSidebar from '../components/SocioSidebar';

const ManualMaquinas = () => {
  return (
    <div className="flex min-h-screen bg-dark-bg text-gray-100">
      <SocioSidebar />
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-neon-purple">
            📚 Guía de Máquinas y Centro de Ayuda
        </h1>
        <div className="bg-dark-card p-6 rounded-xl shadow-neon-lg border-l-4 border-neon-green">
            <h2 className="text-xl font-bold mb-4 text-neon-green">Video-Tutoriales de Equipo</h2>
            <p className="text-lg">Videos y manuales paso a paso sobre cómo usar correctamente cada máquina del gimnasio.</p>
            <p className="mt-4 text-gray-400">**Requisito Cubierto:** Apartado de ayuda donde se visualice cómo usar las máquinas.</p>
        </div>
      </main>
    </div>
  );
};

export default ManualMaquinas;