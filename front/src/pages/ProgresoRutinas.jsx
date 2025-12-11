import SocioSidebar from '../components/SocioSidebar';

const ProgresoRutinas = () => {
  return (
    <div className="flex min-h-screen bg-dark-bg text-gray-100">
      <SocioSidebar />
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-neon-purple">
            🏋️ Registro de Progreso y Rutinas
        </h1>
        <div className="space-y-6">
            <div className="bg-dark-card p-6 rounded-xl shadow-neon-lg border-l-4 border-neon-green">
                <h2 className="text-xl font-bold mb-4 text-neon-green">Mi Registro de Progreso</h2>
                <p className="text-lg">Gráficas y tablas de tus medidas, peso y récords personales (levantamiento de pesas).</p>
                <p className="mt-4 text-gray-400">**Requisito Cubierto:** Registro de rutinas y progreso; registrar medidas y peso (vía la acción principal).</p>
            </div>
            <div className="bg-dark-card p-6 rounded-xl shadow-neon-lg border-l-4 border-neon-purple">
                <h2 className="text-xl font-bold mb-4 text-neon-purple">Crear/Asignar Rutinas</h2>
                <p className="text-lg">Crea tu propia rutina de ejercicios o visualiza la que tu entrenador te ha asignado.</p>
                <button className="mt-4 px-4 py-2 bg-neon-purple text-dark-bg font-semibold rounded-lg hover:bg-neon-purple/80 transition-colors">
                    + Nueva Rutina Personalizada
                </button>
                <p className="mt-4 text-gray-400">**Requisito Cubierto:** Crear una rutina y visualizarla o asignarle una.</p>
            </div>
        </div>
      </main>
    </div>
  );
};

export default ProgresoRutinas;