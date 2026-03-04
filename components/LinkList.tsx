const links = [
  {
    label: 'Layer One Group',
    href: 'https://layeronegroup.com',
    icon: '↗',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/joescannell', // PLACEHOLDER -- confirm slug in Plan 01-03
    icon: '↗',
  },
  {
    label: 'Twitter / X',
    href: 'https://twitter.com/joescannell', // PLACEHOLDER -- confirm handle in Plan 01-03
    icon: '↗',
  },
  {
    label: 'Email',
    href: 'mailto:hello@layeronegroup.com',
    icon: '→',
  },
]

export function LinkList() {
  return (
    <nav aria-label="Links" className="flex flex-col gap-2 w-full max-w-xs">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith('mailto:') ? undefined : '_blank'}
          rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
          className="flex items-center justify-between px-4 py-3 rounded-full border border-[var(--color-border)] text-sm font-medium text-[var(--color-text)] bg-white/60 hover:bg-white hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors shadow-sm"
        >
          <span>{link.label}</span>
          <span className="text-xs opacity-60">{link.icon}</span>
        </a>
      ))}
    </nav>
  )
}
