import { getAllPosts } from '@/lib/api/controllers/blog.controller';
import { buildCanonicalUrl } from '@/lib/utils/affiliate';
import { BlogListContent } from '@/components/BlogListContent';
import type { Metadata } from 'next';

export const revalidate = 604800;

export const metadata: Metadata = {
  title: 'Blog - Audible Credit Guides & Tips',
  description:
    'Guides and tips for maximizing your Audible credit value. Learn how to choose the best audiobooks for your credits.',
  alternates: { canonical: buildCanonicalUrl('/blog') },
};

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogListContent posts={posts} />;
}
