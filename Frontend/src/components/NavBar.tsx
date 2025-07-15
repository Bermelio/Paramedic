import Clock from "./Clock";

function NavBar() {

  return (
    <>
      <div className="flex justify-around items-center gap-10 bg-amber-600 text-white p-4 shadow-lg">

      <img className="size-20" src="/icon.png" alt="icon main" />
      <a href="/">
        <h1 className="text-5xl">Torneo: “Clausura 2025”</h1>
      </a>
      <a href="/login" className="flex items-center justify-center">
        <svg
        className="w-13 h-13"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#ffffff"
        >
        <path
          d="M4 6H20M4 12H20M4 18H20"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        </svg>
      </a>
      </div>

      <div className="flex justify-end p-3 mr-10 text-1xl">
        <Clock/>
      </div>
    </>
  );
}

export default NavBar;