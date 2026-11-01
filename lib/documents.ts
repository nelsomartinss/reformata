export type SiteDocument = {
  slug: string;
  href: string;
  /** Nome curto usado na navegação. */
  label: string;
  /** Nome completo usado em títulos. */
  title: string;
};

export const siteDocuments: SiteDocument[] = [
  { slug: 'biblia', href: '/biblia', label: 'Bíblia', title: 'Bíblia Sagrada' },
  {
    slug: 'catecismo-maior',
    href: '/catecismo-maior',
    label: 'Catecismo Maior',
    title: 'Catecismo Maior de Westminster',
  },
  {
    slug: 'breve-catecismo',
    href: '/breve-catecismo',
    label: 'Breve Catecismo',
    title: 'Breve Catecismo de Westminster',
  },
  {
    slug: 'confissao-de-fe',
    href: '/confissao-de-fe',
    label: 'Confissão de Fé',
    title: 'Confissão de Fé de Westminster',
  },
  {
    slug: '95-teses',
    href: '/95-teses',
    label: '95 Teses',
    title: '95 Teses de Martinho Lutero',
  },
  {
    slug: '5-solas',
    href: '/5-solas',
    label: '5 Solas',
    title: 'As 5 Solas da Reforma Protestante',
  },
];

export function findDocumentByPath(pathname: string) {
  return siteDocuments.find(
    (document) =>
      pathname === document.href || pathname.startsWith(document.href + '/'),
  );
}
