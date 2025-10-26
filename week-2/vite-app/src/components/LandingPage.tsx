// @ts-nocheck
// LandingPage.jsx
export default function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-5 relative overflow-hidden">
      {/* Doodle Background */}
      <div className="absolute inset-0 opacity-50 pointer-events-none">
         <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('https://i.pinimg.com/1200x/d7/b2/04/d7b2045bbd484505c5925fa3b675949c.jpg')" }}
      />
      </div>
            
      <div className="max-w-2xl w-full bg-white border-4 border-stone-800 shadow-[8px_8px_0px_0px_#292524] p-16 text-center relative z-10">
        <div className="w-20 h-20 bg-stone-800 mx-auto mb-8 flex items-center justify-center text-5xl">
          📝
        </div>
        
        <h1 className="text-5xl font-bold text-stone-800 mb-4 font-serif">
          Teacher Survey
        </h1>
        
        <p className="text-lg text-stone-600 mb-10 leading-relaxed">
          Share your valuable feedback and help us improve the educational experience
        </p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate("login")}
            className="px-8 py-3 bg-stone-800 text-stone-50 border-3 border-stone-800 text-base font-semibold hover:bg-stone-50 hover:text-stone-800 transition-all"
          >
            Login
          </button>
          
          <button
            onClick={() => onNavigate("register")}
            className="px-8 py-3 bg-stone-50 text-stone-800 border-3 border-stone-800 text-base font-semibold hover:bg-stone-800 hover:text-stone-50 transition-all"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}