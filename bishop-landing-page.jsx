import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#F8F9FC",
  bgDark: "#0B1224",
  bgCard: "#FFFFFF",
  bgCardHover: "#F3F5FA",
  accent: "#1B2E5A",
  accentLight: "#2A4478",
  accentMid: "#3D5A99",
  accentSoft: "#DCE3F0",
  warm: "#D4943A",
  warmSoft: "#FDF2DD",
  text: "#0F172A",
  textMuted: "#5A6477",
  textLight: "#8E95A5",
  border: "#DEE2EC",
  borderLight: "#ECEEF4",
};

const InfoTooltip = ({ text, learnMoreUrl }) => {
  const [show, setShow] = useState(false);
  const ref = useRef(null);

  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: 6 }}>
      <span
        ref={ref}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 18, height: 18, borderRadius: "50%", background: COLORS.accentSoft,
          color: COLORS.accent, fontSize: 11, fontWeight: 700, cursor: "pointer",
          transition: "all 0.2s", border: `1px solid ${COLORS.accent}33`,
        }}
      >?</span>
      {show && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
          background: COLORS.bgDark, color: "#fff", padding: "12px 16px", borderRadius: 10,
          fontSize: 13, lineHeight: 1.5, width: 260, zIndex: 100, boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}>
          <div style={{ marginBottom: learnMoreUrl ? 8 : 0 }}>{text}</div>
          {learnMoreUrl && (
            <a href={learnMoreUrl} target="_blank" rel="noopener noreferrer" style={{
              color: COLORS.warm, fontSize: 12, fontWeight: 600, textDecoration: "none",
            }}>Learn more →</a>
          )}
          <div style={{
            position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0, borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent", borderTop: `6px solid ${COLORS.bgDark}`,
          }} />
        </div>
      )}
    </span>
  );
};

const ContactPreference = ({ selected, onChange }) => {
  const containerRef = useRef(null);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setCompact(entry.contentRect.width < 220);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const options = [
    { id: "email", label: "Email", icon: "✉" },
    { id: "text", label: "Text", icon: "💬" },
    { id: "phone", label: "Phone", icon: "📞" },
  ];
  return (
    <div ref={containerRef} style={{ display: "flex", gap: "3%", width: "100%" }}>
      {options.map(opt => (
        <button key={opt.id} onClick={() => onChange(opt.id)} style={{
          flex: "1 1 31%", minWidth: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: compact ? 0 : "0.4em",
          padding: "clamp(6px, 2.5%, 10px) clamp(4px, 3%, 18px)",
          borderRadius: 8,
          border: `2px solid ${selected === opt.id ? COLORS.accent : COLORS.border}`,
          background: selected === opt.id ? COLORS.accentSoft : "transparent",
          color: selected === opt.id ? COLORS.accent : COLORS.textMuted,
          fontWeight: selected === opt.id ? 600 : 400,
          fontSize: "clamp(11px, 1.1vw + 6px, 14px)",
          cursor: "pointer", transition: "all 0.2s",
          whiteSpace: "nowrap", overflow: "hidden",
          boxSizing: "border-box",
        }}>
          {!compact && <span style={{ fontSize: "1em", lineHeight: 1, flexShrink: 0 }}>{opt.icon}</span>}
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{opt.label}</span>
        </button>
      ))}
    </div>
  );
};

