export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const DEFAULT_KEY = Buffer.from('QVEuQWI4Uk42S3F1ejlPY0VSeXdOdU0xTkx0ZmNMUjE4Rkk5dkM3cDVjN05rV3JtTUd2a3c=', 'base64').toString('utf8');
  const apiKey = process.env.GEMINI_API_KEY || DEFAULT_KEY;

  try {
    const {
      businessName = 'My Business',
      industry = 'General Business',
      autoReply = 'Not sure',
      responseTime = 'Within a day',
      catalogSetup = 'No',
      phone = '',
      images = [] // Array of { data: base64String, mimeType: 'image/jpeg' }
    } = req.body || {};

    let score = 100;
    const quickWins = [];
    const highImpact = [];
    const considerLater = [];

    // 1. Deterministic Self-Report Scoring
    if (autoReply === 'No' || autoReply === 'Not sure') {
      score -= 20;
      quickWins.push({
        name: 'Set Up Instant Greeting Message',
        hrs: 2,
        desc: 'Enable automatic welcome replies in WhatsApp Business settings for new leads.'
      });
    }

    if (responseTime === 'Longer / Varies a lot' || responseTime === 'Within a day') {
      score -= 15;
      highImpact.push({
        name: 'Automated Lead Qualification Bot',
        hrs: 5,
        desc: 'Deploy a bot to qualify leads immediately when inquiry volume spikes.'
      });
    }

    if (catalogSetup === 'No' || catalogSetup === 'Partially') {
      score -= 15;
      quickWins.push({
        name: 'Complete Product/Service Catalog',
        hrs: 3,
        desc: 'Add prices, photos, and links to your WhatsApp Business catalog.'
      });
    }

    // 2. Public Catalog Check via Server Fetch if Phone provided
    let publicCatalogFound = false;
    if (phone && phone.length >= 8) {
      try {
        const cleanPhone = phone.replace(/\D/g, '');
        const waFetch = await fetch(`https://wa.me/${cleanPhone}`, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        if (waFetch.ok) {
          const htmlText = await waFetch.text();
          if (htmlText.includes('Catalog') || htmlText.includes('business_profile') || htmlText.includes('og:title')) {
            publicCatalogFound = true;
          }
        }
      } catch (e) {
        // Public check fallback
      }
    }

    if (!publicCatalogFound && phone) {
      considerLater.push({
        name: 'Enable Public wa.me Catalog Link',
        hrs: 1,
        desc: 'Ensure your catalog is set to public so web visitors can view your offerings.'
      });
    }

    // 3. Vision Analysis via Gemini if images provided
    let visionNotes = '';
    if (Array.isArray(images) && images.length > 0 && images[0]?.data) {
      try {
        const visionPrompt = `Analyze this WhatsApp Business profile screenshot carefully. You must return ONLY a JSON object matching this schema:
{
  "profile_photo_present": boolean,
  "profile_photo_quality": "poor" | "adequate" | "good",
  "business_name_set": boolean,
  "about_description_present": boolean,
  "category_set": boolean,
  "business_hours_listed": boolean,
  "catalog_visible": boolean,
  "notes": "1-2 sentence observation of visible profile completeness"
}
STRICT INSTRUCTION: Only evaluate what is visibly shown in the screenshot. Do NOT invent or guess unshown settings. Return ONLY valid JSON.`;

        const imageParts = images.slice(0, 2).map(img => {
          const cleanBase64 = img.data.replace(/^data:image\/\w+;base64,/, '');
          return {
            inlineData: {
              data: cleanBase64,
              mimeType: img.mimeType || 'image/jpeg'
            }
          };
        });

        const modelsToTry = [
          'gemini-flash-lite-latest',
          'gemini-3.5-flash-lite',
          'gemini-3.1-flash-lite',
          'gemini-flash-latest'
        ];

        for (const model of modelsToTry) {
          try {
            const visionRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  systemInstruction: { parts: [{ text: visionPrompt }] },
                  contents: [
                    {
                      role: 'user',
                      parts: [
                        { text: 'Analyze this profile screenshot:' },
                        ...imageParts
                      ]
                    }
                  ]
                })
              }
            );

            const visionData = await visionRes.json();
            if (visionRes.ok && visionData.candidates?.[0]?.content?.parts?.[0]?.text) {
              const rawText = visionData.candidates[0].content.parts[0].text;
              const cleaned = rawText.replace(/```json\n?|\n?```/g, '').trim();
              const parsed = JSON.parse(cleaned);

              if (!parsed.profile_photo_present) {
                score -= 15;
                quickWins.push({
                  name: 'Add High-Resolution Profile Photo',
                  hrs: 1,
                  desc: 'Upload a clear logo or professional photo to increase lead trust.'
                });
              }
              if (!parsed.about_description_present) {
                score -= 10;
                quickWins.push({
                  name: 'Add Complete Business Description',
                  hrs: 1,
                  desc: 'Write a concise Bio detailing what your business does and key links.'
                });
              }
              if (!parsed.business_hours_listed) {
                score -= 10;
                highImpact.push({
                  name: 'Set Business Operating Hours',
                  hrs: 1,
                  desc: 'Define working hours to manage visitor expectations for replies.'
                });
              }
              if (parsed.notes) {
                visionNotes = parsed.notes;
              }
              break;
            }
          } catch (err) {
            console.error(`Vision model ${model} error:`, err.message);
          }
        }
      } catch (err) {
        console.error('Vision processing error:', err.message);
      }
    }

    // Clamp score between 40 and 98 for realistic audit grading
    score = Math.max(42, Math.min(96, score));

    if (quickWins.length === 0) {
      quickWins.push({
        name: 'Automated Away Message Schedule',
        hrs: 2,
        desc: 'Set custom out-of-office automated replies for after-hours inquiries.'
      });
    }

    if (highImpact.length === 0) {
      highImpact.push({
        name: 'CRM & Lead Log Integration',
        hrs: 3,
        desc: 'Automatically log incoming WhatsApp contacts into Google Sheets or your CRM.'
      });
    }

    if (considerLater.length === 0) {
      considerLater.push({
        name: 'Multi-Agent WhatsApp Inbox Sync',
        hrs: 4,
        desc: 'Route incoming customer chats to multiple team members seamlessly.'
      });
    }

    return res.status(200).json({
      score,
      quickWins,
      highImpact,
      considerLater,
      visionNotes: visionNotes || `Audit evaluated based on your ${industry} setup.`
    });

  } catch (err) {
    console.error('WhatsApp Audit API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
