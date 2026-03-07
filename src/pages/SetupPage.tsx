import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ExternalLink, Copy, Check, Globe } from 'lucide-react';
import { configService } from '../services/configService';
import { Navbar } from '../components/Navbar';

export default function SetupPage() {
    const [loading, setLoading] = useState(false);
    const [domainInput, setDomainInput] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [configuredDomain, setConfiguredDomain] = useState('');
    const [verificationData, setVerificationData] = useState<any>(null);
    const [formData, setFormData] = useState({
        communityName: '',
        hiveCommunityId: '',
        logoUrl: '',
        primaryColor: '#ff4400',
        onboardingSats: 100,
        communityDescription: 'A decentralized community powered by Sovraniche.',
    });

    const isValidHiveId = (id: string) => {
        return id === 'global' || id.startsWith('hive-');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidHiveId(formData.hiveCommunityId)) {
            toast.error('Invalid Community ID. Must start with "hive-" (e.g. hive-123456) or be "global".');
            return;
        }

        setLoading(true);

        // Normalize domain input
        const cleanedDomain = domainInput.toLowerCase().replace(/^(https?:\/\/)/, '').split(':')[0];

        try {
            const result = await configService.saveConfig({
                ...formData,
                domain: cleanedDomain
            });

            if (result.success) {
                toast.success(`Community configured successfully!`);
                setConfiguredDomain(cleanedDomain);
                setVerificationData(result.config?.sslVerificationData);
                setShowSuccess(true);
                // Reset form on success
                setDomainInput('');
                setFormData({
                    communityName: '',
                    hiveCommunityId: '',
                    logoUrl: '',
                    primaryColor: '#ff4400',
                    onboardingSats: 100,
                    communityDescription: 'A decentralized community powered by Sovraniche.',
                });
            } else {
                toast.error(result.message || 'Failed to map configuration.');
            }
        } catch (error) {
            toast.error('An error occurred during mapping.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)] overflow-hidden font-sans">
            <Navbar />
            <div className="flex-1 flex flex-col md:flex-row min-h-0">
                {/* Left side Image - Hidden on mobile, takes 50% on desktop */}
                <div
                    className="hidden md:flex w-1/2 relative items-end p-12 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.4), rgba(0,0,0,0.2)), url('/community-bg.png')`
                    }}
                >
                    <div className="relative z-10 max-w-lg mb-8">
                        <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-4 text-balance">
                            Powering the next generation of <span className="text-[#ff4400]">uncensorable</span> communities.
                        </h2>
                        <p className="text-lg text-[var(--text-secondary)] font-medium">
                            Join thousands of creators who map their custom domains directly to the Hive blockchain. No databases to manage, no central authority.
                        </p>
                    </div>
                </div>

                {/* Right side form - Takes full width on mobile, 50% on desktop */}
                <div className="w-full md:w-1/2 flex px-6 lg:px-12 border-l border-[var(--border-color)] overflow-y-auto">
                    <div className="w-full max-w-lg mx-auto my-auto py-8 transition-all duration-500">
                        {!showSuccess ? (
                            <>
                                <div className="text-left mb-4">
                                    <h1 className="text-2xl font-black mb-1 tracking-tight">Map Your Node</h1>
                                    <p className="text-[var(--text-secondary)] text-xs">
                                        Point your hosted domain directly to your Hive Community.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <div className="p-3 bg-[var(--bg-card)] rounded-xl border border-[#ff4400]/20 shadow-[0_0_20px_rgba(255,68,0,0.05)]">
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#ff4400] mb-1 ml-1">
                                            Target Domain *
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. community.mywebsite.com"
                                            value={domainInput}
                                            onChange={(e) => setDomainInput(e.target.value)}
                                            className="w-full px-3 py-2 bg-[var(--bg-hover)] border border-[var(--border-color)] rounded-lg text-white font-mono text-sm focus:ring-2 focus:ring-[#ff4400] transition-all outline-none"
                                        />
                                        <p className="text-[9px] text-[var(--text-muted)] mt-1 font-medium">
                                            The exact domain URL where you will host the community.
                                        </p>
                                    </div>

                                    <div className="space-y-2.5">
                                        <div>
                                            <label className="block text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1 ml-1">
                                                Hive Community ID *
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. hive-123456"
                                                value={formData.hiveCommunityId}
                                                onChange={(e) => setFormData({ ...formData, hiveCommunityId: e.target.value.toLowerCase() })}
                                                className={`w-full px-3 py-2 bg-[var(--bg-card)] border rounded-lg text-[var(--text-primary)] text-sm focus:bg-[var(--bg-hover)] transition-all outline-none ${formData.hiveCommunityId && !isValidHiveId(formData.hiveCommunityId)
                                                    ? 'border-red-500 focus:border-red-500'
                                                    : 'border-[var(--border-color)] focus:border-[#ff4400]/50'
                                                    }`}
                                            />
                                            {formData.hiveCommunityId && !isValidHiveId(formData.hiveCommunityId) && (
                                                <p className="text-[10px] text-red-500 mt-1 font-bold animate-pulse">
                                                    ⚠️ ID must start with "hive-"
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1 ml-1">
                                                Display Name *
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. Hive Tech Talk"
                                                value={formData.communityName}
                                                onChange={(e) => setFormData({ ...formData, communityName: e.target.value })}
                                                className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm focus:bg-[var(--bg-hover)] focus:border-[#ff4400]/50 transition-all outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1 ml-1">
                                                Community Details (SEO)
                                            </label>
                                            <textarea
                                                required
                                                placeholder="Describe your community..."
                                                value={formData.communityDescription}
                                                onChange={(e) => setFormData({ ...formData, communityDescription: e.target.value })}
                                                className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:bg-[var(--bg-hover)] focus:border-[#ff4400]/50 transition-all outline-none h-14 resize-none text-sm"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1 ml-1">
                                                    Brand Color
                                                </label>
                                                <div className="flex gap-2 items-center">
                                                    <input
                                                        type="color"
                                                        value={formData.primaryColor}
                                                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                                        className="w-8 h-8 p-0 border border-[var(--border-color)] rounded-md cursor-pointer shrink-0"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={formData.primaryColor}
                                                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                                        className="flex-1 w-full px-2 py-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-md text-[var(--text-primary)] font-mono text-xs uppercase h-8"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1 ml-1">
                                                    Logo URL
                                                </label>
                                                <input
                                                    type="url"
                                                    placeholder="https://..."
                                                    value={formData.logoUrl}
                                                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                                    className="w-full px-3 py-0 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-md text-[var(--text-primary)] focus:bg-[var(--bg-hover)] transition-all outline-none text-xs h-8"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 bg-[#ff4400] text-white font-black tracking-wide text-sm rounded-lg hover:bg-[#e63d00] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 shadow-lg shadow-[#ff4400]/20"
                                    >
                                        {loading ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                                        ) : (
                                            "Save Configuration"
                                        )}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-8 animate-in fade-in zoom-in duration-500 overflow-y-auto">
                                <div className="w-20 h-20 bg-[#ff4400]/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(255,68,0,0.1)]">
                                    <svg className="w-10 h-10 text-[#ff4400]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-black mb-2 tracking-tight">Configuration Saved!</h2>
                                <p className="text-[var(--text-secondary)] mb-6 max-w-sm mx-auto">
                                    Your community is now mapped to <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">{configuredDomain}</span>.
                                </p>

                                {/* DNS Instructions Box */}
                                <div className="bg-black/20 border border-white/5 rounded-2xl p-6 mb-8 text-left space-y-4 max-w-lg mx-auto overflow-hidden">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 bg-[#ff4400]/10 rounded-lg">
                                            <Globe className="text-[#ff4400]" size={16} />
                                        </div>
                                        <h3 className="text-xs font-black uppercase tracking-widest text-[#ff4400]">Final Step: Connect Your Domain</h3>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Step 1: CNAME */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-[#ff4400] flex items-center justify-center text-[10px] font-bold text-white">1</div>
                                                <span className="text-[11px] font-bold text-white">Point your Domain (CNAME)</span>
                                            </div>
                                            <p className="text-[10px] text-[var(--text-secondary)] ml-7 leading-relaxed">
                                                Add this CNAME record in your domain registrar (Namecheap, GoDaddy, etc.) to link your site.
                                            </p>
                                            <div className="ml-7 group relative flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 transition-all cursor-pointer overflow-hidden"
                                                onClick={() => {
                                                    navigator.clipboard.writeText('nodes.sovraniche.com');
                                                    toast.success('CNAME value copied!');
                                                }}
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-bold text-white/30 uppercase tracking-wider">Target / Value</span>
                                                    <span className="text-sm font-mono font-bold text-white tracking-wider">nodes.sovraniche.com</span>
                                                </div>
                                                <Copy size={14} className="text-white/20 group-hover:text-[#ff4400] transition-colors" />
                                            </div>
                                        </div>

                                        {/* Step 2: Verification (Dynamic) */}
                                        {verificationData?.ownership_verification && (
                                            <div className="space-y-2 pt-2 border-t border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-full bg-[#ff4400] flex items-center justify-center text-[10px] font-bold text-white">2</div>
                                                    <span className="text-[11px] font-bold text-white">Verify Ownership (TXT Record)</span>
                                                </div>
                                                <p className="text-[10px] text-[var(--text-secondary)] ml-7 leading-relaxed">
                                                    Cloudflare requires this TXT record to issue your automated SSL certificate (Green Lock).
                                                </p>

                                                {/* TXT Record 1: Ownership */}
                                                <div className="ml-7 space-y-2">
                                                    <div className="group relative flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 transition-all cursor-pointer"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(verificationData.ownership_verification.value);
                                                            toast.success('TXT Value copied!');
                                                        }}
                                                    >
                                                        <div className="flex flex-col overflow-hidden">
                                                            <span className="text-[8px] font-bold text-white/30 uppercase tracking-wider">Host: {verificationData.ownership_verification.name.replace(`.${configuredDomain}`, '')}</span>
                                                            <span className="text-[11px] font-mono font-bold text-white truncate max-w-[200px]">{verificationData.ownership_verification.value}</span>
                                                        </div>
                                                        <Copy size={12} className="text-white/20 group-hover:text-[#ff4400] transition-colors" />
                                                    </div>

                                                    {/* Certificate TXT (If present) */}
                                                    {verificationData.ssl?.txt_name && (
                                                        <div className="group relative flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 transition-all cursor-pointer"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(verificationData.ssl.txt_value);
                                                                toast.success('SSL TXT Value copied!');
                                                            }}
                                                        >
                                                            <div className="flex flex-col overflow-hidden">
                                                                <span className="text-[8px] font-bold text-white/30 uppercase tracking-wider">Host: {verificationData.ssl.txt_name.replace(`.${configuredDomain}`, '')}</span>
                                                                <span className="text-[11px] font-mono font-bold text-white truncate max-w-[200px]">{verificationData.ssl.txt_value}</span>
                                                            </div>
                                                            <Copy size={12} className="text-white/20 group-hover:text-[#ff4400] transition-colors" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-2">
                                        <p className="text-[9px] text-white/30 text-center font-medium italic">
                                            SSL certificates usually activate within 10-60 minutes after DNS setup.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 pt-2 border-t border-white/5">
                                    <Check className="text-green-500 shrink-0 mt-0.5" size={12} />
                                    <p className="text-[9px] text-[var(--text-secondary)]">Please allow 24-48 hours for global propagation.</p>
                                </div>

                                <div className="space-y-3">
                                    <a
                                        href={`http://${configuredDomain}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-4 bg-[#ff4400] text-white font-black tracking-wide text-sm rounded-lg hover:bg-[#e63d00] active:scale-[0.98] transition-all shadow-lg shadow-[#ff4400]/20 flex items-center justify-center gap-2"
                                    >
                                        Visit Your Community
                                        <ExternalLink size={18} />
                                    </a>
                                    <button
                                        onClick={() => setShowSuccess(false)}
                                        className="w-full py-3 bg-[var(--bg-card)] text-[var(--text-secondary)] font-bold text-xs rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-all"
                                    >
                                        Back to Dashboard
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
