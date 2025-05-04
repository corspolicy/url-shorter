import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { longUrl } = await request.json()

    if (!longUrl || typeof longUrl !== "string") {
      return NextResponse.json({ error: "URL is required." }, { status: 400 })
    }

    const backendUrl = "http://localhost:8000/shorten"

    console.log(`Backend URL: ${backendUrl}`)

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ longUrl }),
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = "URL kısaltma işlemi başarısız oldu"

      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.error || errorMessage
      } catch (e) {
      }

      console.error(`Backend error: ${response.status} - ${errorText}`)
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("API hatası:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Sunucu hatası",
      },
      { status: 500 },
    )
  }
}