const ProductCard = ({ id, icon, title, subtitle, description, agentRequired, features, ctaText, onClick, delay }) => {
  const [hovered, setHovered] = useState(false);
  const [contactPref, setContactPref] = useState("email");
  const [visible, setVisible] = useState(false);
  const cardRef = useRef(null);
  const [cardCompact, setCardCompact] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay || 0);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!cardRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setCardCompact(entry.contentRect.width < 260);
      }
    });
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      id={id}
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: COLORS.bgCard,
        borderRadius: 16,
        border: `1px solid ${hovered ? COLORS.accent + "44" : COLORS.border}`,
        padding: "clamp(20px, 5%, 32px)",
        display: "flex",
        flexDirection: "column",
        gap: "clamp(10px, 3%, 16px)",
        transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        transform: visible ? (hovered ? "translateY(-4px)" : "translateY(0)") : "translateY(20px)",
        opacity: visible ? 1 : 0,
        boxShadow: hovered ? "0 12px 40px rgba(27, 46, 90, 0.12)" : "0 2px 8px rgba(0,0,0,0.04)",
        flex: "1 1 30%",
        minWidth: "min(280px, 100%)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: cardCompact ? 8 : 12 }}>
        {!cardCompact && (
          <div style={{
            width: 48, height: 48, borderRadius: 12, display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 24,
            background: `linear-gradient(135deg, ${COLORS.accentSoft}, ${COLORS.warmSoft})`,
            flexShrink: 0,
          }}>{icon}</div>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: "clamp(16px, 1.2vw + 8px, 20px)", fontWeight: 700, color: COLORS.text, fontFamily: "'DM Serif Display', Georgia, serif", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
          <div style={{ fontSize: "clamp(11px, 0.8vw + 5px, 13px)", color: COLORS.textMuted }}>{subtitle}</div>
        </div>
      </div>

      <p style={{ fontSize: "clamp(13px, 0.9vw + 6px, 15px)", lineHeight: 1.6, color: COLORS.textMuted, margin: 0 }}>{description}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "clamp(12px, 0.8vw + 6px, 14px)", color: COLORS.text }}>
            <span style={{ color: COLORS.accent, fontSize: 14, fontWeight: 700 }}>✓</span>
            <span>{f.text}</span>
            {f.tooltip && <InfoTooltip text={f.tooltip} learnMoreUrl={f.learnMoreUrl} />}
          </div>
        ))}
      </div>

      {agentRequired && (
        <div style={{
          background: COLORS.warmSoft, borderRadius: 10,
          padding: "clamp(10px, 3%, 14px) clamp(12px, 4%, 16px)",
          border: `1px solid ${COLORS.warm}33`,
        }}>
          <div style={{ fontSize: "clamp(11px, 0.8vw + 5px, 13px)", fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>
            ⚡ Heads up before you start
          </div>
          <div style={{ fontSize: "clamp(11px, 0.8vw + 5px, 13px)", color: COLORS.textMuted, lineHeight: 1.5, marginBottom: 10 }}>
            After quoting, we review your results and finalize everything behind the scenes. 
            Occasionally, carriers may have underwriting questions we'll need to relay — and we 
            only reach out the way you choose. Pick your preferred contact method:
          </div>
          <ContactPreference selected={contactPref} onChange={setContactPref} />
        </div>
      )}

      <button onClick={onClick} style={{
        marginTop: "auto", width: "100%",
        padding: "clamp(10px, 3%, 14px) clamp(12px, 4%, 24px)",
        borderRadius: 10, border: "none",
        background: hovered ? COLORS.accentLight : COLORS.accent, color: "#fff",
        fontSize: "clamp(13px, 1vw + 7px, 15px)", fontWeight: 600,
        cursor: "pointer", transition: "all 0.3s",
        letterSpacing: 0.2, boxSizing: "border-box",
      }}>
        {ctaText}
      </button>
    </div>
  );
};

const LifeInsuranceModal = ({ open, onClose }) => {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (!open || scriptLoaded.current) return;
    scriptLoaded.current = true;
    const script = document.createElement("script");
    script.src = "https://cdn.quoteandapply.io/widget.js";
    script.setAttribute("data-strife-key", "_BnXH7RrYvWL2gim");
    script.setAttribute("data-strife-container-id", "container-id");
    document.body.appendChild(script);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        display: open ? "flex" : "none",
        alignItems: "flex-start", justifyContent: "center",
        background: "rgba(11, 18, 36, 0.85)",
        backdropFilter: "blur(4px)",
        overflowY: "auto", padding: "40px 16px",
      }}
    >
      <div style={{
        background: COLORS.bg, borderRadius: 20,
        width: "100%", maxWidth: 1020,
        padding: "clamp(20px, 4%, 36px)",
        position: "relative", boxSizing: "border-box",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h2 style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "clamp(20px, 2vw + 10px, 26px)", margin: 0, color: COLORS.text,
            }}>Life Insurance Quotes</h2>
            <p style={{ color: COLORS.textMuted, fontSize: 14, margin: "6px 0 0" }}>
              Compare rates from top-rated carriers. No agent needed. No calls.
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: "50%", flexShrink: 0, marginLeft: 16,
            border: `1px solid ${COLORS.border}`, background: COLORS.bgCard,
            cursor: "pointer", fontSize: 20, color: COLORS.textMuted,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>×</button>
        </div>

        <div style={{
          background: COLORS.accentSoft, borderRadius: 10,
          padding: "10px 16px", marginBottom: 24,
          fontSize: 13, color: COLORS.accent, fontWeight: 500,
        }}>
          🔒 Your information goes directly to carriers for quoting — nowhere else. We never sell your data.
        </div>

        <div id="container-id" />
      </div>
    </div>
  );
};

