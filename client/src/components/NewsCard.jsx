import { motion } from "framer-motion";

import { formatPublishedDate } from "../utils/date";






export function NewsCard({ article, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.26, delay: Math.min(index * 0.05, 0.16) }}
      className="w-64 shrink-0 overflow-hidden rounded-app bg-white shadow-card ring-1 ring-slate-100">
      
      <img src={article.imageUrl} alt="" className="h-32 w-full object-cover" loading="lazy" />
      <div className="p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-app-primary">
          {article.source ?? "World Cup"}
        </p>
        <h3 className="line-clamp-2 text-sm font-extrabold leading-5 text-app-ink">
          {article.title}
        </h3>
        <time className="mt-3 block text-xs font-semibold text-app-muted">
          {formatPublishedDate(article.publishedAt)}
        </time>
      </div>
    </motion.article>);

}