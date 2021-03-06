import { SiteClient } from 'datocms-client'

export default async function communitiesApi(req, res) {
  if (req.method === 'POST') {
    const TOKEN = process.env.NEXT_PUBLIC_API_DATOCMS_TOKEN_FULL
    const modelId = process.env.NEXT_PUBLIC_API_DATOCMS_MODEL_ID
    const client = new SiteClient(TOKEN)
    const record = await client.items.create({
      itemType: modelId, // Model ID for communities
      ...req.body,
    })

    res.json({
      data: 'Some date here',
      record,
    })

    return
  }

  res.status(404).json({
    message: 'Not Found',
  })
}
