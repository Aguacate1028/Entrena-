import SocioSidebar from '../components/SocioSidebar';

const RegistroClases = () => {
  return (
    <div className="flex min-h-screen bg-dark-bg text-gray-100">
      <SocioSidebar />
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-neon-purple">Registro a Clases Grupales
        </h1>
        <div className="bg-dark-card p-6 rounded-xl shadow-neon-lg border-l-4 border-neon-green">
            <p className="text-lg">Visualiza el horario completo de clases (Zumba, Yoga, etc.) y regístrate para asegurar tu cupo.</p>
            <p className="mt-4 text-gray-400">**Requisito Cubierto:** Puede registrarse en una clase (zumba, yoga, etc.).</p>
        </div>
      </main>
    </div>
  );
};

export default RegistroClases;