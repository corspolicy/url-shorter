import { NextResponse } from "next/server"

export async function GET() {
  try {
    const backendUrl = "http://localhost:8000"

    let backendStatus = "unknown"

    try {
      const response = await fetch(backendUrl, {
        method: "GET",
        signal: AbortSignal.timeout(2000),
      })

      if (response.ok) {
        try {
          const data = await response.json()
          backendStatus = data && data.status === "ok" ? "online" : "error"
        } catch (e) {
          backendStatus = "error"
        }
      } else {
        backendStatus = "error"
      }
    } catch (e) {
      console.error("Backend durumu hatalı:", e)
      backendStatus = "offline"
    }

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      backend: {
        url: backendUrl,
        status: backendStatus,
      },
    })
  } catch (error) {
    console.error("Backend kontrol hatası!:", error)
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Bilinmeyen hata!",
        backend: {
          url: "http://localhost:8000",
          status: "offline",
        },
      },
      { status: 500 },
    )
  }
}
