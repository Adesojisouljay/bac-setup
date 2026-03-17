import { useState, useEffect } from 'react';
import { DownloadCloud, Settings, Zap, ChevronDown, Globe, Shield, Database, Code, Users, CheckCircle2, PlayCircle } from 'lucide-react';
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
    const [selectedVersion, setSelectedVersion] = useState<string>("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        async function fetchReleases() {
            try {
                const res = await fetch('/releases.json');
                if (res.ok) {
                    const data = await res.json();
                    setReleases(data);
                    if (data.length > 0) {
                        setSelectedVersion(data[0].version);
                    }
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
    const activeRelease = releases.find(r => r.version === selectedVersion) || (releases.length > 0 ? releases[0] : null);
    const downloadUrl = activeRelease ? `/${activeRelease.filename}` : "/dist.zip";
    const downloadName = activeRelease ? `breakaway-engine-v${activeRelease.version}.zip` : "breakaway-engine.zip";

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

                            <div className="flex w-full sm:w-auto items-stretch">
                                <a
                                    href={downloadUrl}
                                    download={downloadName}
                                    className={`w-full sm:w-auto px-8 py-4 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-hover)] text-white font-bold ${releases.length > 1 ? 'rounded-l-xl border-r-0' : 'rounded-xl'} flex items-center justify-center gap-2 transition-all active:scale-95`}
                                >
                                    {loadingReleases ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <DownloadCloud className="w-5 h-5" />
                                    )}
                                    {activeRelease ? `Download Source v${activeRelease.version}` : 'Download Source ZIP'}
                                </a>

                                {releases.length > 1 && (
                                    <div className="relative flex">
                                        <button
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className={`appearance-none bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-hover)] text-white font-bold rounded-r-xl px-4 py-4 pr-10 outline-none cursor-pointer transition-all flex items-center h-full relative z-10`}
                                        >
                                            v{selectedVersion}
                                            <ChevronDown size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-[#ff4400]' : 'text-white/70'}`} />
                                        </button>
                                        
                                        {/* Dropdown Overlay */}
                                        {isDropdownOpen && (
                                            <>
                                                <div 
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                />
                                                <div className="absolute top-[calc(100%+8px)] right-0 w-48 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200 ring-1 ring-[#ff4400]/20">
                                                    <div className="max-h-64 overflow-y-auto hidden-scrollbar py-2">
                                                        {releases.map((release, index) => {
                                                            const isSelected = release.version === selectedVersion;
                                                            return (
                                                                <button
                                                                    key={release.version}
                                                                    onClick={() => {
                                                                        setSelectedVersion(release.version);
                                                                        setIsDropdownOpen(false);
                                                                    }}
                                                                    className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between group ${
                                                                        isSelected 
                                                                            ? 'bg-[#ff4400]/10 text-[#ff4400] font-bold' 
                                                                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-white font-medium'
                                                                    }`}
                                                                >
                                                                    <span className="flex items-center gap-2">
                                                                        v{release.version}
                                                                        {index === 0 && (
                                                                            <span className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-[#ff4400]/20 text-[#ff4400]' : 'bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white/80'}`}>
                                                                                Latest
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                    {isSelected && <CheckCircle2 size={14} className="text-[#ff4400]" />}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-32 grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Globe,
                            title: "1. Point Your Domain",
                            desc: "Purchase a domain and configure its DNS settings. You'll need to create a CNAME record pointing to our Discovery Gateway IP, and TXT records to verify ownership and instantly provision SSL certificates (the green padlock)."
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
                            <p className="text-[var(--text-secondary)] leading-relaxed text-sm">{step.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-center animate-in fade-in slide-in-from-bottom-4">
                    <a 
                        href="https://beta.sovraniche.com/post/sovraniche/4afeec14"
                        target="_blank"
                        rel="noreferrer"
                        className="group flex flex-col sm:flex-row items-center gap-4 bg-[var(--bg-card)] border border-[#ff4400]/30 hover:border-[#ff4400] rounded-2xl p-4 pr-6 max-w-2xl w-full transition-all shadow-[0_0_20px_rgba(255,68,0,0.05)] hover:shadow-[0_0_30px_rgba(255,68,0,0.15)] hover:-translate-y-1"
                    >
                        <div className="w-12 h-12 bg-[#ff4400]/10 text-[#ff4400] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#ff4400] group-hover:text-white transition-colors">
                            <PlayCircle className="w-6 h-6" />
                        </div>
                        <div className="text-center sm:text-left flex-1">
                            <h4 className="font-bold text-[var(--text-primary)] text-sm sm:text-base">Need help setting up your domain?</h4>
                            <p className="text-[var(--text-secondary)] text-xs sm:text-sm mt-0.5">Watch our step-by-step video tutorial on buying a domain, generating a CNAME, and setting up TXT records.</p>
                        </div>
                        <div className="hidden sm:flex text-xs font-black uppercase tracking-widest text-[#ff4400] bg-[#ff4400]/10 px-3 py-1.5 rounded-lg group-hover:bg-[#ff4400] group-hover:text-white transition-colors">
                            Watch Video
                        </div>
                    </a>
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
                            <a href="https://github.com/adesojisouljay" target="_blank" rel="noreferrer" className="text-[var(--text-secondary)] hover:text-white transition-colors">Github</a>
                            <a href="https://beta.sovraniche.com" target="_blank" rel="noreferrer" className="text-[var(--text-secondary)] hover:text-white transition-colors">Main Site</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
