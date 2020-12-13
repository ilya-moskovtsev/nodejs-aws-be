export default async function handler(req, res) {
    const {
        query: {slug},
        method,
    } = req

    const recipientServiceName = slug[0]
    const recipientServiceUrl = process.env[recipientServiceName]
    const input = `${recipientServiceUrl}/${slug[1]}/${slug[2] || ''}`

    if (!recipientServiceUrl) {
        res.status(502).end(`Cannot process request`)
        return
    }

    switch (method) {
        case 'GET':
            const serviceResponse = await fetch(input)
            if (serviceResponse.status === 200) {
                const json = await serviceResponse.json()
                res.status(200).json(json)
            } else {
                res.status(serviceResponse.status).end(await serviceResponse.text())
            }
            break
        case 'POST':
            res.status(200).json({body: 'Not implemented'})
            break
        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}
