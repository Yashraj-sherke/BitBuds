import React, { useState } from 'react';
import bitMascot from '../../assets/bit-mascot.png';

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
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary font-accent text-lg font-extrabold text-white shadow-[0_4px_12px_-4px_rgba(79,70,229,0.6)]">
                B
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">BitBuds</span>
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

      <img
        src={bitMascot}
        alt=""
        aria-hidden
        loading="lazy"
        className="pointer-events-none absolute -bottom-8 -right-8 hidden h-52 w-52 select-none opacity-90 md:block"
      />
    </footer>
  );
};
