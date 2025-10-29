"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { useAdmin } from "@/lib/admin-context"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { Calendar, User, ArrowRight } from "lucide-react"

export default function Blog() {
  const { posts } = useAdmin()

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Blog EcoGood</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            Chia sẻ kiến thức về cuộc sống bền vững và thân thiện với môi trường
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <article className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col hover:-translate-y-2 border border-secondary/10 hover:border-secondary/30">
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-video">
                    <ImageWithFallback 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block bg-secondary/90 backdrop-blur-sm text-primary px-4 py-2 rounded-full text-sm font-semibold">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-sm text-foreground/60 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} className="text-secondary" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={16} className="text-secondary" />
                        <span>EcoGood</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-primary mb-3 line-clamp-2 group-hover:text-secondary transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-foreground/70 mb-4 flex-1 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-2 text-secondary font-semibold group-hover:gap-4 transition-all">
                      <span>Đọc tiếp</span>
                      <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-foreground/70">Chưa có bài viết nào</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
