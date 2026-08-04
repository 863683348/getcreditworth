 'use client';
 
 import { ChevronLeft, ChevronRight } from 'lucide-react';
 import { useI18n } from '@/lib/i18n';
 
 interface PaginationProps {
   current: number;
   total: number;
   pageSize: number;
   onPageChange: (page: number) => void;
   onPageSizeChange: (size: number) => void;
 }
 
 const PAGE_SIZES = [100, 200, 300, 400, 500];
 
 export function Pagination({ current, total, pageSize, onPageChange, onPageSizeChange }: PaginationProps) {
   const { t } = useI18n();
   const totalPages = Math.ceil(total / pageSize);
   const from = total === 0 ? 0 : (current - 1) * pageSize + 1;
   const to = Math.min(current * pageSize, total);
 
   if (total <= pageSize) return null;
 
   return (
     <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
       <div className="flex items-center gap-2 text-sm text-text-secondary">
         <span>{t.pagination.showing.replace('{from}', String(from)).replace('{to}', String(to)).replace('{total}', String(total))}</span>
         <span className="hidden sm:inline">|</span>
         <span className="hidden sm:inline">{t.pagination.perPage}:</span>
         <select
           className="hidden sm:inline-block bg-bg-surface border border-border rounded px-2 py-1 text-xs text-text-primary"
           value={pageSize}
           onChange={(e) => { onPageSizeChange(Number(e.target.value)); onPageChange(1); }}
         >
           {PAGE_SIZES.map((s) => (
             <option key={s} value={s}>{s}</option>
           ))}
         </select>
       </div>
 
       <div className="flex items-center gap-1">
         <button
           className="btn btn-outline text-xs py-1.5 px-2.5 disabled:opacity-30"
           disabled={current <= 1}
           onClick={() => onPageChange(current - 1)}
         >
           <ChevronLeft className="h-3.5 w-3.5" />
           <span className="ml-1 hidden sm:inline">{t.pagination.prev}</span>
         </button>
 
         {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
           let p: number;
           if (totalPages <= 5) p = i + 1;
           else if (current <= 3) p = i + 1;
           else if (current >= totalPages - 2) p = totalPages - 4 + i;
           else p = current - 2 + i;
           return (
             <button key={p}
               className={'w-8 h-8 text-xs rounded-md font-mono ' + (p === current ? 'bg-primary text-white' : 'bg-bg-surface text-text-secondary hover:bg-border')}
               onClick={() => onPageChange(p)}
             >{p}</button>
           );
         })}
 
         <button
           className="btn btn-outline text-xs py-1.5 px-2.5 disabled:opacity-30"
           disabled={current >= totalPages}
           onClick={() => onPageChange(current + 1)}
         >
           <span className="mr-1 hidden sm:inline">{t.pagination.next}</span>
           <ChevronRight className="h-3.5 w-3.5" />
         </button>
       </div>
     </div>
   );
 }
