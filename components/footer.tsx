export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-background py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-xs text-slate-500 md:flex-row md:px-8">
        <span>&copy; {new Date().getFullYear()} CONQ. All rights reserved.</span>
        <span className="text-slate-400">Presidents Challenge 2026 · University of Western Ontario</span>
      </div>
    </footer>
  )
}
