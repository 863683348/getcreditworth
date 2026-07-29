 'use client';
 
 import { BookOpen, ListChecks } from 'lucide-react';
 import Link from 'next/link';
 import type { Book } from '@/lib/types';
 import { BookExplorer } from '@/components/BookExplorer';
 import { ItemListJsonLd } from '@/components/seo/JsonLd';
 import { buildAudibleTrialUrl } from '@/lib/utils/affiliate';
import { useI18n } from '@/lib/i18n';
 import { getCuratedLists } from '@/lib/data/books';
 import { formatDate } from '@/lib/utils/format';
 
 interface AllBooksContentProps {
   books: Book[];
 }
 
 export function AllBooksContent({ books }: AllBooksContentProps) {
   const { t } = useI18n();
   const curatedLists = getCuratedLists();
 
   return (
     <>
       <ItemListJsonLd books={books} name="All Audiobooks" />
 
       <div className="container-content py-6 md:py-8">
         <div className="mb-6">
           <div className="flex items-center gap-2 mb-2">
             <BookOpen className="h-5 w-5 text-primary" />
             <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
               {t.booksPage.title}
             </h1>
           </div>
           <p className="text-sm text-text-secondary">
             {t.booksPage.subtitle.replace('{count}', String(books.length))}
           </p>
         </div>
 
         <BookExplorer
           books={books}
           showRank={false}
           emptyMessage={t.home.emptyMessage}
         />
 
         {/* Curated Lists Preview */}
         {curatedLists.length > 0 && (
           <div className="mt-12 pt-8 border-t border-border">
             <div className="flex items-center justify-between mb-6">
               <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-text-primary">
                 <ListChecks className="h-5 w-5 text-primary" />
                 {t.booksPage.curatedTitle || 'Curated Lists'}
               </h2>
               <Link
                 href="/curated"
                 className="text-sm text-primary hover:text-primary-hover font-medium"
               >
                 {t.booksPage.viewAll || 'View all'}
               </Link>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {curatedLists.slice(0, 4).map((list) => (
                 <Link
                   key={list.slug}
                   href={`/curated/${list.slug}`}
                   className="card p-4 group"
                 >
                   <span className="inline-block text-xs font-medium text-primary bg-primary-50 px-2 py-0.5 rounded mb-2">
                     {list.category}
                   </span>
                   <h3 className="font-serif font-semibold text-text-primary group-hover:text-primary mb-1 line-clamp-1">
                     {list.title}
                   </h3>
                   <p className="text-sm text-text-secondary line-clamp-2 mb-2">
                     {list.description}
                   </p>
                   <p className="text-xs text-text-muted">
                     {list.bookAsins.length} books - Updated {formatDate(list.updatedAt)}
                   </p>
                 </Link>
               ))}
             </div>
           </div>
         )}
       </div>
     </>
   );
 }
