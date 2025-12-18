import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Calculator, Dumbbell, TrendingUp, Award, Calendar, Target, 
  Trophy, Flame, Star, Plus, Check, X, Trash2
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Componente simple de Barra de Progreso
const SimpleProgress = ({ value, className }) => (
  <div className={`w-full bg-neutral-200 rounded-full h-2.5 ${className}`}>
    <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${value}%` }}></div>
  </div>
);

const ProgresoRutinas = () => {
  const { user } = useContext(AuthContext);
  const userName = user?.nombre || "Atleta";

  // Estados para IMC
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiHistory, setBmiHistory] = useState([]);
  const [currentBMI, setCurrentBMI] = useState(null);

  // Estados para rutinas
  const [workouts, setWorkouts] = useState([]);
  const [showNewWorkout, setShowNewWorkout] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState({ name: '', sets: '', reps: '', weight: '' });

  // Estado para Tabs manuales
  const [activeTab, setActiveTab] = useState('bmi');

  // Estados para logros
  const [achievements, setAchievements] = useState([
    { id: '1', title: 'Primera Rutina', description: 'Completa tu primera rutina', icon: 'dumbbell', unlocked: false, progress: 0, target: 1 },
    { id: '2', title: 'Racha de 7 días', description: 'Entrena 7 días seguidos', icon: 'flame', unlocked: false, progress: 0, target: 7 },
    { id: '3', title: 'IMC Saludable', description: 'Alcanza un IMC entre 18.5 y 24.9', icon: 'target', unlocked: false },
    { id: '4', title: '10 Rutinas', description: 'Completa 10 rutinas totales', icon: 'trophy', unlocked: false, progress: 0, target: 10 },
    { id: '5', title: 'Transformación', description: 'Registra progreso por 30 días', icon: 'star', unlocked: false, progress: 0, target: 30 },
    { id: '6', title: 'Consistencia', description: 'Entrena 20 días al mes', icon: 'calendar', unlocked: false, progress: 0, target: 20 }
  ]);

  // Cargar datos del localStorage
  useEffect(() => {
    const savedBMI = localStorage.getItem('bmiHistory');
    const savedWorkouts = localStorage.getItem('workouts');
    const savedAchievements = localStorage.getItem('achievements');

    if (savedBMI) {
        const parsedBMI = JSON.parse(savedBMI);
        setBmiHistory(parsedBMI);
        if(parsedBMI.length > 0) setCurrentBMI(parsedBMI[parsedBMI.length - 1].bmi);
    }
    if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
  }, []);

  // Guardar datos en localStorage
  useEffect(() => { localStorage.setItem('bmiHistory', JSON.stringify(bmiHistory)); }, [bmiHistory]);
  
  useEffect(() => { 
    localStorage.setItem('workouts', JSON.stringify(workouts)); 
    checkAchievements();
  }, [workouts]);
  
  useEffect(() => { localStorage.setItem('achievements', JSON.stringify(achievements)); }, [achievements]);

  // Calcular IMC
  const calculateBMI = () => {
    if (!height || !weight) return;
    
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    const bmiFixed = parseFloat(bmi.toFixed(1));
    
    const newRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-MX'), // Formato simple fecha
      weight: weightInKg,
      height: parseFloat(height),
      bmi: bmiFixed
    };

    setBmiHistory([...bmiHistory, newRecord]);
    setCurrentBMI(bmiFixed);
    checkBMIAchievement(bmiFixed);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { text: 'Bajo peso', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (bmi < 25) return { text: 'Normal', color: 'text-green-600', bg: 'bg-green-100' };
    if (bmi < 30) return { text: 'Sobrepeso', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { text: 'Obesidad', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const addExercise = () => {
    if (!currentExercise.name || !currentExercise.sets || !currentExercise.reps) return;
    setExercises([...exercises, { ...currentExercise }]);
    setCurrentExercise({ name: '', sets: '', reps: '', weight: '' });
  };

  const saveWorkout = () => {
    if (!newWorkoutName || exercises.length === 0) return;
    const newWorkout = {
      id: Date.now().toString(),
      name: newWorkoutName,
      exercises: exercises,
      date: new Date().toLocaleDateString('es-MX'),
      completed: false
    };
    setWorkouts([newWorkout, ...workouts]);
    setNewWorkoutName('');
    setExercises([]);
    setShowNewWorkout(false);
  };

  const toggleWorkoutComplete = (id) => {
    setWorkouts(workouts.map(w => w.id === id ? { ...w, completed: !w.completed } : w));
  };

  const deleteWorkout = (id) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  const checkAchievements = () => {
    const completedWorkouts = workouts.filter(w => w.completed);
    setAchievements(prev => prev.map(achievement => {
      if (achievement.id === '1' && completedWorkouts.length >= 1 && !achievement.unlocked) {
        return { ...achievement, unlocked: true, unlockedDate: new Date().toLocaleDateString() };
      }
      if (achievement.id === '4') {
        const progress = completedWorkouts.length;
        return { ...achievement, progress, unlocked: progress >= 10 };
      }
      return achievement;
    }));
  };

  const checkBMIAchievement = (bmi) => {
    if (bmi >= 18.5 && bmi <= 24.9) {
      setAchievements(prev => prev.map(a => a.id === '3' ? { ...a, unlocked: true } : a));
    }
  };

  // Datos para gráficos
  const weightChartData = bmiHistory.slice(-10).map(r => ({ date: r.date, peso: r.weight, imc: r.bmi }));
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Mi Progreso</h1>
          <p className="text-neutral-600">Bienvenido de vuelta, {userName}. Aquí está tu resumen.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="IMC Actual" value={currentBMI || '--'} icon={Calculator} color="bg-purple-100 text-purple-600" />
          <StatCard title="Rutinas" value={workouts.length} icon={Dumbbell} color="bg-blue-100 text-blue-600" />
          <StatCard title="Completadas" value={workouts.filter(w => w.completed).length} icon={TrendingUp} color="bg-green-100 text-green-600" />
          <StatCard title="Logros" value={`${unlockedAchievements}/${achievements.length}`} icon={Award} color="bg-yellow-100 text-yellow-600" />
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-neutral-100 mb-6 flex overflow-x-auto">
           {['bmi', 'workouts', 'progress', 'achievements'].map(tab => (
               <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${
                    activeTab === tab 
                    ? 'bg-purple-500 text-white shadow-md' 
                    : 'text-neutral-500 hover:bg-neutral-50'
                }`}
               >
                   {tab === 'bmi' && 'Calculadora IMC'}
                   {tab === 'workouts' && 'Rutinas'}
                   {tab === 'progress' && 'Gráficos'}
                   {tab === 'achievements' && 'Logros'}
               </button>
           ))}
        </div>

        {/* CONTENIDO TABS */}

        {/* 1. CALCULADORA IMC */}
        {activeTab === 'bmi' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Calculator className="w-5 h-5 text-purple-500"/> Calculadora</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Altura (cm)</label>
                        <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="175" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Peso (kg)</label>
                        <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="70" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                    </div>
                    <button onClick={calculateBMI} className="w-full bg-purple-500 text-white py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors">Calcular IMC</button>
                    
                    {currentBMI && (
                        <div className={`mt-4 p-4 rounded-lg text-center ${getBMICategory(currentBMI).bg}`}>
                            <p className="text-neutral-600 text-sm">Tu IMC es:</p>
                            <p className="text-4xl font-bold text-neutral-900 my-2">{currentBMI}</p>
                            <p className={`font-bold ${getBMICategory(currentBMI).color}`}>{getBMICategory(currentBMI).text}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                <h3 className="font-bold text-lg mb-4">Historial Reciente</h3>
                {bmiHistory.length > 0 ? (
                    <div className="space-y-3">
                        {bmiHistory.slice(-5).reverse().map(record => (
                            <div key={record.id} className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                                <div>
                                    <p className="font-bold text-neutral-800">{record.date}</p>
                                    <p className="text-xs text-neutral-500">{record.weight}kg • {record.height}cm</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getBMICategory(record.bmi).bg} ${getBMICategory(record.bmi).color}`}>
                                    IMC {record.bmi}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-neutral-400">Sin historial aún</div>
                )}
            </div>
          </div>
        )}

        {/* 2. RUTINAS */}
        {activeTab === 'workouts' && (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-neutral-900">Mis Rutinas</h3>
                        <p className="text-sm text-neutral-500">Gestiona tus entrenamientos diarios</p>
                    </div>
                    <button onClick={() => setShowNewWorkout(!showNewWorkout)} className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-600 transition-colors">
                        <Plus className="w-4 h-4" /> Nueva Rutina
                    </button>
                </div>

                {showNewWorkout && (
                    <div className="bg-white p-6 rounded-2xl border-2 border-purple-100 shadow-lg">
                        <h4 className="font-bold text-lg mb-4">Crear Nueva Rutina</h4>
                        <input value={newWorkoutName} onChange={e => setNewWorkoutName(e.target.value)} placeholder="Nombre de la rutina (ej: Día de Pierna)" className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 outline-none" />
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                            <input value={currentExercise.name} onChange={e => setCurrentExercise({...currentExercise, name: e.target.value})} placeholder="Ejercicio" className="p-2 border rounded" />
                            <input value={currentExercise.sets} onChange={e => setCurrentExercise({...currentExercise, sets: e.target.value})} placeholder="Series" type="number" className="p-2 border rounded" />
                            <input value={currentExercise.reps} onChange={e => setCurrentExercise({...currentExercise, reps: e.target.value})} placeholder="Reps" type="number" className="p-2 border rounded" />
                            <input value={currentExercise.weight} onChange={e => setCurrentExercise({...currentExercise, weight: e.target.value})} placeholder="Kg (opcional)" type="number" className="p-2 border rounded" />
                        </div>
                        <button onClick={addExercise} className="w-full py-2 border border-dashed border-neutral-300 rounded-lg text-neutral-500 hover:bg-neutral-50 mb-4">+ Agregar Ejercicio</button>

                        {exercises.length > 0 && (
                            <div className="mb-4 bg-neutral-50 p-4 rounded-lg space-y-2">
                                {exercises.map((ex, idx) => (
                                    <div key={idx} className="text-sm flex justify-between">
                                        <span>• {ex.name} ({ex.sets}x{ex.reps})</span>
                                        <button onClick={() => setExercises(exercises.filter((_, i) => i !== idx))} className="text-red-500 hover:underline">Borrar</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button onClick={saveWorkout} className="flex-1 bg-purple-500 text-white py-2 rounded-lg font-bold">Guardar Rutina</button>
                            <button onClick={() => setShowNewWorkout(false)} className="flex-1 bg-neutral-100 text-neutral-600 py-2 rounded-lg font-bold">Cancelar</button>
                        </div>
                    </div>
                )}

                <div className="grid gap-4">
                    {workouts.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-neutral-300">
                            <Dumbbell className="w-12 h-12 mx-auto text-neutral-300 mb-2" />
                            <p className="text-neutral-500">No hay rutinas creadas</p>
                        </div>
                    ) : (
                        workouts.map(workout => (
                            <div key={workout.id} className={`bg-white p-6 rounded-2xl shadow-sm border transition-colors ${workout.completed ? 'border-green-200 bg-green-50/30' : 'border-neutral-100'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-lg text-neutral-900">{workout.name}</h4>
                                            {workout.completed && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><Check className="w-3 h-3"/> Completada</span>}
                                        </div>
                                        <p className="text-xs text-neutral-500">{workout.date} • {workout.exercises.length} ejercicios</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => toggleWorkoutComplete(workout.id)} className={`p-2 rounded-lg border ${workout.completed ? 'bg-white border-green-200 text-green-600' : 'bg-white border-neutral-200 text-neutral-400 hover:text-green-600'}`}>
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => deleteWorkout(workout.id)} className="p-2 rounded-lg bg-white border border-neutral-200 text-neutral-400 hover:text-red-500 hover:border-red-200">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {workout.exercises.map((ex, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-sm p-2 bg-white/60 rounded border border-neutral-100">
                                            <div className="flex items-center gap-2">
                                                <Dumbbell className="w-3 h-3 text-purple-400" />
                                                <span className="font-medium text-neutral-700">{ex.name}</span>
                                            </div>
                                            <span className="text-neutral-500 text-xs">{ex.sets} sets × {ex.reps} reps {ex.weight && `(${ex.weight}kg)`}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}

        {/* 3. GRÁFICOS */}
        {activeTab === 'progress' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-purple-500"/> Evolución de Peso</h3>
                    {weightChartData.length > 0 ? (
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weightChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis domain={['auto', 'auto']} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="peso" stroke="#8b5cf6" fill="#ddd6fe" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-neutral-400">Sin datos suficientes</div>
                    )}
                </div>
             </div>
        )}

        {/* 4. LOGROS */}
        {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map(achievement => {
                     const Icon = achievement.icon === 'dumbbell' ? Dumbbell : achievement.icon === 'flame' ? Flame : achievement.icon === 'target' ? Target : achievement.icon === 'trophy' ? Trophy : achievement.icon === 'star' ? Star : Calendar;
                     return (
                        <div key={achievement.id} className={`p-6 rounded-2xl border transition-all ${achievement.unlocked ? 'bg-white border-purple-200 shadow-sm' : 'bg-neutral-50 border-neutral-100 opacity-70'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${achievement.unlocked ? 'bg-purple-500 text-white' : 'bg-neutral-200 text-neutral-400'}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                {achievement.unlocked && <BadgeCheck className="text-green-500 w-6 h-6" />}
                            </div>
                            <h4 className="font-bold text-neutral-900">{achievement.title}</h4>
                            <p className="text-sm text-neutral-500 mb-3">{achievement.description}</p>
                            {achievement.target && (
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-neutral-400">
                                        <span>Progreso</span>
                                        <span>{achievement.progress}/{achievement.target}</span>
                                    </div>
                                    <SimpleProgress value={Math.min((achievement.progress / achievement.target) * 100, 100)} className="h-1.5" />
                                </div>
                            )}
                        </div>
                     );
                })}
            </div>
        )}

      </div>
    </div>
  );
};

// Componente auxiliar para tarjetas de estadísticas
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-between">
    <div>
      <p className="text-sm text-neutral-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
    </div>
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

// Icono auxiliar
const BadgeCheck = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
);

export default ProgresoRutinas;