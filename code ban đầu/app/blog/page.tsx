"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { useAdmin } from "@/lib/admin-context"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

export default function Blog() {
  const { posts } = useAdmin()

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog EcoGood</h1>
          <p className="text-lg opacity-90">Chia sẻ kiến thức về cuộc sống bền vững</p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <div className="bg-background border border-secondary/20 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer">
                  <ImageWithFallback src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm bg-secondary/20 text-primary px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-sm text-foreground/60">{post.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-3">{post.title}</h3>
                    <p className="text-foreground/70 mb-4">{post.excerpt}</p>
                    <button className="text-primary font-bold hover:text-primary/80 transition">Đọc tiếp →</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
