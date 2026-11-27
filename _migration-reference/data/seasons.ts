export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface SeasonCard {
  label: string;
  href: string;
  isHub?: boolean;
  // Campo que o post mensal precisaria ter no Sanity, pra saber a qual
  // estação pertence (usado pelo hub sazonal e por filtros futuros).
  season?: Season;
  // Foto com o nome da estação já desenhado nela (mesmo estilo dos ícones
  // do Plan your trip) — quando presente, substitui o placeholder cinza e
  // o label em HTML (o texto já está na imagem).
  icon?: string;
}

// Uma card por estação (não mais 3 meses + 1 hub) — ordem fixa
// Winter, Spring, Summer, Fall. `href` ainda aponta pra '#': decidir depois
// se cada uma linka pro anchor da estação dentro do guia sazonal único ou
// pra um post próprio.
export const seasonCards: SeasonCard[] = [
  { label: 'Winter', href: '/blog/cappadocia-in-winter/', season: 'winter', icon: '/images/seasons/winter.jpg' },
  { label: 'Spring', href: '#', season: 'spring', icon: '/images/seasons/spring.jpg' },
  { label: 'Summer', href: '#', season: 'summer', icon: '/images/seasons/summer.jpg' },
  { label: 'Fall', href: '#', season: 'autumn', icon: '/images/seasons/fall.jpg' },
];
