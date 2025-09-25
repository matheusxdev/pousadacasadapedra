export const transfers = [
  {
    slug: 'rent-a-car',
    title: 'RENT A CAR',
    image: 'https://casadapedraviajes.com/wp-content/uploads/2025/04/WhatsApp-Image-2022-10-10-at-13.28.29-1.png.webp',
    description: 'Alugue um carro com praticidade e segurança.',
  },
  {
    slug: 'transfer-regular',
    title: 'TRANSFER REGULAR',
    image: 'https://casadapedraviajes.com/wp-content/uploads/2025/04/Transfer-Regular-6.webp',
    description: 'Traslado compartilhado com horários fixos.',
  },
  {
    slug: 'transfer-privado',
    title: 'TRANSFER PRIVADO',
    image: 'https://casadapedraviajes.com/wp-content/uploads/2025/04/transfer-privado-rio-buzios-06.jpg',
    description: 'Serviço exclusivo porta a porta.',
  },
] as const;

export type Transfer = typeof transfers[number];
