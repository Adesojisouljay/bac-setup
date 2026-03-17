import { Link } from 'react-router-dom';

export function Navbar() {
    return (
        <header className="border-b border-[var(--border-color)] bg-[var(--bg-card)]/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                    <img
                        src="/sovraniche-logo.png"
                        alt="Sovraniche Logo"
                        className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(255,68,0,0.3)] group-hover:scale-105 transition-transform"
                    />
                    <span className="font-bold text-xl tracking-tight text-[var(--text-primary)]">Sovraniche</span>
                </Link>
                <nav className="flex gap-6 items-center">
                    <a href="https://beta.sovraniche.com" target="_blank" rel="noreferrer" className="text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors">Main Site</a>
                    <Link to="/configure" className="text-sm font-bold bg-[var(--bg-hover)] px-4 py-2 rounded-lg hover:bg-[var(--border-color)] transition-colors text-[var(--text-primary)]">
                        Configure Domain
                    </Link>
                </nav>
            </div>
        </header>
    );
}
