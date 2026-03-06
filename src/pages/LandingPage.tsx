import { useState, useEffect } from 'react';
import { DownloadCloud, Settings, Zap, ChevronDown, History, Globe, Shield, Database, Code, Users, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

interface Release {
    version: string;
    filename: string;
    date: string;
    changelog: string;
}

export default function LandingPage() {
    const [releases, setReleases] = useState<Release[]>([]);
    const [loadingReleases, setLoadingReleases] = useState(true);
    const [showVersionHistory, setShowVersionHistory] = useState(false);

    useEffect(() => {
        async function fetchReleases() {
            try {
                const res = await fetch('/releases.json');
                if (res.ok) {
                    const data = await res.json();
                    setReleases(data);
                }
            } catch (err) {
                console.error("Failed to load releases", err);
            } finally {
                setLoadingReleases(false);
            }
        }
        fetchReleases();
    }, []);

    // Always fall back to dist.zip if no releases are found (for backwards compatibility / dev mode)
    const latestRelease = releases.length > 0 ? releases[0] : null;
    const downloadUrl = latestRelease ? `/${latestRelease.filename}` : "/dist.zip";
    const downloadName = latestRelease ? `breakaway-engine-v${latestRelease.version}.zip` : "breakaway-engine.zip";

    return (
        <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] font-sans">
            <Navbar />

            {/* Hero Section */}
            <main className="max-w-6xl mx-auto px-6 py-20 pb-32">
                <div className="text-center max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff4400]/10 text-[#ff4400] text-sm font-bold border border-[#ff4400]/20">
                        <Zap className="w-4 h-4" />
                        <span>Self-Hosted Community Platform v1.0</span>
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-tight">
                        Launch your Hive Community in <span className="text-transparent bg-clip-text bg-gradient-to-tr from-[#ff4400] to-orange-400">60 seconds.</span>
                    </h1>

                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto text-balance">
                        No servers to manage, no coding required. Just point your domain and map your community instantly using our central gateway.
                    </p>

                    <div className="pt-8 flex flex-col items-center justify-center gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            <Link
                                to="/configure"
                                className="w-full sm:w-auto px-8 py-4 bg-[#ff4400] hover:bg-[#e63d00] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#ff4400]/20 active:scale-95"
                            >
                                <Settings className="w-5 h-5" />
                                Configure Your Community
                            </Link>
                            <a
                                href={downloadUrl}
                                download={downloadName}
                                className="w-full sm:w-auto px-8 py-4 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-hover)] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                            >
                                {loadingReleases ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <DownloadCloud className="w-5 h-5" />
                                )}
                                {latestRelease ? `Download Source v${latestRelease.version}` : 'Download Source ZIP'}
                            </a>
                        </div>

                        {releases.length > 1 && (
                            <div className="relative mt-2">
                                <button
                                    onClick={() => setShowVersionHistory(!showVersionHistory)}
                                    className="text-xs font-bold text-[var(--text-secondary)] hover:text-[#ff4400] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#ff4400]/5"
                                >
                                    <History size={14} />
                                    Previous Versions
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${showVersionHistory ? 'rotate-180' : ''}`} />
                                </button>

                                {showVersionHistory && (
                                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-80 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto hidden-scrollbar animate-in slide-in-from-top-4 fade-in">
                                        {releases.slice(1).map((release) => (
                                            <div key={release.version} className="p-3 hover:bg-[var(--bg-hover)] rounded-xl transition-colors text-left group">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-bold text-[var(--text-primary)]">v{release.version}</span>
                                                    <a
                                                        href={`/${release.filename}`}
                                                        download={`breakaway-engine-v${release.version}.zip`}
                                                        className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-[#ff4400]/10 text-[#ff4400] text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-[#ff4400] hover:text-white transition-all shadow-sm"
                                                    >
                                                        Download
                                                    </a>
                                                </div>
                                                <div className="text-[10px] text-[var(--text-secondary)] mb-2 font-medium">
                                                    {new Date(release.date).toLocaleDateString()}
                                                </div>
                                                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                                                    {release.changelog}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-32 grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Globe,
                            title: "1. Point Your Domain",
                            desc: "Create an A record or CNAME pointing your custom domain (like community.yoursite.com) to our Discovery Gateway IP."
                        },
                        {
                            icon: Settings,
                            title: "2. Map & Branding",
                            desc: "Visit your domain and use our lightning-fast setup wizard to link your Hive Community ID, logo, and brand colors."
                        },
                        {
                            icon: DownloadCloud,
                            title: "3. Optional: Self-Host",
                            desc: "Want total control? Download the engine source ZIP and host it yourself on your own VPS or Vercel instance."
                        }
                    ].map((step, i) => (
                        <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-3xl relative overflow-hidden group hover:border-[#ff4400]/30 transition-colors">
                            <div className="w-14 h-14 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border-color)] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#ff4400]/10 group-hover:border-[#ff4400]/20 group-hover:text-[#ff4400] transition-all">
                                <step.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Features Section */}
                <div className="mt-32 border-t border-[var(--border-color)] pt-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-5xl font-black mb-6">Why Choose Sovraniche?</h2>
                        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                            The perfect balance of decentralized freedom and web2 convenience. Own your audience without managing complex infrastructure.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Globe,
                                title: "Custom Domains",
                                desc: "Host on any domain or subdomain. No rigid lock-in, use whatever registrar and DNS provider you prefer."
                            },
                            {
                                icon: Shield,
                                title: "Hive Authentication",
                                desc: "Built-in Hive Keychain integration. Let your users log in with their existing decentralized identities safely."
                            },
                            {
                                icon: Database,
                                title: "Zero Database Needed",
                                desc: "No need to spin up MongoDB or Postgres. Our centralized engine handles configuration while Hive handles all user data."
                            },
                            {
                                icon: Code,
                                title: "Open & Extensible",
                                desc: "A Vite React build that's lightning fast. You get the compiled source so your delivery speeds are uncompromised."
                            },
                            {
                                icon: Zap,
                                title: "Instant Dynamic Routing",
                                desc: "The frontend checks your domain on load and pulls the corresponding community configuration—no manual config files."
                            },
                            {
                                icon: Users,
                                title: "Decentralized Social",
                                desc: "All posts, comments, and votes are natively broadcasted to the Hive blockchain. Uncensorable communities."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="p-6 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] hover:border-[#ff4400]/50 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-[#ff4400]/10 flex items-center justify-center text-[#ff4400] mb-4">
                                    <feature.icon className="w-5 h-5" />
                                </div>
                                <h4 className="text-lg font-bold mb-2">{feature.title}</h4>
                                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Architecture/How it works */}
                <div className="mt-32 border-t border-[var(--border-color)] pt-32">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-black mb-6">How the Engine works</h2>
                            <p className="text-lg text-[var(--text-secondary)] mb-8">
                                Building decentralized communities shouldn't require deeply technical blockchain knowledge.
                                We mapped out a hybrid architecture that gets you up and running instantly.
                            </p>
                            <div className="space-y-6">
                                {[
                                    {
                                        title: "1. The Frontend Wrapper",
                                        desc: "You download our static build. When accessed, it reads the current hostname to identify itself."
                                    },
                                    {
                                        title: "2. The Central Config Hub",
                                        desc: "It pings the Sovraniche Setup API to fetch the mapping connecting that domain to a specific Hive Community ID."
                                    },
                                    {
                                        title: "3. Direct Blockchain Access",
                                        desc: "Once configured, the frontend communicates directly with Hive RPC nodes to fetch decentralized content."
                                    }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-[#ff4400] text-white flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{step.title}</h4>
                                            <p className="text-[var(--text-secondary)]">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative mt-8 lg:mt-0">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#ff4400]/20 to-transparent blur-3xl rounded-full" />
                            <div className="relative bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-8 shadow-2xl">
                                <div className="space-y-4 font-mono text-sm max-w-sm mx-auto">
                                    <div className="p-4 bg-[var(--bg-canvas)] rounded-xl border border-[var(--border-color)]">
                                        <div className="text-[#ff4400] font-bold mb-1">// Your domain</div>
                                        <div className="text-[var(--text-primary)]">gaming.yourdomain.com</div>
                                    </div>
                                    <div className="flex justify-center text-[var(--text-secondary)] text-xl">↓</div>
                                    <div className="p-4 bg-[var(--bg-canvas)] rounded-xl border border-[var(--border-color)]">
                                        <div className="text-blue-500 font-bold mb-1">// Sovraniche Hub</div>
                                        <div className="text-[var(--text-primary)]">Resolves domain to: hive-13323</div>
                                    </div>
                                    <div className="flex justify-center text-[var(--text-secondary)] text-xl">↓</div>
                                    <div className="p-4 bg-[var(--bg-canvas)] rounded-xl border border-[#ff4400]/30 shadow-[0_0_15px_rgba(255,68,0,0.1)]">
                                        <div className="text-green-500 font-bold mb-1">// Hive Blockchain</div>
                                        <div className="text-[var(--text-primary)]">Renders feed for 'hive-13323'</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-32 border-t border-[var(--border-color)] pt-32 mb-16">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-5xl font-black mb-6">Frequently Asked Questions</h2>
                    </div>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {[
                            { q: "Do I need to know how to code?", a: "No! If you know how to drag and drop a ZIP file into Vercel, Netlify, or your cPanel hosting account, you can launch a community." },
                            { q: "How much does it cost?", a: "The software itself is 100% free and open-source. You only pay for your own domain name and wherever you choose to host the static files (which is often free on platforms like Vercel)." },
                            { q: "Can I customize the look and feel?", a: "Yes. Once you map your domain, the setup wizard will allow you to define primary colors, community names, and custom logos which are saved to the central hub." },
                            { q: "Who owns the data?", a: "Your community posts, comments, and votes live securely on the decentralized Hive blockchain. You own the frontend, and your users own their data." },
                            { q: "What happens if I update the engine?", a: "Simply download the newest version ZIP from this page, and overwrite your old hosted files. Your community configuration stays safely saved in our database." }
                        ].map((faq, i) => (
                            <details key={i} className="group bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl open:bg-[var(--bg-hover)] transition-colors">
                                <summary className="flex items-center justify-between p-6 font-bold cursor-pointer marker:hidden list-none">
                                    {faq.q}
                                    <ChevronDown className="w-5 h-5 text-[var(--text-secondary)] group-open:rotate-180 transition-transform" />
                                </summary>
                                <div className="px-6 pb-6 text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)]/50 pt-4 mt-2">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-[var(--border-color)] bg-[var(--bg-card)]/50 pb-12 pt-16 mt-32">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <img
                                src="/sovraniche-logo.png"
                                alt="Sovraniche Logo"
                                className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(255,68,0,0.3)]"
                            />
                            <span className="font-bold text-xl tracking-tight">Sovraniche</span>
                        </div>
                        <div className="text-[var(--text-secondary)] text-sm font-medium flex flex-col items-center gap-1 md:items-start">
                            <span>© {new Date().getFullYear()} Sovraniche. All rights reserved.</span>
                            <span className="text-xs opacity-75">
                                Developer: <a href="https://hive.blog/@adesojisouljay" target="_blank" rel="noreferrer" className="text-[#ff4400] hover:underline font-bold">@adesojisouljay</a>
                            </span>
                        </div>
                        <div className="flex gap-6">
                            <a href="https://github.com/breakaway-communities" target="_blank" rel="noreferrer" className="text-[var(--text-secondary)] hover:text-white transition-colors">Github</a>
                            <a href="https://breakaway.community" className="text-[var(--text-secondary)] hover:text-white transition-colors">Main Site</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
