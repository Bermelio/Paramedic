function Table() {
  const rows = Array(9).fill({
    number: "01",
    club: "Dep. Oeste",
    paramedico: "Cristina Castillo",
    cambio: "Los Andes",
    hora: "13:00"
  });

  return (
    <div className="flex justify-center items-center p-8">
      <table className="table-auto md:w-2/3 border border-black">
        <thead className="bg-amber-600 text-white text-lg">
          <tr>
            <th className="p-2 border border-black">N°</th>
            <th className="p-2 border border-black">CLUB LOCAL</th>
            <th className="p-2 border border-black">PARAMÉDICO/A</th>
            <th className="p-2 border border-black">CAMBIO DE CANCHA</th>
            <th className="p-2 border border-black">HORA</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="text-lg">
              <td className="text-center border border-black p-2">{row.number}</td>
              <td className="text-center border border-black p-2">{row.club}</td>
              <td className="text-center border border-black p-2">{row.paramedico}</td>
              <td className="text-center border border-black p-2">{row.cambio}</td>
              <td className="text-center border border-black p-2">{row.hora}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
