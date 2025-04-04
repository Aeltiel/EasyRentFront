import Nav from "../components/Nav";
import FormulaireLoc from "../components/FormulaireLoc";

function LocatairePage() {
  return (
    <main className="w-full">
    <div className="bg-white mb-2 shadow-lg rounded-lg">
        <Nav />
      </div>
    <div>
      <FormulaireLoc/>
    </div>
    </main>
  );
}
export default LocatairePage;