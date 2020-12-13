export default async function handler(req, res) {
    const {
        query: {slug},
        method,
    } = req

    const recipientServiceName = slug[0]
    const recipientServiceUrl = process.env[recipientServiceName]
    const input = `${recipientServiceUrl}/${slug[1]}`

    if (!recipientServiceUrl) {
        res.status(502).end(`Cannot process request`)
        return
    }

    switch (method) {
        case 'GET':
            const serviceResponse = await fetch(input)
            const json = await serviceResponse.json()
            res.status(200).json(json)
            break
        case 'POST':
            res.status(200).json({body: 'Not implemented'})
            break
        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}
