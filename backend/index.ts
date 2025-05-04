import { serve } from "bun"
import { generateCode } from "./utils"
import { writeFile, readFile } from "fs/promises"
import { join } from "path"
import { existsSync, mkdirSync } from "fs"

const DB_DIR = join(import.meta.dir, "..", "data")
const DB_PATH = join(DB_DIR, "db.json")

if (!existsSync(DB_DIR)) {
  mkdirSync(DB_DIR, { recursive: true })
}

async function loadDb() {
  try {
    const data = await readFile(DB_PATH, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    return {}
  }
}

async function saveDb(db: Record<string, string>) {
  await writeFile(DB_PATH, JSON.stringify(db, null, 2))
}

const db: Record<string, string> = await loadDb()

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

serve({
  async fetch(req: Request) {
    const url = new URL(req.url)

    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      })
    }

    const hostname = req.headers.get("host") || "localhost:8000"

    if (url.pathname === "/" && req.method === "GET") {
      return new Response(
        JSON.stringify({
          status: "ok",
          message: "Url kısaltıcı API çalışıyor!",
          version: "1.0.0",
          author: "Posgen - CorsPolicy",
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        },
      )
    }

    if (url.pathname === "/shorten" && req.method === "POST") {
      try {
        const data = await req.json()
        const { longUrl } = data

        if (!longUrl || typeof longUrl !== "string") {
          return new Response(JSON.stringify({ error: "URL is required." }), {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          })
        }

        const code = generateCode()
        db[code] = longUrl

        await saveDb(db)

        const shortUrl = `http://${hostname}/${code}`

        return new Response(JSON.stringify({ shortUrl }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        })
      } catch (error) {
        console.error("Error processing request:", error)
        return new Response(JSON.stringify({ error: "Internal server error" }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        })
      }
    }

    if (url.pathname !== "/shorten" && req.method === "GET") {
      const code = url.pathname.split("/")[1]
      const targetUrl = db[code]

      if (targetUrl) {
        return Response.redirect(targetUrl, 301)
      } else {
        return new Response(JSON.stringify({ error: "URL not found." }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        })
      }
    }

    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    })
  },
  port: 8000,
})

console.log("Backend sunucusu http://localhost:8000 adresinde çalışıyor!")
