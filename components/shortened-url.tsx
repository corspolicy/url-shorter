"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Copy, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShortenedUrlProps {
  url: string
}

export function ShortenedUrl({ url }: ShortenedUrlProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Kopyalama başarısız oldu:", err)
    }
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-lg font-medium text-gray-800">Kısaltılmış URL&apos;niz hazır!</h3>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            value={url}
            readOnly
            className={cn(
              "pr-24 font-medium text-purple-600 bg-purple-50 border-purple-100 focus-visible:ring-purple-200",
              copied && "bg-green-50 text-green-600 border-green-100",
            )}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs hover:bg-purple-100 hover:text-purple-700"
              onClick={copyToClipboard}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Kopyala</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="shrink-0"
          onClick={() => window.open(url, "_blank")}
          title="URL'yi yeni sekmede aç"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
        <p>
          Bu kısaltılmış URL&apos;yi istediğiniz yerde paylaşabilirsiniz. URL&apos;ye tıklayan herkes otomatik olarak
          orijinal adrese yönlendirilecektir.
        </p>
      </div>
    </div>
  )
}
