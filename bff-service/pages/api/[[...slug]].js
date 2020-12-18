const cache = require('memory-cache')
const twoMinutes = 1000 * 60 * 2

export default async function handler(req, res) {
    const {
        query: {slug},
        method,
        body
    } = req

    const recipientServiceName = slug[0]
    const recipientServiceUrl = process.env[recipientServiceName]
    const input = `${recipientServiceUrl}/${slug[1]}/${slug[2] || ''}`
    const useCache = slug.join() === ['product-service', 'products'].join()

    if (!recipientServiceUrl) {
        res.status(502).end(`Cannot process request`)
        return
    }

    switch (method) {
        case 'GET':
            if (useCache) {
                const cachedJson = cache.get(input)
                if (cachedJson) {
                    res.status(200).json(cachedJson)
                } else {
                    const serviceResponse = await fetch(input)
                    if (serviceResponse.status === 200) {
                        const json = await serviceResponse.json()
                        cache.put(input, json, twoMinutes)
                        res.status(200).json(json)
                    } else {
                        res.status(serviceResponse.status).end(await serviceResponse.text())
                    }
                }
            } else {
                const serviceResponse = await fetch(input)
                if (serviceResponse.status === 200) {
                    const json = await serviceResponse.json()
                    res.status(200).json(json)
                } else {
                    res.status(serviceResponse.status).end(await serviceResponse.text())
                }
            }
            break
        case 'POST':
            const servicePostResponse = await fetch(input,
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body),
                })
            res.status(servicePostResponse.status).end(await servicePostResponse.text())
            break
        case 'PUT':
            const servicePutResponse = await fetch(input, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body),
            })
            res.status(servicePutResponse.status).json(await servicePutResponse.json())
            break
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}
