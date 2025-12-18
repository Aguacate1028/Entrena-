import React, { useState } from 'react';
import { 
  Dumbbell, Target, AlertCircle, CheckCircle, PlayCircle, Info, 
  TrendingUp, User, Zap, Heart, Search, ChevronRight, Star, 
  Clock, Repeat, ArrowRight, X, UserCheck
} from 'lucide-react';

const ManualMaquinas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [userLevel, setUserLevel] = useState('beginner');
  const [assignedRoutine, setAssignedRoutine] = useState(null);
  const [activeTab, setActiveTab] = useState('guide'); // Estado para las pestañas

  const machines = [
    {
      id: '1',
      name: 'Cinta de Correr',
      category: 'cardio',
      difficulty: 'beginner',
      targetMuscles: ['Piernas', 'Cardiovascular'],
      description: 'Máquina para ejercicio cardiovascular que simula correr o caminar.',
      instructions: [
        'Sube a la cinta con cuidado usando los pasamanos',
        'Comienza con velocidad baja (2-3 km/h)',
        'Aumenta gradualmente la velocidad según tu nivel',
        'Mantén una postura erguida, mirando al frente',
        'Usa el botón de emergencia si es necesario',
        'Desacelera progresivamente antes de bajar'
      ],
      tips: [
        'Calienta caminando 5 minutos antes de correr',
        'Mantén los brazos relajados, moviéndolos naturalmente',
        'Respira de forma constante y profunda',
        'Usa calzado deportivo apropiado'
      ],
      warnings: [
        'No saltes mientras la cinta está en movimiento',
        'Mantén las manos alejadas de las partes móviles',
        'No uses la cinta descalzo'
      ],
      sets: 1,
      reps: '20-30 min'
    },
    {
      id: '2',
      name: 'Press de Pecho',
      category: 'pecho',
      difficulty: 'beginner',
      targetMuscles: ['Pectorales', 'Tríceps', 'Hombros'],
      description: 'Máquina para fortalecer el pecho mediante empuje horizontal.',
      instructions: [
        'Ajusta el asiento para que las manijas estén a la altura del pecho',
        'Apoya la espalda completamente en el respaldo',
        'Agarra las manijas con agarre firme',
        'Empuja hacia adelante exhalando',
        'Regresa controladamente inhalando',
        'No bloquees completamente los codos'
      ],
      tips: [
        'Mantén los pies firmes en el suelo',
        'No arquees la espalda',
        'Controla el movimiento en todo momento',
        'Empieza con peso ligero para aprender la técnica'
      ],
      warnings: [
        'No uses impulso para mover el peso',
        'No dejes caer el peso bruscamente',
        'Ajusta siempre el peso antes de comenzar'
      ],
      sets: 3,
      reps: '10-12'
    },
    {
      id: '3',
      name: 'Remo Sentado',
      category: 'espalda',
      difficulty: 'beginner',
      targetMuscles: ['Espalda', 'Bíceps', 'Hombros posteriores'],
      description: 'Máquina para fortalecer la espalda mediante tracción horizontal.',
      instructions: [
        'Siéntate con el pecho contra el soporte',
        'Ajusta el asiento para alcanzar las manijas cómodamente',
        'Agarra las manijas con los brazos extendidos',
        'Tira hacia ti juntando los omóplatos',
        'Mantén 1 segundo y regresa controladamente',
        'Mantén el pecho pegado al soporte'
      ],
      tips: [
        'Piensa en juntar los omóplatos, no solo doblar los brazos',
        'Mantén la cabeza alineada con la columna',
        'No uses el impulso del cuerpo',
        'Exhala al tirar, inhala al regresar'
      ],
      warnings: [
        'No arquees la espalda excesivamente',
        'No tires con los brazos solamente',
        'Evita movimientos bruscos'
      ],
      sets: 3,
      reps: '10-12'
    },
    {
      id: '4',
      name: 'Extensión de Piernas',
      category: 'piernas',
      difficulty: 'beginner',
      targetMuscles: ['Cuádriceps'],
      description: 'Máquina aislada para fortalecer los cuádriceps.',
      instructions: [
        'Siéntate con la espalda completamente apoyada',
        'Ajusta el respaldo de los pies a la altura de tus tobillos',
        'Agarra las manijas laterales',
        'Extiende las piernas completamente exhalando',
        'Baja controladamente sin que las placas toquen',
        'Mantén la espalda pegada al respaldo'
      ],
      tips: [
        'No uses impulso para subir el peso',
        'Mantén los dedos de los pies apuntando arriba',
        'Contrae el cuádriceps en la parte superior',
        'Empieza con peso moderado'
      ],
      warnings: [
        'No bloquees las rodillas agresivamente',
        'Evita arquear la espalda',
        'No uses peso excesivo que fuerce las rodillas'
      ],
      sets: 3,
      reps: '12-15'
    },
    {
      id: '5',
      name: 'Press de Hombros',
      category: 'hombros',
      difficulty: 'intermediate',
      targetMuscles: ['Deltoides', 'Tríceps'],
      description: 'Máquina para desarrollar los hombros mediante empuje vertical.',
      instructions: [
        'Ajusta el asiento para que las manijas estén a la altura de los hombros',
        'Siéntate con la espalda apoyada',
        'Agarra las manijas con agarre neutral',
        'Empuja hacia arriba exhalando',
        'Baja controladamente inhalando',
        'No bloquees completamente los codos arriba'
      ],
      tips: [
        'Mantén el core activo',
        'No arquees la espalda baja',
        'Presiona de forma controlada',
        'Mantén los pies firmes en el suelo'
      ],
      warnings: [
        'No uses peso excesivo que comprometa la forma',
        'Evita movimientos bruscos',
        'No inclines el cuerpo hacia adelante'
      ],
      sets: 3,
      reps: '10-12'
    },
    {
      id: '6',
      name: 'Curl de Bíceps',
      category: 'brazos',
      difficulty: 'beginner',
      targetMuscles: ['Bíceps'],
      description: 'Máquina para aislar y fortalecer los bíceps.',
      instructions: [
        'Siéntate con el pecho contra el soporte',
        'Coloca los brazos sobre el soporte acolchado',
        'Agarra las manijas con las palmas hacia arriba',
        'Curl hacia arriba exhalando',
        'Baja controladamente inhalando',
        'No despegues los codos del soporte'
      ],
      tips: [
        'Mantén los codos fijos en el soporte',
        'No uses el cuerpo para impulsar',
        'Contrae el bíceps en la parte superior',
        'Controla la bajada'
      ],
      warnings: [
        'No uses peso excesivo',
        'Evita movimientos de muñeca',
        'No despegues el pecho del soporte'
      ],
      sets: 3,
      reps: '10-12'
    },
    {
      id: '7',
      name: 'Prensa de Piernas',
      category: 'piernas',
      difficulty: 'intermediate',
      targetMuscles: ['Cuádriceps', 'Glúteos', 'Isquiotibiales'],
      description: 'Máquina para trabajar todo el tren inferior con peso.',
      instructions: [
        'Siéntate con la espalda completamente apoyada',
        'Coloca los pies al ancho de hombros en la plataforma',
        'Suelta los seguros laterales',
        'Baja controladamente flexionando las rodillas',
        'Empuja hacia arriba sin bloquear las rodillas',
        'Mantén la espalda baja pegada al asiento'
      ],
      tips: [
        'No dejes que las rodillas sobrepasen los dedos de los pies',
        'Mantén los pies planos en la plataforma',
        'Respira correctamente: inhala al bajar, exhala al subir',
        'No bajes demasiado si sientes molestia en la espalda baja'
      ],
      warnings: [
        'Nunca bloquees las rodillas completamente',
        'No levantes la espalda baja del asiento',
        'Asegura siempre los seguros antes de comenzar'
      ],
      sets: 3,
      reps: '10-12'
    },
    {
      id: '8',
      name: 'Máquina de Abdominales',
      category: 'abdomen',
      difficulty: 'beginner',
      targetMuscles: ['Abdominales', 'Core'],
      description: 'Máquina para fortalecer el abdomen con soporte.',
      instructions: [
        'Siéntate y ajusta las almohadillas a tu pecho',
        'Agarra las manijas',
        'Flexiona el torso hacia adelante exhalando',
        'Regresa a la posición inicial controladamente',
        'Mantén el movimiento controlado',
        'No uses impulso'
      ],
      tips: [
        'Concéntrate en contraer los abdominales',
        'Exhala al contraer',
        'No uses los brazos para tirar',
        'Mantén la velocidad constante'
      ],
      warnings: [
        'No flexiones demasiado el cuello',
        'Evita usar peso excesivo',
        'No uses impulso del cuerpo'
      ],
      sets: 3,
      reps: '15-20'
    }
  ];

  const routineTemplates = [
    {
      id: '1',
      name: 'Rutina Principiante - Cuerpo Completo',
      level: 'beginner',
      duration: 45,
      exercises: [
        { machineId: '1', sets: 1, reps: '10 min', rest: 0 },
        { machineId: '2', sets: 3, reps: '10-12', rest: 60 },
        { machineId: '3', sets: 3, reps: '10-12', rest: 60 },
        { machineId: '4', sets: 3, reps: '12-15', rest: 60 },
        { machineId: '8', sets: 3, reps: '15-20', rest: 45 }
      ],
      description: 'Rutina ideal para comenzar tu viaje fitness. Trabaja todo el cuerpo con ejercicios básicos.',
      frequency: '3 veces por semana'
    },
    {
      id: '2',
      name: 'Rutina Intermedia - Fuerza',
      level: 'intermediate',
      duration: 60,
      exercises: [
        { machineId: '1', sets: 1, reps: '5 min', rest: 0 },
        { machineId: '2', sets: 4, reps: '8-10', rest: 90 },
        { machineId: '5', sets: 4, reps: '8-10', rest: 90 },
        { machineId: '7', sets: 4, reps: '10-12', rest: 90 },
        { machineId: '3', sets: 4, reps: '10-12', rest: 90 },
        { machineId: '6', sets: 3, reps: '10-12', rest: 60 }
      ],
      description: 'Rutina para desarrollar fuerza y masa muscular con mayor volumen de entrenamiento.',
      frequency: '4-5 veces por semana'
    },
    {
      id: '3',
      name: 'Rutina Avanzada - Hipertrofia',
      level: 'advanced',
      duration: 75,
      exercises: [
        { machineId: '1', sets: 1, reps: '5 min', rest: 0 },
        { machineId: '2', sets: 5, reps: '8-10', rest: 90 },
        { machineId: '5', sets: 5, reps: '8-10', rest: 90 },
        { machineId: '7', sets: 5, reps: '8-12', rest: 120 },
        { machineId: '4', sets: 4, reps: '12-15', rest: 60 },
        { machineId: '3', sets: 5, reps: '8-10', rest: 90 },
        { machineId: '6', sets: 4, reps: '10-12', rest: 60 },
        { machineId: '8', sets: 4, reps: '15-20', rest: 45 }
      ],
      description: 'Rutina intensiva para máximo desarrollo muscular con alto volumen e intensidad.',
      frequency: '5-6 veces por semana'
    }
  ];

  const categories = [
    { id: 'all', name: 'Todas', icon: Dumbbell },
    { id: 'cardio', name: 'Cardio', icon: Heart },
    { id: 'pecho', name: 'Pecho', icon: Target },
    { id: 'espalda', name: 'Espalda', icon: Target },
    { id: 'piernas', name: 'Piernas', icon: Target },
    { id: 'hombros', name: 'Hombros', icon: Target },
    { id: 'brazos', name: 'Brazos', icon: Target },
    { id: 'abdomen', name: 'Abdomen', icon: Target }
  ];

  const filteredMachines = machines.filter(machine => {
    const matchesSearch = machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          machine.targetMuscles.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || machine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      default: return difficulty;
    }
  };

  const handleAssignRoutine = () => {
    const routine = routineTemplates.find(r => r.level === userLevel);
    setAssignedRoutine(routine || null);
  };

  const getMachineById = (id) => machines.find(m => m.id === id);

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Guía de Máquinas</h1>
          <p className="text-neutral-600">Aprende a usar correctamente cada máquina del gimnasio y obtén tu rutina.</p>
        </div>

        {/* Tabs */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-neutral-100 mb-6 flex overflow-x-auto">
           {['guide', 'routine'].map(tab => (
               <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all ${
                    activeTab === tab 
                    ? 'bg-purple-500 text-white shadow-md' 
                    : 'text-neutral-500 hover:bg-neutral-50'
                }`}
               >
                   {tab === 'guide' ? 'Catálogo de Máquinas' : 'Asignar Rutina'}
               </button>
           ))}
        </div>

        {/* CONTENIDO TAB GUÍA */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            
            {/* Buscador y Filtros */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input 
                        className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Buscar máquina o músculo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedCategory === cat.id 
                                ? 'bg-purple-500 text-white' 
                                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                            }`}
                        >
                            <cat.icon className="w-4 h-4" />
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid de Máquinas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMachines.map(machine => (
                    <div 
                        key={machine.id}
                        onClick={() => setSelectedMachine(machine)}
                        className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-colors text-purple-600">
                                <Dumbbell className="w-6 h-6" />
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getDifficultyColor(machine.difficulty)}`}>
                                {getDifficultyText(machine.difficulty)}
                            </span>
                        </div>
                        <h3 className="font-bold text-lg text-neutral-900 mb-1">{machine.name}</h3>
                        <p className="text-sm text-neutral-500 mb-4 line-clamp-2">{machine.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                            {machine.targetMuscles.map((muscle, idx) => (
                                <span key={idx} className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded-md text-xs font-medium">
                                    {muscle}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                            <div className="text-xs text-neutral-500 font-medium flex gap-3">
                                <span className="flex items-center gap-1"><Repeat className="w-3 h-3"/> {machine.sets} series</span>
                                <span className="flex items-center gap-1"><Target className="w-3 h-3"/> {machine.reps} reps</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-purple-500" />
                        </div>
                    </div>
                ))}
            </div>

            {filteredMachines.length === 0 && (
                <div className="text-center py-12 text-neutral-400 bg-white rounded-2xl border border-dashed border-neutral-200">
                    <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No se encontraron máquinas</p>
                </div>
            )}
          </div>
        )}

        {/* CONTENIDO TAB RUTINA */}
        {activeTab === 'routine' && (
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100">
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
                            <Target className="w-8 h-8 text-purple-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900">Generador de Rutinas</h2>
                        <p className="text-neutral-600">Selecciona tu nivel de experiencia para obtener un plan personalizado</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {[
                            { id: 'beginner', label: 'Principiante', icon: User, sub: 'Menos de 6 meses', color: 'text-green-600' },
                            { id: 'intermediate', label: 'Intermedio', icon: TrendingUp, sub: '6 meses - 2 años', color: 'text-yellow-600' },
                            { id: 'advanced', label: 'Avanzado', icon: Zap, sub: 'Más de 2 años', color: 'text-red-600' }
                        ].map((level) => (
                            <label 
                                key={level.id}
                                className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                    userLevel === level.id 
                                    ? 'border-purple-500 bg-purple-50' 
                                    : 'border-neutral-100 hover:border-purple-200'
                                }`}
                            >
                                <input 
                                    type="radio" 
                                    name="level" 
                                    className="absolute opacity-0"
                                    checked={userLevel === level.id}
                                    onChange={() => setUserLevel(level.id)}
                                />
                                <div className="flex items-center gap-2 mb-2">
                                    <level.icon className={`w-5 h-5 ${level.color}`} />
                                    <span className="font-bold text-neutral-900">{level.label}</span>
                                </div>
                                <p className="text-xs text-neutral-500">{level.sub}</p>
                                {userLevel === level.id && (
                                    <div className="absolute top-3 right-3 text-purple-600">
                                        <CheckCircle className="w-5 h-5 fill-purple-100" />
                                    </div>
                                )}
                            </label>
                        ))}
                    </div>

                    <button 
                        onClick={handleAssignRoutine}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2"
                    >
                        Generar Mi Rutina <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                {assignedRoutine && (
                    <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-purple-600 p-6 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2 opacity-90">
                                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-bold uppercase tracking-wider">Rutina Recomendada</span>
                                    </div>
                                    <h3 className="text-2xl font-bold">{assignedRoutine.name}</h3>
                                    <p className="text-purple-100 mt-1">{assignedRoutine.description}</p>
                                </div>
                                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                    <Target className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            
                            <div className="flex gap-3 mt-6">
                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> {assignedRoutine.duration} min
                                </span>
                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                    <Repeat className="w-4 h-4" /> {assignedRoutine.frequency}
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            <h4 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                                <Dumbbell className="w-5 h-5 text-purple-500" /> Ejercicios
                            </h4>
                            <div className="space-y-3">
                                {assignedRoutine.exercises.map((ex, idx) => {
                                    const machine = getMachineById(ex.machineId);
                                    if (!machine) return null;
                                    return (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                                            <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-neutral-900">{machine.name}</p>
                                                <div className="flex gap-4 text-xs text-neutral-500 mt-1">
                                                    <span>{ex.sets} series</span>
                                                    <span>{ex.reps} reps</span>
                                                    <span>{ex.rest}s descanso</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setSelectedMachine(machine)}
                                                className="p-2 text-neutral-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                            >
                                                <Info className="w-5 h-5" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-xl text-sm flex gap-3 items-start">
                                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                                <p>Recuerda calentar 5-10 minutos antes de comenzar y realizar estiramientos al finalizar para evitar lesiones.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* Modal de Detalle de Máquina */}
        {selectedMachine && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedMachine(null)}>
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                    <div className="sticky top-0 bg-white border-b border-neutral-100 p-6 flex justify-between items-center z-10">
                        <div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase mb-2 inline-block ${getDifficultyColor(selectedMachine.difficulty)}`}>
                                {getDifficultyText(selectedMachine.difficulty)}
                            </span>
                            <h3 className="text-2xl font-bold text-neutral-900">{selectedMachine.name}</h3>
                        </div>
                        <button onClick={() => setSelectedMachine(null)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                            <X className="w-6 h-6 text-neutral-500" />
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-8">
                        <div>
                            <h4 className="font-bold text-neutral-900 mb-3 flex items-center gap-2">
                                <Target className="w-5 h-5 text-purple-500" /> Músculos Trabajados
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedMachine.targetMuscles.map((m, i) => (
                                    <span key={i} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium border border-purple-100">
                                        {m}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-neutral-900 mb-3 flex items-center gap-2">
                                <PlayCircle className="w-5 h-5 text-purple-500" /> Instrucciones
                            </h4>
                            <ol className="space-y-3">
                                {selectedMachine.instructions.map((step, i) => (
                                    <li key={i} className="flex gap-3 text-neutral-700 text-sm">
                                        <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                                            {i + 1}
                                        </span>
                                        {step}
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                                    <Info className="w-4 h-4" /> Consejos
                                </h4>
                                <ul className="space-y-2">
                                    {selectedMachine.tips.map((tip, i) => (
                                        <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                                            <span className="mt-1.5 w-1 h-1 bg-blue-400 rounded-full shrink-0"></span>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> Precaución
                                </h4>
                                <ul className="space-y-2">
                                    {selectedMachine.warnings.map((warn, i) => (
                                        <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                                            <span className="mt-1.5 w-1 h-1 bg-red-400 rounded-full shrink-0"></span>
                                            {warn}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default ManualMaquinas;