"use client"

import { useAdmin } from "@/lib/admin-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Briefcase, MapPin, Clock, Users } from "lucide-react"

export default function Careers() {
  const { jobs } = useAdmin()

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cơ hội Tuyển dụng</h1>
          <p className="text-lg opacity-90">Gia nhập đội ngũ EcoGood và cùng xây dựng tương lai bền vững</p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 bg-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-4">Tại sao gia nhập EcoGood?</h2>
            <p className="text-foreground/80 max-w-2xl mx-auto">
              Chúng tôi là một công ty cam kết với sự bền vững và tạo tác động tích cực cho môi trường. Nếu bạn đam mê
              công việc và muốn làm việc trong một môi trường năng động, EcoGood là nơi dành cho bạn.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-background p-6 rounded-lg border border-secondary/20">
              <Users size={32} className="text-primary mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Đội ngũ Chuyên nghiệp</h3>
              <p className="text-foreground/80">
                Làm việc với những chuyên gia tài năng và đam mê trong lĩnh vực của họ.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border border-secondary/20">
              <Briefcase size={32} className="text-primary mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Phát triển Sự nghiệp</h3>
              <p className="text-foreground/80">Cơ hội học tập, đào tạo và phát triển kỹ năng liên tục.</p>
            </div>
            <div className="bg-background p-6 rounded-lg border border-secondary/20">
              <Clock size={32} className="text-primary mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Cân bằng Công việc</h3>
              <p className="text-foreground/80">Chúng tôi tin vào sự cân bằng giữa công việc và cuộc sống cá nhân.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-8">Vị trí Tuyển dụng</h2>

          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/60 text-lg">
                Hiện tại không có vị trí tuyển dụng nào. Vui lòng quay lại sau.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-background border border-secondary/20 rounded-lg p-6 hover:shadow-lg transition"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-primary mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-foreground/80">
                        <div className="flex items-center gap-1">
                          <Briefcase size={16} />
                          <span>{job.department}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{job.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{job.salary}</p>
                    </div>
                  </div>

                  <p className="text-foreground/80 mb-4">{job.description}</p>

                  <div className="mb-4">
                    <h4 className="font-bold text-primary mb-2">Yêu cầu:</h4>
                    <ul className="list-disc list-inside space-y-1 text-foreground/80">
                      {job.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Không tìm thấy vị trí phù hợp?</h2>
          <p className="text-lg opacity-90 mb-6">Liên hệ với chúng tôi qua email hoặc điện thoại để gửi CV của bạn.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:0826071111"
              className="inline-block bg-secondary text-primary px-8 py-3 rounded font-bold hover:bg-secondary/90 transition"
            >
              Gọi: 0826 071 111
            </a>
            <a
              href="mailto:Giaminh.ecogood68@gmail.com"
              className="inline-block bg-secondary text-primary px-8 py-3 rounded font-bold hover:bg-secondary/90 transition"
            >
              Email: Giaminh.ecogood68@gmail.com
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
