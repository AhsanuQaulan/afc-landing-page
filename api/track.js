/**
 * Meta Conversions API (CAPI) Handler
 * Forward events from client to Meta Server for increased Match Quality
 */

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const pixelId = '958885573763756';
    const accessToken = process.env.META_ACCESS_TOKEN;

    if (!accessToken) {
        console.error('META_ACCESS_TOKEN environment variable is missing.');
        return res.status(500).json({ error: 'Server Configuration Error' });
    }

    try {
        const { event_name, event_id, fbp, fbc, source_url, content_name } = req.body;

        // Extract client info from headers for high EMQ
        const client_ip_address = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const client_user_agent = req.headers['user-agent'];

        const payload = {
            data: [
                {
                    event_name: event_name,
                    event_time: Math.floor(Date.now() / 1000),
                    event_id: event_id,
                    event_source_url: source_url,
                    action_source: "website",
                    user_data: {
                        client_ip_address: client_ip_address,
                        client_user_agent: client_user_agent,
                        fbp: fbp || null,
                        fbc: fbc || null
                    },
                    custom_data: content_name ? {
                        content_name: content_name,
                        content_category: 'Lead Generation'
                    } : {}
                }
            ]
        };

        const response = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Meta CAPI Error:', result);
            return res.status(response.status).json(result);
        }

        return res.status(200).json({ success: true, result });

    } catch (error) {
        console.error('CAPI Internal Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
