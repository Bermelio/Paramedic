import CampeonatoTable from '../components/CampeonatoTable.tsx';
import MainTable from '../components/MainTable.tsx';

function Table() {
  return (
    <div className="p-2 sm:p-4 lg:p-8">

      <MainTable />

      <CampeonatoTable />

    </div>
  );
}

export default Table;