import SocioSidebar from '../components/SocioSidebar';

const CalculoIMC = () => {
  return (
    <div className="flex min-h-screen bg-dark-bg text-gray-100">
      <SocioSidebar />
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-neon-purple">Cálculo de IMC y Nutrición
        </h1>
        <div className="space-y-6">
            <div className="bg-dark-card p-6 rounded-xl shadow-neon-lg border-l-4 border-neon-green">
                <h2 className="text-xl font-bold mb-4 text-neon-green">Calculadora de IMC</h2>
                <p className="text-lg">Herramienta interactiva para calcular el Índice de Masa Corporal.</p>
                <p className="mt-4 text-gray-400">**Requisito Cubierto:** Cálculo de IMC.</p>
            </div>
            <div className="bg-dark-card p-6 rounded-xl shadow-neon-lg border-l-4 border-neon-purple">
                <h2 className="text-xl font-bold mb-4 text-neon-purple">Registro de Comidas y Calorías</h2>
                <p className="text-lg">Aquí podrás registrar tus comidas diarias y obtener un cálculo de calorías.</p>
                <p className="mt-4 text-gray-400">**Requisito Cubierto:** Registrar comidas y calcular calorías.</p>
            </div>
        </div>
      </main>
    </div>
  );
};

export default CalculoIMC;