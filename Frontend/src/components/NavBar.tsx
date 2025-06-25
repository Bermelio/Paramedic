
function NavBar() {

  return (
    <>
    <div className="flex justify-center items-center gap-10 bg-amber-600 text-white p-4 shadow-lg">
      <img className="size-20" src="/icon.png" alt="icon main" />
      <h1 className="text-5xl">Torneo: “Apertura 2025”</h1>
    </div>
    <div className="flex justify-end p-3 mr-10 text-1xl">
      <p><strong>San Francisco</strong> 21/06/2025 - 18:00 hs</p>
    </div>
    </>
  );
}

export default NavBar;