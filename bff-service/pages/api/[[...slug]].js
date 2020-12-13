export default function handler(req, res) {
    const {
        query: { slug },
        method,
    } = req

    if (!process.env[slug[0]]) {
        res.status(502).end(`Cannot process request`)
        return
    }

    switch (method) {
        case 'GET':
            res.status(200).json({ slug, env: process.env[slug[0]] })
            break
        case 'POST':
            res.status(200).json({ body: 'Not implemented' })
            break
        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}
