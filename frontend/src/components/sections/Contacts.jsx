import React, { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { MapPin, Phone, Mail, Send, Loader2, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { useInView } from "../../hooks/useInView";
import bgSimple2 from "../../assets/bg_simple2.png";

// ── Floating Label Input ──────────────────────────────────────────────────────
function FloatField({ label, name, type = "text", as: As = "input", rows }) {
    const [focused, setFocused] = useState(false);
    const [value, setValue]     = useState("");

    const active = focused || value.length > 0;

    const baseClass = `
        peer w-full rounded-xl border bg-slate-50 px-3.5 pt-5 pb-1.5 sm:px-4 sm:pt-6 sm:pb-2 text-xs sm:text-sm text-slate-900
        outline-none transition-all duration-200
        focus:border-[#007CA7] focus:bg-white focus:ring-2 focus:ring-[#007CA7]/20
        border-slate-200
    `;

    const props = {
        name,
        type,
        value,
        onChange: (e) => setValue(e.target.value),
        onFocus:  () => setFocused(true),
        onBlur:   () => setFocused(false),
        className: baseClass + (As === "textarea" ? " resize-none" : ""),
        ...(rows && { rows }),
    };

    return (
        <div className="relative">
            <As {...props} placeholder=" " />
            <label
                className={`pointer-events-none absolute left-4 transition-all duration-200 font-medium ${
                    active
                        ? "top-2 text-[10px] text-[#007CA7] uppercase tracking-wide"
                        : "top-1/2 -translate-y-1/2 text-sm text-slate-400"
                }`}
                style={As === "textarea" && !active ? { top: "1rem", transform: "none" } : {}}
            >
                {label}
            </label>
        </div>
    );
}

// ── Contact Info Item ─────────────────────────────────────────────────────────
function InfoItem({ icon: Icon, title, children }) {
    return (
        <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#007CA7]/10">
                <Icon size={22} className="text-[#007CA7]" />
            </div>
            <div>
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <div className="mt-1 text-sm leading-relaxed text-gray-600">{children}</div>
            </div>
        </div>
    );
}

// ── Contacts ──────────────────────────────────────────────────────────────────
function Contacts() {
    const form = useRef();
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [headerRef, headerVisible] = useInView(0.2);
    const [leftRef, leftVisible]     = useInView(0.15);
    const [rightRef, rightVisible]   = useInView(0.15);

    const [contactData, setContactData] = useState({
        address: "Kompleks Prima Center 1, Block I No.8\nJl. Pool PPD, Kedaung, Kaliangke\nJakarta Barat 11710, Indonesia",
        phone: "+6221 – 5401398",
        whatsapp: "+62 812 3456 7890",
        email: "info@ciptamajupersada.com",
        mapsUrl: "https://maps.app.goo.gl/kGG8DmYXPHVyemac8"
    });

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.ok && data?.data?.contact) {
                    setContactData(data.data.contact);
                }
            })
            .catch(() => {});
    }, []);

    const sendEmail = async (e) => {
        e.preventDefault();
        setStatus("loading");
        const formData = new FormData(form.current);
        const payload = {
            name: formData.get("user_name"),
            email: formData.get("user_email"),
            message: formData.get("message")
        };

        try {
            // 1. Simpan pesan ke Backend API Inbox
            await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // 2. Kirim via EmailJS jika key terpasang
            try {
                await emailjs.sendForm(
                    "YOUR_SERVICE_ID",
                    "YOUR_TEMPLATE_ID",
                    form.current,
                    "YOUR_PUBLIC_KEY"
                );
            } catch {
                // EmailJS fallback silent
            }

            setStatus("success");
            form.current.reset();
        } catch {
            setStatus("error");
        }
        // reset after 4s
        setTimeout(() => setStatus("idle"), 4000);
    };

    return (
        <div id="contact">
            <section className="relative overflow-hidden bg-white py-10 sm:py-14 md:py-20 px-4 sm:px-6 lg:px-12">

                {/* Background Canvas (bg_simple2.png) */}
                <div 
                    className="absolute inset-0 pointer-events-none bg-no-repeat bg-cover bg-center opacity-85"
                    style={{ 
                        backgroundImage: `url(${bgSimple2})`,
                        maskImage: 'linear-gradient(to bottom, transparent 0%, black 100px, black calc(100% - 60px), transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100px, black calc(100% - 60px), transparent 100%)'
                    }}
                />

                {/* Header */}
                <div
                    ref={headerRef}
                    style={{
                        opacity:    headerVisible ? 1 : 0,
                        transform:  headerVisible ? "none" : "translateY(30px)",
                        transition: headerVisible
                            ? "opacity 0.7s ease, transform 0.7s ease"
                            : "opacity 0.25s ease, transform 0.25s ease",
                    }}
                    className="relative z-10 mx-auto max-w-4xl text-center"
                >
                    <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.28em] text-[#00A3E0]">Let's Talk</p>
                    <h2 className="mt-2 text-2xl sm:text-3xl md:text-[42px] lg:text-5xl font-extrabold text-[#03365b] tracking-tight leading-tight">
                        Contact <span className="text-[#00A3E0]">Us.</span>
                    </h2>
                    <div className="mx-auto mt-2.5 sm:mt-3.5 h-1 sm:h-1.5 w-14 sm:w-20 rounded-full bg-[#00A3E0]" />
                    <p className="mt-3 sm:mt-4 text-xs sm:text-base md:text-lg leading-relaxed md:leading-8 text-slate-600 px-2 sm:px-4">
                        Get in touch with us for your next engineering project.
                    </p>
                </div>

                <div className="relative z-10 mx-auto mt-8 sm:mt-10 md:mt-12 grid max-w-5xl gap-4 sm:gap-6 md:gap-8 px-1 sm:px-2 md:grid-cols-2">

                    {/* Info panel */}
                    <div
                        ref={leftRef}
                        style={{
                            opacity:    leftVisible ? 1 : 0,
                            transform:  leftVisible ? "none" : "translateX(-40px)",
                            transition: leftVisible
                                ? "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s"
                                : "opacity 0.25s ease, transform 0.25s ease",
                        }}
                        className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#007CA7] to-[#005f80] p-4 sm:p-6 md:p-8 shadow-xl text-white text-center md:text-left"
                    >
                        <h2 className="text-lg sm:text-2xl font-bold">Get In Touch</h2>
                        <p className="mt-2 text-white/80 text-xs sm:text-sm leading-relaxed">
                            We're always ready to discuss new projects and challenges. Reach out through any of the channels below.
                        </p>

                        <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-5 text-left">
                            <div className="flex items-start gap-3.5">
                                <div className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/20">
                                    <MapPin size={18} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-white">Location</h3>
                                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-white/80 whitespace-pre-line">
                                        {contactData.address}
                                        <br />
                                        <span className="text-white/60">Office hours: 08.00 – 17.00 WIB</span>
                                    </p>

                                    {/* Modern Google Maps Button */}
                                    <div className="mt-3">
                                        <a
                                            href={contactData.mapsUrl || "https://maps.app.goo.gl/kGG8DmYXPHVyemac8"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-xl bg-white/15 hover:bg-white text-white hover:text-[#007CA7] border border-white/25 hover:border-white px-3.5 py-2 text-xs font-semibold backdrop-blur-md transition-all duration-300 shadow-sm hover:shadow-[0_8px_20px_rgba(0,0,0,0.18)] group/map cursor-pointer"
                                        >
                                            <MapPin size={14} className="text-[#38BDF8] group-hover/map:text-[#007CA7] transition-colors" />
                                            <span>Open in Google Maps</span>
                                            <ExternalLink size={13} className="text-white/70 group-hover/map:text-[#007CA7] group-hover/map:translate-x-0.5 group-hover/map:-translate-y-0.5 transition-all duration-200" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5">
                                <div className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/20">
                                    <Phone size={18} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white">Phone / WhatsApp</h3>
                                    <p className="mt-1 text-xs sm:text-sm text-white/80 whitespace-pre-line">
                                        {contactData.phone}
                                        {contactData.whatsapp && `\nWA: ${contactData.whatsapp}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5">
                                <div className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/20">
                                    <Mail size={18} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white">Email</h3>
                                    <a href={`mailto:${contactData.email || 'info@ciptamajupersada.com'}`} className="mt-1 block text-xs sm:text-sm text-white/80 hover:text-white transition-colors">
                                        {contactData.email || 'info@ciptamajupersada.com'}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form panel */}
                    <div
                        ref={rightRef}
                        style={{
                            opacity:    rightVisible ? 1 : 0,
                            transform:  rightVisible ? "none" : "translateX(40px)",
                            transition: rightVisible
                                ? "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s"
                                : "opacity 0.25s ease, transform 0.25s ease",
                        }}
                        className="rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 md:p-8 shadow-lg text-center md:text-left"
                    >
                        <h2 className="text-lg sm:text-2xl font-bold text-[#03365b]">
                            Send Us <span className="text-[#00A3E0]">A Message.</span>
                        </h2>
                        <p className="mt-1.5 text-xs text-slate-500">We typically reply within one business day.</p>

                        <form ref={form} onSubmit={sendEmail} className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                            <FloatField label="Your Name" name="user_name" />
                            <FloatField label="Your Email" name="user_email" type="email" />
                            <FloatField label="Your Message" name="message" as="textarea" rows={3} />

                            <button
                                type="submit"
                                disabled={status === "loading" || status === "success"}
                                className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                                    status === "success"
                                        ? "bg-emerald-500 text-white"
                                        : status === "error"
                                        ? "bg-red-500 text-white"
                                        : "bg-[#007CA7] text-white hover:bg-[#005f80] hover:shadow-lg hover:shadow-[#007CA7]/25 hover:scale-[1.01]"
                                } disabled:cursor-not-allowed disabled:opacity-80`}
                            >
                                {status === "loading" && <Loader2 size={16} className="animate-spin" />}
                                {status === "success" && <CheckCircle2 size={16} />}
                                {status === "error"   && <XCircle size={16} />}
                                {status === "idle"    && <Send size={16} />}

                                {status === "loading" && "Sending…"}
                                {status === "success" && "Message Sent!"}
                                {status === "idle"    && "Send Message"}
                            </button>
                        </form>
                    </div>

                </div>
            </section>
        </div>
    );
}

export default Contacts;