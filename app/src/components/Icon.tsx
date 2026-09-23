const raw = import.meta.glob('../assets/icons/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const icons: Record<string, string> = {};
for (const [path, svg] of Object.entries(raw)) {
  const name = path.split('/').pop()!.replace('.svg', '');
  // Director icons are drawn in #F2F0ED / white; recolour them through currentColor.
  icons[name] = svg
    .replace(/stroke="(#F2F0ED|#F1F4F6|white|#fff|#ffffff)"/gi, 'stroke="currentColor"')
    .replace(/fill="(#F2F0ED|#F1F4F6|white|#fff|#ffffff)"/gi, 'fill="currentColor"');
}

export type IconName =
  | 'arrow-down' | 'arrow-left' | 'arrow-right' | 'arrow-up' | 'bin' | 'button-close' | 'chevron-down' | 'chevron-up'
  | 'chevron-up-1' | 'chevron-up-2' | 'copy' | 'icon-film' | 'icon-time' | 'left-indent-image' | 'paper-clip' | 'pencil'
  | 'plus' | 'refresh' | 'status-active' | 'status-alert' | 'status-idle' | 'three-dots' | 'tiny-dot' | 'view' | 'Star';

interface Props {
  name: IconName;
  size?: number;
  filled?: boolean;
  className?: string;
  title?: string;
}

export function Icon({ name, size, filled, className, title }: Props) {
  let svg = icons[name] || '';
  if (filled) svg = svg.replace('<path ', '<path fill="currentColor" ');
  if (size) {
    svg = svg.replace(/<svg([^>]*?)width="([\d.]+)"([^>]*?)height="([\d.]+)"/, (_m, a, w, b, h) => {
      const ratio = Number(h) / Number(w);
      const W = Number(w) >= Number(h) ? size : size / ratio;
      const H = Number(w) >= Number(h) ? size * ratio : size;
      return `<svg${a}width="${W}"${b}height="${H}"`;
    });
  }
  return <span className={`icon ${className || ''}`} aria-hidden={!title} title={title} dangerouslySetInnerHTML={{ __html: svg }} />;
}
