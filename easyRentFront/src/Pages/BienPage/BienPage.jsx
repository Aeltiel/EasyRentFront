import Nav from "../../components/Nav";
import Formulaire from "../../components/Formulaire";
import BienList from "../../components/ListsBien/ListBien";
import FormulaireLoc from "../../components/FormulaireLoc";


function BienPage() {
  return (
    <>
    <div className="w-full  p-2">
        <div className="bg-white mb-2 shadow-lg rounded-lg">
            <Nav />
        </div>
        <div className="bg-white mb-2 shadow-lg rounded-lg">
            <BienList />
        </div>
        <div className="bg-white mb-2 shadow-lg rounded-lg">
            <Formulaire />
        </div>
        <div className="bg-white mb-2 shadow-lg rounded-lg">
            <FormulaireLoc />
        </div>

        
    </div>
    </>
  );
}

export default BienPage;
