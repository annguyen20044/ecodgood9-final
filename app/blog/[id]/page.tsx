"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { useAdmin } from "@/lib/admin-context"
import { use } from "react"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

export default function BlogDetail({ params }: { params: Promise<{ id: string }> }) {
  const { posts } = useAdmin()
  const { id } = use(params)
  const post = posts.find((p) => p.id === Number.parseInt(id))

  if (!post) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="py-16 text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Bài viết không tìm thấy</h1>
          <Link href="/blog" className="text-primary hover:text-primary/80">
            Quay lại blog
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-secondary/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/blog" className="flex items-center gap-2 text-primary hover:text-secondary transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Quay lại blog</span>
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <section className="relative w-full h-64 md:h-80 overflow-hidden">
        <ImageWithFallback
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </section>

      {/* Blog Post */}
      <article className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title & Meta */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 -mt-32 relative z-10 mb-12">
            <div className="mb-6">
              <span className="inline-block bg-secondary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-primary mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap gap-4 md:gap-6 text-foreground/70 border-t border-secondary/10 pt-6">
                <div className="flex items-center gap-2">
                  <Calendar size={20} className="text-secondary" />
                  <span className="font-medium">{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={20} className="text-secondary" />
                  <span className="font-medium">EcoGood Team</span>
                </div>
              </div>
            </div>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-6 md:p-8 mb-12 border-l-4 border-secondary">
              <p className="text-lg md:text-xl text-foreground/80 italic leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div
              className="prose prose-lg md:prose-xl max-w-none
                prose-headings:text-primary prose-headings:font-bold 
                prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
                prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:border-b prose-h2:border-secondary/20 prose-h2:pb-2
                prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
                prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-secondary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-primary prose-strong:font-bold
                prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                prose-li:text-foreground/80 prose-li:mb-2
                prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
                prose-blockquote:border-l-4 prose-blockquote:border-secondary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-foreground/70 prose-blockquote:bg-secondary/5 prose-blockquote:py-4 prose-blockquote:rounded-r-lg
                prose-code:bg-secondary/10 prose-code:text-primary prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-xl prose-pre:overflow-x-auto
              "
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </article>

      <Footer />
    </main>
  )
}