const StepIndicator = ({ number, title, description, isLast }) => (
  <div style={{ display: "flex", gap: 16, position: "relative" }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{
        width: 40, height: 40, borderRadius: "50%", background: COLORS.accent,
        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, fontWeight: 700, flexShrink: 0,
      }}>{number}</div>
      {!isLast && <div style={{ width: 2, flex: 1, background: COLORS.accentSoft, minHeight: 40 }} />}
    </div>
    <div style={{ paddingBottom: isLast ? 0 : 24 }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 4, fontFamily: "'DM Serif Display', Georgia, serif" }}>{title}</div>
      <div style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.6 }}>{description}</div>
    </div>
  </div>
);

export default function BishopLandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [lifeModalOpen, setLifeModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", color: COLORS.text, background: COLORS.bg }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        padding: "clamp(12px, 2%, 16px) clamp(16px, 4%, 32px)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 12,
        background: scrolled ? "rgba(248,249,252,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${COLORS.border}` : "1px solid transparent",
        transition: "all 0.3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, background: COLORS.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: 16, fontFamily: "'DM Serif Display', Georgia, serif",
          }}>B</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>Bishop & Associates</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, letterSpacing: 0.5, textTransform: "uppercase" }}>Independent Insurance Agency</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="#products" style={{ fontSize: 14, color: COLORS.textMuted, textDecoration: "none", fontWeight: 500 }}>Products</a>
          <a href="#how-it-works" style={{ fontSize: 14, color: COLORS.textMuted, textDecoration: "none", fontWeight: 500 }}>How It Works</a>
          <a href="#about" style={{ fontSize: 14, color: COLORS.textMuted, textDecoration: "none", fontWeight: 500 }}>About</a>
          <button style={{
            padding: "8px 20px", borderRadius: 8, border: `1px solid ${COLORS.accent}`,
            background: "transparent", color: COLORS.accent, fontSize: 14,
            fontWeight: 600, cursor: "pointer",
          }}>Client Portal</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        maxWidth: 1100, margin: "0 auto", padding: "80px 32px 60px",
        textAlign: "center",
      }}>
        <h1 style={{
          fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 400, lineHeight: 1.15,
          fontFamily: "'DM Serif Display', Georgia, serif", margin: "0 0 20px",
          maxWidth: 800, marginLeft: "auto", marginRight: "auto",
        }}>
          Insurance that respects<br />
          <span style={{ color: COLORS.accent }}>your time and your privacy</span>
        </h1>

        <p style={{
          fontSize: 18, color: COLORS.textMuted, lineHeight: 1.7,
          maxWidth: 620, margin: "0 auto 16px", fontWeight: 400,
        }}>
          Compare rates from dozens of carriers in minutes — not days. 
          No one calls you. No one sells your information. 
          Just honest coverage at the best price, on your terms.
        </p>

        <p style={{
          fontSize: 15, color: COLORS.textLight, lineHeight: 1.6,
          maxWidth: 540, margin: "0 auto 40px", fontStyle: "italic",
        }}>
          We work in the background so you can check insurance off your list and get back to life.
        </p>

        <a href="#products" style={{
          display: "inline-block", padding: "16px 36px", borderRadius: 12,
          background: COLORS.accent, color: "#fff", fontSize: 16,
          fontWeight: 600, textDecoration: "none", letterSpacing: 0.2,
          boxShadow: "0 4px 16px rgba(27, 46, 90, 0.3)",
          transition: "transform 0.2s",
        }}>
          Start Comparing Rates
        </a>

        <div style={{
          display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap",
          marginTop: 20,
        }}>
          {[
            { label: "Life Insurance", icon: "🛡️", href: "#life-insurance" },
            { label: "Auto Insurance", icon: "🚗", href: "#auto-insurance" },
            { label: "Home Insurance", icon: "🏠", href: "#home-insurance" },
          ].map(({ label, icon, href }) => (
            <a key={href} href={href} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 22px", borderRadius: 10,
              border: `1.5px solid ${COLORS.border}`,
              background: COLORS.bgCard, color: COLORS.text,
              fontSize: 14, fontWeight: 500, textDecoration: "none",
              transition: "all 0.2s",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}>
              <span>{icon}</span>
              <span>{label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* TRUST STRIP */}
      <section style={{
        maxWidth: 1100, margin: "0 auto", padding: "0 32px 60px",
      }}>
        <div style={{
          display: "flex", gap: 1, borderRadius: 16, overflow: "hidden",
          border: `1px solid ${COLORS.border}`, background: COLORS.border,
          flexWrap: "wrap",
        }}>
          {[
            { icon: "🔒", title: "Your data stays here", desc: "We never sell your information to third parties. Period." },
            { icon: "🚫", title: "No surprise calls", desc: "You choose if, when, and how we contact you." },
            { icon: "⚡", title: "Quotes in minutes", desc: "Compare multiple carriers instantly — no waiting on callbacks." },
            { icon: "🤝", title: "250+ carriers", desc: "We shop the market so you get the best rate possible." },
          ].map((item, i) => (
            <div key={i} style={{
              flex: "1 1 180px", padding: "24px 20px", background: COLORS.bgCard,
              textAlign: "center",
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: COLORS.text }}>{item.title}</div>
              <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PAIN POINT CALLOUT */}
      <section style={{
        maxWidth: 1100, margin: "0 auto", padding: "0 32px 60px",
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.bgDark})`,
          borderRadius: 20, padding: "48px 40px", color: "#fff",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -60, right: -60, width: 200, height: 200,
            borderRadius: "50%", background: COLORS.accentMid + "20",
          }} />
          <div style={{
            position: "absolute", bottom: -40, left: -40, width: 150, height: 150,
            borderRadius: "50%", background: COLORS.warm + "15",
          }} />

          <div style={{ position: "relative", zIndex: 1, maxWidth: 700 }}>
            <div style={{ fontSize: 13, color: COLORS.warm, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>
              We get it
            </div>
            <h2 style={{
              fontSize: 28, fontFamily: "'DM Serif Display', Georgia, serif",
              fontWeight: 400, lineHeight: 1.3, margin: "0 0 16px",
            }}>
              Tired of getting 47 calls after requesting one quote?
            </h2>
            <p style={{ fontSize: 16, color: "#B0B3BA", lineHeight: 1.7, margin: "0 0 24px" }}>
              Most insurance sites collect your info and sell it to the highest bidder. 
              Suddenly your phone won't stop ringing and your inbox is flooded. We built this differently.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "Your information goes directly to carriers for quoting — nowhere else",
                "You are our client, not a lead to be sold",
                "We're here to look out for you, not sell to you",
                "If you need us, we're one message away. If you don't, enjoy the silence.",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "#D4D6DB" }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: "50%", background: COLORS.accent,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, color: "#fff", flexShrink: 0,
                  }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT CARDS */}
      <section id="products" style={{
        maxWidth: 1100, margin: "0 auto", padding: "0 32px 80px",
      }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{
            fontSize: 36, fontFamily: "'DM Serif Display', Georgia, serif",
            fontWeight: 400, margin: "0 0 12px",
          }}>
            What are you looking to cover?
          </h2>
          <p style={{ fontSize: 16, color: COLORS.textMuted, margin: 0 }}>
            Select a product below to compare real rates from multiple carriers — all in one place, all at once.
          </p>
        </div>

        <div style={{ display: "flex", gap: "2%", flexWrap: "wrap" }}>
          <ProductCard
            id="life-insurance"
            icon="🛡️"
            title="Life Insurance"
            subtitle="Fully self-service • No agent needed"
            description="Compare term, whole life, IUL, and more from top-rated carriers. Quote, compare, and apply — entirely on your own schedule."
            agentRequired={false}
            features={[
              { text: "Instant multi-carrier quotes", tooltip: "See rates from dozens of A-rated carriers side by side in seconds.", learnMoreUrl: "#" },
              { text: "Complete application online", tooltip: "Paperless applications via DocuSign — no printing, scanning, or mailing.", learnMoreUrl: "#" },
              { text: "No exam options available", tooltip: "Many carriers offer accelerated underwriting based on your medical records. No needles required.", learnMoreUrl: "#" },
              { text: "Coverage as fast as same day", tooltip: "Some carriers offer instant decisions. Your timeline depends on the product and carrier.", learnMoreUrl: "#" },
            ]}
            ctaText="Compare Life Insurance Rates →"
            onClick={() => setLifeModalOpen(true)}
            delay={100}
          />

          <ProductCard
            id="auto-insurance"
            icon="🚗"
            title="Auto Insurance"
            subtitle="Self-service quote • Agent finalizes"
            description="Get real-time comparative quotes from multiple carriers with one form. We review your results and lock in the best deal for you."
            agentRequired={true}
            features={[
              { text: "One form, multiple carriers", tooltip: "Enter your information once and see rates from all available carriers in your state.", learnMoreUrl: "#" },
              { text: "Real-time rate comparison", tooltip: "No waiting for callbacks — see actual rates from carriers competing for your business.", learnMoreUrl: "#" },
              { text: "We finalize, you approve", tooltip: "After quoting, we review your options and handle the paperwork. You just give the thumbs up.", learnMoreUrl: "#" },
            ]}
            ctaText="Compare Auto Insurance Rates →"
            onClick={() => {}}
            delay={200}
          />

          <ProductCard
            id="home-insurance"
            icon="🏠"
            title="Home Insurance"
            subtitle="Self-service quote • Agent finalizes"
            description="With premiums rising, shopping matters more than ever. See what carriers are competing to offer you — all in one place."
            agentRequired={true}
            features={[
              { text: "One form, multiple carriers", tooltip: "Your information is entered once and sent to all available carriers simultaneously.", learnMoreUrl: "#" },
              { text: "Real-time rate comparison", tooltip: "Watch carriers compete for your business in real time. No games, no gimmicks.", learnMoreUrl: "#" },
              { text: "Coverage advice included", tooltip: "We'll review your quotes and make sure you're not overpaying or underinsured. It's what we do.", learnMoreUrl: "#" },
            ]}
            ctaText="Compare Home Insurance Rates →"
            onClick={() => {}}
            delay={300}
          />
        </div>

        {/* BUNDLE CALLOUT */}
        <div style={{
          marginTop: 24, borderRadius: 16, padding: "28px 32px",
          background: `linear-gradient(135deg, ${COLORS.accentSoft}, ${COLORS.warmSoft})`,
          border: `1px solid ${COLORS.accent}22`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>📦</span>
              <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "'DM Serif Display', Georgia, serif" }}>Bundle & Save</span>
              <InfoTooltip text="Bundling auto + home (or adding life) often unlocks multi-policy discounts across carriers. We'll automatically surface the best combinations." learnMoreUrl="#" />
            </div>
            <p style={{ fontSize: 14, color: COLORS.textMuted, margin: 0, maxWidth: 520 }}>
              Quote auto and home together to unlock multi-policy discounts. We'll find the best combination across all carriers automatically.
            </p>
          </div>
          <button style={{
            padding: "12px 28px", borderRadius: 10, border: `2px solid ${COLORS.accent}`,
            background: COLORS.bgCard, color: COLORS.accent, fontSize: 15,
            fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
          }}>
            Quote Auto + Home Together →
          </button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{
        maxWidth: 1100, margin: "0 auto", padding: "0 32px 80px",
      }}>
        <div style={{ display: "flex", gap: 60, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{ fontSize: 13, color: COLORS.accent, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>
              How it works
            </div>
            <h2 style={{
              fontSize: 32, fontFamily: "'DM Serif Display', Georgia, serif",
              fontWeight: 400, margin: "0 0 12px", lineHeight: 1.3,
            }}>
              Insurance in minutes,<br />not hours
            </h2>
            <p style={{ fontSize: 15, color: COLORS.textMuted, lineHeight: 1.7, margin: "0 0 32px" }}>
              We've stripped away everything that makes buying insurance painful. 
              No hour-long phone calls. No office visits. No one selling your data. 
              Just coverage you can trust, done your way.
            </p>
          </div>

          <div style={{ flex: 1, minWidth: 300 }}>
            <StepIndicator
              number={1}
              title="Pick your coverage"
              description="Select what you need — life, auto, home, or bundle them together. Each option shows you exactly what to expect before you start."
            />
            <StepIndicator
              number={2}
              title="Answer a few questions"
              description="Fill out one simple form. Your information goes directly to carriers for quoting — it's never sold or shared with anyone else."
            />
            <StepIndicator
              number={3}
              title="Compare real rates"
              description="See side-by-side quotes from multiple carriers competing for your business. Hover over anything you don't understand — we've built explanations right in."
            />
            <StepIndicator
              number={4}
              title="We handle the rest"
              description="For life insurance, complete your application right here. For auto and home, we review the quote you chose, and reach out only the way you asked us to to finalize the details and put the policy in place. Then you're done."
              isLast
            />
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section id="about" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px 80px" }}>
        <div style={{
          background: COLORS.bgCard, borderRadius: 20, padding: "56px 48px",
          border: `1px solid ${COLORS.border}`, textAlign: "center",
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: COLORS.accentSoft,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, margin: "0 auto 20px",
          }}>🤝</div>

          <h2 style={{
            fontSize: 30, fontFamily: "'DM Serif Display', Georgia, serif",
            fontWeight: 400, margin: "0 0 16px", lineHeight: 1.3,
          }}>
            Here to look out for you —<br />not to sell to you
          </h2>

          <p style={{
            fontSize: 16, color: COLORS.textMuted, lineHeight: 1.7,
            maxWidth: 600, margin: "0 auto 12px",
          }}>
            Bishop & Associates is an independent insurance agency. That means we don't work for any one carrier — 
            we work for you. With access to 250+ carriers, our only job is finding you the best coverage at the best price.
          </p>

          <p style={{
            fontSize: 15, color: COLORS.textLight, lineHeight: 1.6,
            maxWidth: 520, margin: "0 auto 32px", fontStyle: "italic",
          }}>
            We quietly have your back so you can focus on everything else.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#products" style={{
              display: "inline-block", padding: "14px 32px", borderRadius: 10,
              background: COLORS.accent, color: "#fff", fontSize: 15,
              fontWeight: 600, textDecoration: "none",
            }}>Start Comparing Rates</a>
            <a href="#" style={{
              display: "inline-block", padding: "14px 32px", borderRadius: 10,
              background: "transparent", color: COLORS.accent, fontSize: 15,
              fontWeight: 600, textDecoration: "none", border: `2px solid ${COLORS.accent}`,
            }}>Learn About Us</a>
          </div>
        </div>
      </section>

      <LifeInsuranceModal open={lifeModalOpen} onClose={() => setLifeModalOpen(false)} />

      {/* FOOTER */}
      <footer style={{
        maxWidth: 1100, margin: "0 auto", padding: "32px 32px 48px",
        borderTop: `1px solid ${COLORS.border}`,
        display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 24,
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Bishop & Associates Agency, LLC</div>
          <div style={{ fontSize: 13, color: COLORS.textMuted }}>Independent Insurance Agency • Licensed in 12 States</div>
          <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 8 }}>
            Ohio (Resident) • AZ • CA • GA • IL • IN • KY • MO • NC • NV • TX • WI
          </div>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Products</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {["Life Insurance", "Auto Insurance", "Home Insurance", "Commercial"].map(item => (
                <a key={item} href="#" style={{ fontSize: 13, color: COLORS.textLight, textDecoration: "none" }}>{item}</a>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Company</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {["About Us", "Privacy Policy", "Contact", "Client Portal"].map(item => (
                <a key={item} href="#" style={{ fontSize: 13, color: COLORS.textLight, textDecoration: "none" }}>{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
