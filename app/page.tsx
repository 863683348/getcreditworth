import { getTopBookList } from '@/lib/api/controllers/book.controller';
import { HomeContent } from '@/components/HomeContent';
import { SITE_CONFIG } from '@/lib/config';

export const revalidate = 3600; // ISR: 每小时再生

export const metadata = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  const topBooks = getTopBookList(100);

  return <HomeContent topBooks={topBooks} />;
}
