"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LinkIcon, Loader2 } from "lucide-react"

interface UrlShortenerFormProps {
  onSubmit: (url: string) => Promise<void>
  isLoading: boolean
  error?: string | null
}

export function UrlShortenerForm({ onSubmit, isLoading, error }: UrlShortenerFormProps) {
  const [url, setUrl] = useState("")
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (error) {
      setLocalError(error)
    }
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // URL doğrulama
    if (!url) {
      setLocalError("Lütfen bir URL girin")
      return
    }

    // Basit URL doğrulama
    try {
      // URL'nin http:// veya https:// ile başlamasını sağla
      let urlToShorten = url
      if (!/^https?:\/\//i.test(url)) {
        urlToShorten = "https://" + url
      }

      new URL(urlToShorten)
      setLocalError(null)
      await onSubmit(urlToShorten)
    } catch (err) {
      setLocalError("Geçerli bir URL girin (örn: posgen.info)")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="url" className="text-sm font-medium text-gray-700">
          Kısaltmak istediğiniz URL&apos;yi girin
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <LinkIcon className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="url"
            type="text"
            placeholder="https://posgen.info/url-adresi"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-10 pr-4 py-3 h-12 text-base"
          />
        </div>
        {localError && <p className="text-sm text-red-500 mt-2">{localError}</p>}
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Kısaltılıyor...
          </>
        ) : (
          "URL'yi Kısalt"
        )}
      </Button>
    </form>
  )
}
