"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type BackendStatus = "online" | "offline" | "error" | "unknown" | "checking"

export function BackendStatus() {
  const [status, setStatus] = useState<BackendStatus>("checking")
  const [backendUrl, setBackendUrl] = useState<string>("")
  const [retryCount, setRetryCount] = useState(0)

  const checkBackendStatus = async () => {
    try {
      setStatus("checking")
      const response = await fetch("/api/health")
      const data = await response.json()

      if (data.backend) {
        setStatus(data.backend.status)
        setBackendUrl(data.backend.url)
      } else {
        setStatus("error")
      }
    } catch (error) {
      console.error("Backend status check failed:", error)
      setStatus("error")
    }
  }

  useEffect(() => {
    checkBackendStatus()

    const interval = setInterval(() => {
      checkBackendStatus()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (status === "offline" && retryCount < 3) {
      const timer = setTimeout(() => {
        setRetryCount((prev) => prev + 1)
        checkBackendStatus()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [status, retryCount])

  const getStatusDetails = () => {
    switch (status) {
      case "online":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          text: "Çevrimiçi",
          variant: "success" as const,
        }
      case "offline":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: "Çevrimdışı",
          variant: "destructive" as const,
        }
      case "error":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: "Hata",
          variant: "destructive" as const,
        }
      case "checking":
        return {
          icon: <HelpCircle className="h-4 w-4" />,
          text: "Kontrol ediliyor...",
          variant: "outline" as const,
        }
      default:
        return {
          icon: <HelpCircle className="h-4 w-4" />,
          text: "Bilinmiyor",
          variant: "outline" as const,
        }
    }
  }

  const details = getStatusDetails()

  return (
    <div className="flex flex-col items-center space-y-2">
      <Badge variant={details.variant} className="flex items-center gap-1 px-2 py-1">
        {details.icon}
        <span>Backend: {details.text}</span>
      </Badge>

      {(status === "offline" || status === "error") && (
        <div className="text-xs text-red-500 text-center max-w-xs">
          <p className="mb-2">Backend çalışmıyor. Lütfen aşağıdaki adımları izleyin:</p>
          <ol className="text-left list-decimal pl-4 space-y-1">
            <li>
              Terminal'de <code className="bg-gray-100 px-1 rounded">yarn dev</code> komutunun çalıştığından emin olun
            </li>
            <li>Backend'in başlatılmasını bekleyin.</li>
            <li>
              Eğer hala çalışmıyorsa, proje klasöründe bulunan {" "}
              <code className="bg-gray-100 px-1 rounded">Windows için: start-dev.bat | Linux için start-dev.sh</code>  dosyasını çalıştırın.
            </li>
          </ol>
          <Button variant="outline" size="sm" className="mt-2" onClick={checkBackendStatus}>
            Tekrar Kontrol Et
          </Button>
        </div>
      )}
    </div>
  )
}
