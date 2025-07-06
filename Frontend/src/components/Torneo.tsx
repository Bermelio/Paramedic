function Torneo() {
  return (
    <>
      <aside className="text-balance p-4 m-4 bg-white shadow-lg rounded-lg text-base">
        <p className="mb-2">
          Quedan definidas las designaciones del día de la fecha, pudiendo ser modificadas por razones de fuerza mayor.
        </p>
        <p className="mb-4">Sin más al respecto, saludos a Ud. atte.</p>
        <a href="/login">
          <div className="mt-2 flex flex-col items-end">
            <p className="text-gray-300 font-semibold">Cristina Castillo</p>
            <p className="text-gray-300">Referente Cuerpo de Paramédicos</p>
          </div>
        </a>
      </aside>
    </>
  );
}

export default Torneo;
