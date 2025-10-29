"use client"

import { useAdmin } from "@/lib/admin-context"
import Link from "next/link"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

export default function Blog() {
  const { posts } = useAdmin()

  const displayPosts = posts.slice(0, 9)

  return (
    <section id="sustainability" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">Chuyện EcoGood</h2>
          <p className="text-foreground/70 text-lg">Những câu chuyện về bền vững và cuộc sống xanh</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <article className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer border border-secondary/20 hover:border-secondary/50 h-full flex flex-col">
                <ImageWithFallback src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-secondary/20 text-primary px-2 py-1 rounded">{post.category}</span>
                    <span className="text-xs text-foreground/60">{post.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-2 line-clamp-2 h-14">{post.title}</h3>
                  <p className="text-foreground/70 mb-4 flex-1 line-clamp-3 h-20">{post.excerpt}</p>
                  <button className="text-primary font-semibold hover:text-primary/80 transition text-sm mt-auto">
                    Đọc thêm →
                  </button>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
