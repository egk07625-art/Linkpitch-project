export function Footer() {
  return (
    <footer className="py-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-zinc-500 text-sm">
          © {new Date().getFullYear()} Linkpitch. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            Terms
          </a>
          <a href="#" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
