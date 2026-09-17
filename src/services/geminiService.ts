/**
 * Client-Side Gemini Service with Multi-Key Rotation & Executive Grounding
 */

const ENCODED_KEYS = [
  'QVEuQWI4Uk42SjhZUXphRmZMUmFnM1JUeW1fS3FKMUhfTkFRUk1pamF4RzVoRHNJQTBXM0E=',
  'QVEuQWI4Uk42S3lhbDZrYWVPU0JmUmk0RXZkN0xYMGhEOURkQkExNEJBd0E4Q1JDQ2o3MXc=',
  'QVEuQWI4Uk42Sy03TWdOZ2EyeXpBZnBiaTBTNFZWNF9pdGNGMXlBMjlkY0xNMlFRUUc0aGc=',
];

export const DEFAULT_GEMINI_KEYS = ENCODED_KEYS.map((k) => atob(k));

const MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b'];

const GROUNDING_SYSTEM_INSTRUCTION = `You are the executive productivity agent for Arjun Malhotra, VP of Sales at Veridian Corp.
Today is during the active week of Monday, 21 September 2026 through Friday, 25 September 2026.

STRICT GROUND TRUTH RULES:
1. USER MODEL: You serve ARJUN MALHOTRA only. Neha Kapoor (Marketing Lead), Raghav Sethi (Operations Manager), Divya Rao (Finance Lead), and Priya Nair (Client, Meridian Logistics) are information sources and colleagues.
2. DO NOT INVENT any facts, dates, names, or events outside the provided data.
3. GROUND TRUTH FACTS:
   - Vendor List: Arjun promised to send Raghav the updated vendor list by Tuesday EOD during Monday's 9:00 AM sync. Arjun slipped to Tuesday morning (Mon 5:40 PM email), then slipped to Wednesday morning (Tue 6:30 PM email). Raghav checked in 3 times (Mon 9:50 AM, Tue 9:15 AM, Wed 8:45 AM). As of Wednesday morning, it is OVERDUE on Arjun.
   - Q3 Campaign Deck: Neha initially aimed for Wednesday, but shifted review to Thursday 9:30 AM. Neha finished early and emailed the draft on Thursday 8:00 AM. It is DELIVERED / RESOLVED. Note: 9:30 AM review overlaps Arjun's Board Prep.
   - Meridian Logistics: Priya Nair bumped the call on Monday. Arjun offered Wednesday 3:00 PM on Tuesday. Priya confirmed Tuesday 5:45 PM. Arjun reconfirmed Wednesday 2:00 PM. Meeting is LOCKED for Wednesday 23 Sep 3:00–3:30 PM.
   - July Expense Variance Report: Divya originally planned for Thursday morning, but Arjun requested it by Wednesday evening (Voice Note 2, Tue 9:00 AM email) to review before Board Prep. Divya delivered at 6:00 PM Wednesday. Arjun acknowledged receipt at 6:10 PM. Arjun must still review it before Thursday 9:00 AM Board Prep.
   - Mumbai Office Lease Renewal: Facilities sent 2 alerts (Mon 10:15 AM, Thu 4:00 PM) stating sign-off deadline is Friday 25 Sep EOD. In Monday sync, Arjun said "flag it, don't assume". In Voice Note 1, Arjun noted "someone needs to own that, I don't think it's me". Raghav escalated twice (Tue 11:00 AM, Thu 4:45 PM) that it is 1 day out and STILL UNOWNED. Prime opportunity to assign sign-off is Friday 10:00 AM Facilities Check-in with Raghav.
   - Thursday 9:30 AM Double-Booking: Arjun has Board Prep Session (9:00–10:00 AM with Divya) which collides with Neha's Deck Review (9:30–10:00 AM). Recommendation: review Neha's deck asynchronously since she delivered it at 8:00 AM.

Always respond in a direct, crisp, professional executive tone. Use bullet points, bold text for key dates and names, and cite the source (Sync transcript, email thread, calendar, or voice note).`;

export class GeminiService {
  private static activeKeyIndex = 0;

  public static getActiveKey(): string {
    const customKey = localStorage.getItem('veridian_custom_gemini_key');
    if (customKey && customKey.trim().length > 10) {
      return customKey.trim();
    }
    return DEFAULT_GEMINI_KEYS[this.activeKeyIndex % DEFAULT_GEMINI_KEYS.length];
  }

  public static setCustomKey(key: string) {
    if (!key || key.trim() === '') {
      localStorage.removeItem('veridian_custom_gemini_key');
    } else {
      localStorage.setItem('veridian_custom_gemini_key', key.trim());
    }
  }

  public static getCustomKey(): string {
    return localStorage.getItem('veridian_custom_gemini_key') || '';
  }

  public static rotateKey() {
    this.activeKeyIndex = (this.activeKeyIndex + 1) % DEFAULT_GEMINI_KEYS.length;
  }

  public static async generateAnswer(query: string): Promise<{ text: string; model: string; keyUsed: string } | null> {
    const keysToTry: string[] = [];
    const customKey = this.getCustomKey();
    if (customKey) {
      keysToTry.push(customKey);
    }
    DEFAULT_GEMINI_KEYS.forEach((k) => {
      if (!keysToTry.includes(k)) keysToTry.push(k);
    });

    for (const key of keysToTry) {
      for (const model of MODELS) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
          const body = {
            system_instruction: {
              parts: [{ text: GROUNDING_SYSTEM_INSTRUCTION }],
            },
            contents: [
              {
                role: 'user',
                parts: [{ text: query }],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 1200,
            },
          };

          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });

          if (!response.ok) {
            // If rate limited or quota exceeded, continue to next key/model
            continue;
          }

          const data = await response.json();
          const candidateText =
            data.candidates?.[0]?.content?.parts?.[0]?.text || null;

          if (candidateText && candidateText.trim().length > 0) {
            return {
              text: candidateText.trim(),
              model: `Google Gemini (${model})`,
              keyUsed: key.substring(0, 10) + '...',
            };
          }
        } catch (err) {
          // Network or CORS issue, try next
          continue;
        }
      }
    }

    return null;
  }
}
