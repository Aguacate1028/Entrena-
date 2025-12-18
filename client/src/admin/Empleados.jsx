import React, { useState } from 'react';
import { 
  Users, Briefcase, Search, Filter, Download, 
  Plus, Mail, Phone, Calendar, DollarSign,
  Eye, Edit, XCircle, CheckCircle, Trash2
} from 'lucide-react';

const Empleados = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const [employees, setEmployees] = useState([
    { id: 'EMP001', name: 'María González', role: 'instructor', status: 'active', email: 'maria.gonzalez@entrenaplus.com', phone: '+34 600 111 111', hireDate: '14/1/2023', salary: '2,500', tags: ['Yoga', 'Pilates', 'Meditación'] },
    { id: 'EMP002', name: 'Carlos Ruiz', role: 'instructor', status: 'active', email: 'carlos.ruiz@entrenaplus.com', phone: '+34 600 333 333', hireDate: '19/3/2023', salary: '2,600', tags: ['Spinning', 'Ciclismo', 'HIIT'] },
    { id: 'EMP003', name: 'Ana Martín', role: 'receptionist', status: 'active', email: 'ana.martin@entrenaplus.com', phone: '+34 600 555 555', hireDate: '31/5/2023', salary: '1,800', tags: [] },
  ]);

  const roles = {
    instructor: { label: 'Instructor', color: 'bg-purple-100 text-purple-600', icon: Briefcase },
    receptionist: { label: 'Recepcionista', color: 'bg-green-100 text-green-600', icon: Users },
    maintenance: { label: 'Mantenimiento', color: 'bg-orange-100 text-orange-600', icon: Briefcase },
  };

  const stats = [
    { label: 'Total Empleados', value: employees.length, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Activos', value: employees.filter(e => e.status === 'active').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Inactivos', value: employees.filter(e => e.status === 'inactive').length, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Instructores', value: employees.filter(e => e.role === 'instructor').length, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const toggleStatus = (id) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, status: emp.status === 'active' ? 'inactive' : 'active' } : emp
    ));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Gestión de Empleados</h1>
        <p className="text-neutral-500">Administra el personal del gimnasio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] border border-neutral-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
            </div>
            <div className={`${stat.bg} p-3 rounded-2xl`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-[24px] border border-neutral-100 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            className="w-full pl-12 pr-4 py-2.5 bg-neutral-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="px-4 py-2.5 bg-neutral-50 border-none rounded-xl text-neutral-600 font-bold text-sm outline-none"
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">Todos los roles</option>
            <option value="instructor">Instructores</option>
            <option value="receptionist">Recepcionistas</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl font-bold text-sm hover:bg-neutral-50 transition-all">
            <Download size={18} /> Exportar
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-purple-500 text-white rounded-xl font-bold text-sm hover:bg-purple-600 shadow-lg shadow-purple-100 transition-all active:scale-95">
            <Plus size={18} /> Nuevo Empleado
          </button>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="space-y-4">
        {employees
          .filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .filter(e => filterRole === 'all' || e.role === filterRole)
          .map((emp) => (
          <div key={emp.id} className="bg-white p-6 rounded-[24px] border border-neutral-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-purple-200 transition-all">
            <div className="flex gap-6 items-center flex-1">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-inner">
                {emp.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-neutral-900">{emp.name}</h3>
                  <span className={`flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${roles[emp.role].color}`}>
                    <Briefcase size={12} /> {roles[emp.role].label}
                  </span>
                  <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${emp.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {emp.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                  <div className="flex items-center gap-2 text-sm text-neutral-500 font-medium">
                    <Mail size={14} /> {emp.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-500 font-medium">
                    <Phone size={14} /> {emp.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-500 font-medium">
                    <Calendar size={14} /> Contratado: {emp.hireDate}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-900 font-bold">
                    <DollarSign size={14} /> ${emp.salary}/mes
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  {emp.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-neutral-50 text-neutral-600 rounded-full text-[10px] font-bold border border-neutral-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex md:flex-col gap-2 w-full md:w-auto">
              <button className="flex-1 md:w-32 flex items-center justify-center gap-2 py-2 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-50">
                <Eye size={14} /> Ver
              </button>
              <button className="flex-1 md:w-32 flex items-center justify-center gap-2 py-2 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-50">
                <Edit size={14} /> Editar
              </button>
              <button 
                onClick={() => toggleStatus(emp.id)}
                className={`flex-1 md:w-32 flex items-center justify-center gap-2 py-2 border rounded-xl text-xs font-bold transition-colors ${emp.status === 'active' ? 'border-red-100 text-red-500 hover:bg-red-50' : 'border-green-100 text-green-500 hover:bg-green-50'}`}
              >
                {emp.status === 'active' ? <><XCircle size={14}/> Desactivar</> : <><CheckCircle size={14}/> Activar</>}
              </button>
              <button className="flex-1 md:w-32 flex items-center justify-center gap-2 py-2 border border-red-100 text-red-500 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors">
                <Trash2 size={14} /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Empleados;