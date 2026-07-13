import React, { useState } from 'react';
import { motion } from 'framer-motion';
import bitMascot from '../../assets/bit-mascot.png';
import logoAsset from '../../assets/logo.png';

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="mb-4 font-accent text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
        {title}
      </div>
      <ul className="space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="text-foreground/80 transition-colors hover:text-foreground">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const LandingFooter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="relative overflow-hidden border-t border-border bg-background pt-20 pb-10">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <div className="flex items-center">
              <img src={logoAsset} alt="BitBuds Logo" className="h-10 w-auto object-contain" />
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              The coding adventure kids ask for by name. Built by teachers, parents, and slightly obsessive game designers.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setSubscribed(true);
              }}
              className="mt-6 flex w-full max-w-md items-center gap-2 rounded-full bg-card p-1.5 ring-1 ring-border"
            >
              <input
                type="email"
                required
                aria-label="Parent email for newsletter"
                placeholder="your@family.email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-w-0 flex-1 bg-transparent px-4 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition-transform active:scale-95"
              >
                {subscribed ? "You're in ✓" : 'Get updates'}
              </button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground">
              Monthly letter for grown-ups. No spam, no dark patterns.
            </p>
          </div>

          <FooterCol
            title="Adventure"
            links={[
              { label: 'Worlds', href: '#worlds' },
              { label: 'How it works', href: '#how' },
              { label: 'Pricing', href: '#pricing' },
            ]}
          />
          <FooterCol
            title="For grown-ups"
            links={[
              { label: 'Parents', href: '#parents' },
              { label: 'Teachers', href: '#teachers' },
              { label: 'Schools', href: '#pricing' },
            ]}
          />
          <FooterCol
            title="Safety & trust"
            links={[
              { label: 'Privacy policy', href: '#' },
              { label: 'COPPA', href: '#' },
              { label: 'Contact', href: '#' },
            ]}
          />
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} BitBuds, Inc. Made with care for curious kids.</p>
          <div className="flex items-center gap-4">
            {['Twitter', 'Instagram', 'YouTube'].map((s) => (
              <a key={s} href="#" className="text-xs font-medium text-muted-foreground hover:text-foreground">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-2 right-6 hidden md:flex items-end gap-3 select-none z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-8 max-w-[200px] rounded-2xl bg-primary/10 border border-primary/20 px-3.5 py-2.5 text-xs font-bold text-primary shadow-lg backdrop-blur-md"
        >
          Let's save the floating worlds! 🚀
          <span className="absolute right-3 -bottom-1.5 size-3 rotate-45 border-r border-b border-primary/20 bg-background" />
        </motion.div>
        <motion.img
          src={bitMascot}
          alt="Bit mascot waving"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="h-36 w-auto object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]"
        />
      </div>
    </footer>
  );
};
