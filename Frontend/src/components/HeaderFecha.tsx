

interface HeaderData {
  _id?: string;
  encuentro: string;
  fecha: string;
  hora: string;
  nombreDia: string;
}

function HeaderFecha (){
  return(
  <div className="border border-gray-300 rounded-lg p-4 mb-6">
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-3">
    
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Encuentro n°</label>
          <input
          type="text"
          // value={}
          placeholder=""
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input
          type="date"
          // value={}
          placeholder=""
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
          <input
          type="time"
          // value={}
          placeholder=""
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" 
          />
        </div>

      </div>
    </div>
  </div>
  );
}

export default HeaderFecha;