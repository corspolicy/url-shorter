import { serve } from "bun"

const db: Record<string, string> = {}

const generateCode = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

serve({
  async fetch(req: Request) {
    const url = new URL(req.url)

    const hostname = req.headers.get("host") || "localhost:8000" // host yoksa localhost:8000 yapıstır

    if (url.pathname === "/shorten" && req.method === "POST") {
      const data = await req.json() 
      const { longUrl } = data

      if (!longUrl || typeof longUrl !== "string") {
        return new Response(JSON.stringify({ error: "Url gerekli!" }), {
          status: 400,
        })
      }

      const code = generateCode()
      db[code] = longUrl

      await Bun.write("db.json", JSON.stringify(db, null, 2)) 

      const shortUrl = `http://${hostname}/${code}`

      return new Response(JSON.stringify({ shortUrl }), {
        status: 200,
      })
    }

    if (url.pathname !== "/shorten" && req.method === "GET") {
      const code = url.pathname.split("/")[1]
      const targetUrl = db[code]

      if (targetUrl) {
        return Response.redirect(targetUrl, 301)
      } else {
        return new Response(JSON.stringify({ error: "Url bulunamadı!" }), {
          status: 404,
        })
      }
    }

    return new Response("Not Found", { status: 404 })
  },
  port: 8000,
})

console.log("Sunucu başlatıldı!: http://localhost:8000")
