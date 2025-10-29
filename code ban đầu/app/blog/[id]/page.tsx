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
    <main className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-secondary/10 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="flex items-center gap-2 text-primary hover:text-primary/80 transition">
            <ArrowLeft size={20} />
            Quay lại blog
          </Link>
        </div>
      </div>

      <section className="w-full h-96 md:h-[500px] overflow-hidden">
        <ImageWithFallback
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </section>

      {/* Blog Post */}
      <article className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">{post.title}</h1>
            <div className="flex flex-wrap gap-4 text-foreground/70">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>EcoGood Team</span>
              </div>
              <span className="bg-secondary/20 text-primary px-3 py-1 rounded-full text-sm">{post.category}</span>
            </div>
          </div>

          <div
            className="prose prose-lg max-w-none text-foreground/80 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      <Footer />
    </main>
  )
}
