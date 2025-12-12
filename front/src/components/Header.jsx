import { Dumbbell, Home, User, Users, LayoutDashboard } from 'lucide-react'; // Añadimos Users y LayoutDashboard

// Header ahora acepta props de estado de autenticación y funciones de control
const Header = ({ isLoggedIn, userName, isAdmin, onLoginClick, onRegisterClick, onLogout }) => { 
  
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo entrena+ */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-purple-500 p-2 rounded-lg">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl text-neutral-900">
              entrena<span className="text-purple-500">+</span>
            </span>
          </div>

          {/* Navegación y Auth */}
          <nav className="hidden md:flex items-center gap-6">
            
            {/* Inicio */}
            <a 
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-100 text-purple-600 transition-colors"
            >
              <Home className="w-5 h-5" />
              Inicio
            </a>

            {/* Links condicionales (Comunidad y Admin) */}
            {isLoggedIn && (
                <a href="/socio/social" className="flex items-center gap-2 px-3 py-2 rounded-lg text-neutral-700 hover:bg-purple-50 hover:text-purple-500">
                    <Users className="w-5 h-5" />
                    Comunidad
                </a>
            )}
            {isAdmin && (
                <a href="/DashboardAdmin" className="flex items-center gap-2 px-3 py-2 rounded-lg text-neutral-700 hover:bg-purple-50 hover:text-purple-500">
                    <LayoutDashboard className="w-5 h-5" />
                    Admin
                </a>
            )}

          </nav>

          {/* Auth Buttons/Status */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-neutral-900 hidden sm:inline">{userName}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-neutral-700 hover:text-purple-500 transition-colors font-medium"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 text-neutral-700 hover:text-purple-500 transition-colors hidden sm:block font-medium"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={onRegisterClick}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold shadow-md"
                >
                  Registrarse
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;