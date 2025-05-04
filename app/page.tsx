"use client"

import type React from "react"

import { useState } from "react"
import { UrlShortenerForm } from "@/components/url-shortener-form"
import { ShortenedUrl } from "@/components/shortened-url"
import { LinkIcon, ArrowRightIcon, ExternalLinkIcon } from "lucide-react"
import { BackendStatus } from "@/components/backend-status"

export default function Home() {
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUrlShorten = async (url: string) => {
    try {
      setError(null)
      setIsLoading(true)
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ longUrl: url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "URL kısaltma işlemi başarısız oldu")
      }

      if (!data.shortUrl) {
        throw new Error("Geçersiz yanıt formatı: shortUrl bulunamadı")
      }

      setShortenedUrl(data.shortUrl)
    } catch (error) {
      console.error("Hata:", error)
      setError(error instanceof Error ? error.message : "URL kısaltma işlemi başarısız oldu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="w-full max-w-3xl mx-auto space-y-12">
        <div className="flex justify-center">
          <BackendStatus />
        </div>
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-purple-600 p-3 rounded-full">
              <LinkIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            URL Kısaltıcı
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Uzun URL&apos;lerinizi anında kısaltın ve paylaşımı kolaylaştırın. Hızlı, güvenli ve tamamen ücretsiz!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
          <UrlShortenerForm onSubmit={handleUrlShorten} isLoading={isLoading} error={error} />

          {shortenedUrl && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <ShortenedUrl url={shortenedUrl} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<ArrowRightIcon className="h-6 w-6 text-purple-600" />}
            title="Hızlı Kısaltma"
            description="Tek tıklamayla uzun URL'lerinizi anında kısaltın."
          />
          <FeatureCard
            icon={<ExternalLinkIcon className="h-6 w-6 text-purple-600" />}
            title="Kolay Paylaşım"
            description="Kısaltılmış URL'leri kolayca kopyalayıp paylaşın."
          />
          <FeatureCard
            icon={<LinkIcon className="h-6 w-6 text-purple-600" />}
            title="Güvenilir Yönlendirme"
            description="Güvenli ve hızlı yönlendirme ile hedef URL'ye ulaşın."
          />
        </div>
      </div>
    </main>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
