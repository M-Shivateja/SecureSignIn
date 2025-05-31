import { Link } from "react-router-dom";

function CreateAccount() {
  return (
    <div>
      <section id="cta" className="text-white py-8 px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to take the next step?
        </h2>
        <Link to="/register">
          <button className="px-4 py-2 text-lg text-gray-800 bg-white border-none cursor-pointer mt-4 rounded hover:bg-gray-100 transition-colors duration-300">
            CreateAccount
          </button>
        </Link>
      </section>
    </div>
  );
}

export default CreateAccount;
