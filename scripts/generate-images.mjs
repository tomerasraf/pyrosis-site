/**
 * Nano Banana Pro (models/nano-banana-pro-preview) image generation
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const API_KEY  = 'AIzaSyB4b_4643_x0Zug1X1ecK_XVhOQtxdGniA'
const OUT_DIR  = path.resolve(fileURLToPath(import.meta.url), '../../public/images')
const MODEL    = 'gemini-2.0-flash-exp-image-generation'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`

const images = [
  {
    file: 'hero-main.png',
    prompt: `Professional commercial product photography. Three vibrant craft soda cans — one bold orange, one deep berry-pink, one tropical teal-green — arranged in a dynamic diagonal composition on a warm cream background. Fresh sliced oranges, plump blueberries, and juicy mango pieces scattered naturally around the cans. Dramatic side lighting, soft shadows, ultra-sharp. Clean minimal advertising aesthetic. No text, no logos.`,
  },
  {
    file: 'flavor-citrus.png',
    prompt: `Close-up product photography of a single bold orange-red aluminum soda can with condensation droplets, tilted at a playful angle on a warm cream background. Fresh-cut orange slices, whole yuzu citrus, a sprig of rosemary, scattered glistening ice cubes. Bright vivid editorial food photography. Photorealistic, no text.`,
  },
  {
    file: 'flavor-berry.png',
    prompt: `Product photography of a single deep magenta-crimson aluminum soda can with condensation on a warm cream background. Surrounded by plump wild blueberries, dried hibiscus flowers, elderberries, scattered ice. Bold saturated colors, editorial style. Photorealistic, no text.`,
  },
  {
    file: 'flavor-tropical.png',
    prompt: `Tropical product photography of a single teal-green aluminum soda can covered in condensation on a warm cream background. Ripe mango slices, fresh coconut pieces showing white flesh, pineapple chunks, a large tropical leaf. Bright natural lighting. Photorealistic, no text.`,
  },
  {
    file: 'flavor-grape.png',
    prompt: `Rich moody product photography of a single deep purple-violet aluminum soda can on cream background. Surrounded by dark concord grape clusters, split vanilla bean pods, fresh lavender sprigs. Dramatic side lighting, deep jewel tones. Photorealistic, no text.`,
  },
  {
    file: 'flavor-lemon.png',
    prompt: `Bright product photography of a single golden-yellow aluminum soda can with sparkling condensation on cream background. Halved Meyer lemons, fresh mint sprigs, a few basil leaves, scattered glistening ice. Clean electric refreshing mood. Photorealistic, no text.`,
  },
  {
    file: 'flavor-cherry.png',
    prompt: `Dramatic product photography of a single ruby-red aluminum soda can on cream background. Fresh dark cherries with stems, dried rose petals, cherry blossoms. Moody directional lighting. Rich saturated tones. Photorealistic, no text.`,
  },
]

async function generate(item) {
  process.stdout.write(`⏳  ${item.file} ... `)

  const res = await fetch(ENDPOINT, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        role: 'user',
        parts: [{
          text: `Generate a high-quality photorealistic image: ${item.prompt}\n\nReturn only the image, no text explanation.`
        }]
      }],
      generationConfig: {
        responseModalities: ['IMAGE', 'TEXT'],
        temperature: 1,
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`HTTP ${res.status}: ${err.slice(0, 400)}`)
  }

  const data   = await res.json()
  const parts  = data?.candidates?.[0]?.content?.parts ?? []
  const imgPart = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'))

  if (!imgPart) {
    const textPart = parts.find(p => p.text)
    throw new Error(`No image part. Text: "${(textPart?.text ?? '').slice(0, 200)}"`)
  }

  const ext      = imgPart.inlineData.mimeType === 'image/jpeg' ? 'jpg' : 'png'
  const outFile  = item.file.replace(/\.\w+$/, `.${ext}`)
  const filePath = path.join(OUT_DIR, outFile)
  fs.writeFileSync(filePath, Buffer.from(imgPart.inlineData.data, 'base64'))
  const kb = Math.round(fs.statSync(filePath).size / 1024)
  console.log(`✅  ${outFile} (${kb} KB)`)
  return outFile
}

async function main() {
  console.log(`\n🍌  FIZZR — Nano Banana Pro Image Generation\n`)
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const results = []
  for (const item of images) {
    try {
      const saved = await generate(item)
      results.push({ file: item.file, saved, ok: true })
    } catch (err) {
      console.log(`❌  ${err.message}`)
      results.push({ file: item.file, ok: false, err: err.message })
    }
    await new Promise(r => setTimeout(r, 1200))
  }

  console.log('\n─────────────────────────────')
  console.log(`✨  ${results.filter(r => r.ok).length}/${results.length} generated successfully`)
  if (results.some(r => !r.ok)) {
    console.log('Failed:', results.filter(r => !r.ok).map(r => r.file).join(', '))
  }
  console.log()
}

main()
