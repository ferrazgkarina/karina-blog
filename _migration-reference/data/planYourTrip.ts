export interface PlanYourTripItem {
  label: string;
  // Ícone já vem com o label desenhado dentro da imagem (feito no Canva) —
  // por isso não precisa de texto separado no componente, só o `alt`.
  icon: string;
  // 'post': linka pra um post/hub de conteúdo próprio da categoria.
  // 'bookYourTrip': linka direto pra uma seção da página Book Your Trip.
  // Mecanismo pronto e genérico — qual categoria usa qual tipo, e pra onde
  // exatamente, ainda está em aberto (depende de que conteúdo for criado
  // pra cada uma). Trocar aqui é só editar `linkType`/`linkTarget`.
  linkType: 'post' | 'bookYourTrip';
  linkTarget: string;
}

export const planYourTripItems: PlanYourTripItem[] = [
  { label: 'Flights', icon: '/images/plan-your-trip/flights.jpg', linkType: 'post', linkTarget: '#' },
  {
    label: 'Accommodation',
    icon: '/images/plan-your-trip/accommodation.jpg',
    linkType: 'bookYourTrip',
    linkTarget: '/book-your-trip/#hotels',
  },
  {
    label: 'Activities',
    icon: '/images/plan-your-trip/activities.jpg',
    linkType: 'bookYourTrip',
    linkTarget: '/book-your-trip/#activities',
  },
  {
    label: 'Rental Car',
    icon: '/images/plan-your-trip/rental-car.jpg',
    linkType: 'bookYourTrip',
    linkTarget: '/book-your-trip/#cars',
  },
  {
    label: 'Balloon Flight',
    icon: '/images/plan-your-trip/balloon-flight.jpg',
    linkType: 'bookYourTrip',
    linkTarget: '/book-your-trip/#balloons',
  },
  { label: 'Food', icon: '/images/plan-your-trip/food.jpg', linkType: 'post', linkTarget: '#' },
];
