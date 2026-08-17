function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h2 className="text-lg font-semibold text-slate-800">
        Gestion des colis
      </h2>

      <span className="text-sm text-slate-600">
        Administrateur
      </span>
    </header>
  );
}

export default Navbar;