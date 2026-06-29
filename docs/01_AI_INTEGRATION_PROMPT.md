ElectroBridge — AI Integration Master Prompt
Multi-Provider AI with Automatic Fallback System
---
You are an agentic coding assistant working exactly like Claude Code.
Loop until everything is complete. Fix all errors automatically. Never stop and ask permission.
Only stop when ALL tasks are 100% done.
Platform: ElectroBridge at https://electrobridge.vercel.app
Stack: Next.js 14 App Router + Supabase + Vercel (free tier)
I want to integrate AI features into ElectroBridge using multiple free AI APIs
with automatic fallback — if one API's credits run out, automatically switch to next.
═══════════════════════════════════════════════════
STEP 1: ENVIRONMENT VARIABLES
═══════════════════════════════════════════════════
Add these to .env.local AND Vercel dashboard:
```
# AI Provider Keys (add your actual keys here)
GEMINI_API_KEY=your_gemini_key_here
GROQ_API_KEY=your_groq_key_here
OPENROUTER_API_KEY=your_openrouter_key_here
HUGGINGFACE_API_KEY=your_huggingface_key_here
CLOUDFLARE_AI_TOKEN=your_cloudflare_token_here
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id_here
```
═══════════════════════════════════════════════════
STEP 2: AI PROVIDER FALLBACK ENGINE
═══════════════════════════════════════════════════
Create lib/ai/providers.ts — the core fallback engine:
```typescript
export type AIProvider = 'gemini' | 'groq' | 'openrouter' | 'huggingface' | 'cloudflare';

export interface AIResponse {
  text: string;
  provider: AIProvider;
  model: string;
}

// Provider priority order — free tier limits considered
// Gemini Flash: 1500 req/day free
// Groq: 14,400 req/day free  
// OpenRouter: has free models (meta-llama etc)
// HuggingFace: free inference API
// Cloudflare: 10,000 neurons/day free
const PROVIDER_ORDER: AIProvider[] = [
  'groq',        // Fastest, most generous free tier
  'gemini',      // Very capable, good free tier
  'openrouter',  // Has free models
  'cloudflare',  // Free workers AI
  'huggingface', // Slowest but always available
];

async function callGemini(prompt: string, systemPrompt?: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt }] }],
        generationConfig: { maxOutputTokens: 1024, temperature: 0.3 }
      })
    }
  );
  if (!response.ok) throw new Error(`Gemini error: ${response.status}`);
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function callGroq(prompt: string, systemPrompt?: string): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant', // Free, fast
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt }
      ],
      max_tokens: 1024,
      temperature: 0.3
    })
  });
  if (!response.ok) throw new Error(`Groq error: ${response.status}`);
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callOpenRouter(prompt: string, systemPrompt?: string): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://electrobridge.vercel.app',
      'X-Title': 'ElectroBridge'
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.1-8b-instruct:free', // Free model
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt }
      ],
      max_tokens: 1024
    })
  });
  if (!response.ok) throw new Error(`OpenRouter error: ${response.status}`);
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callCloudflare(prompt: string, systemPrompt?: string): Promise<string> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_AI_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
          { role: 'user', content: prompt }
        ]
      })
    }
  );
  if (!response.ok) throw new Error(`Cloudflare error: ${response.status}`);
  const data = await response.json();
  return data.result.response;
}

async function callHuggingFace(prompt: string): Promise<string> {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 512, temperature: 0.3 }
      })
    }
  );
  if (!response.ok) throw new Error(`HuggingFace error: ${response.status}`);
  const data = await response.json();
  return Array.isArray(data) ? data[0].generated_text : data.generated_text;
}

// MAIN FUNCTION: Try providers in order, fallback on failure
export async function callAI(
  prompt: string,
  systemPrompt?: string,
  options?: { preferredProvider?: AIProvider }
): Promise<AIResponse> {
  
  const order = options?.preferredProvider 
    ? [options.preferredProvider, ...PROVIDER_ORDER.filter(p => p !== options.preferredProvider)]
    : PROVIDER_ORDER;

  const PROVIDER_MODELS: Record<AIProvider, string> = {
    groq: 'llama-3.1-8b-instant',
    gemini: 'gemini-1.5-flash',
    openrouter: 'llama-3.1-8b-instruct:free',
    cloudflare: 'llama-3.1-8b-instruct',
    huggingface: 'mistral-7b-instruct',
  };

  for (const provider of order) {
    try {
      console.log(`[AI] Trying provider: ${provider}`);
      let text: string;
      
      switch (provider) {
        case 'groq':      text = await callGroq(prompt, systemPrompt); break;
        case 'gemini':    text = await callGemini(prompt, systemPrompt); break;
        case 'openrouter': text = await callOpenRouter(prompt, systemPrompt); break;
        case 'cloudflare': text = await callCloudflare(prompt, systemPrompt); break;
        case 'huggingface': text = await callHuggingFace(prompt); break;
        default: continue;
      }
      
      console.log(`[AI] Success with provider: ${provider}`);
      return { text, provider, model: PROVIDER_MODELS[provider] };
      
    } catch (error) {
      console.warn(`[AI] Provider ${provider} failed:`, error);
      continue; // Try next provider
    }
  }
  
  throw new Error('All AI providers failed. Please try again later.');
}
```
═══════════════════════════════════════════════════
STEP 3: AI-POWERED FEATURES TO BUILD
═══════════════════════════════════════════════════
Build ALL of the following AI features using the callAI() function above:
---
FEATURE A: Smart Opportunity Summarizer
Create lib/ai/summarizer.ts:
When admin adds a new opportunity with a long raw description,
AI automatically generates:
A clean 2-line summary (for cards)
Key eligibility points as bullet list
Auto-suggested tags
Cleaned title (removes bureaucratic language)
```typescript
export async function summarizeOpportunity(rawDescription: string, title: string, org: string) {
  const prompt = `
You are helping summarize a research/job opportunity for electronics and semiconductor researchers.

Title: ${title}
Organization: ${org}
Raw Description: ${rawDescription}

Return ONLY a JSON object (no markdown, no explanation):
{
  "clean_title": "concise job title under 60 chars",
  "summary": "2 sentence summary of what the role involves and who should apply",
  "eligibility_points": ["point 1", "point 2", "point 3"],
  "suggested_tags": ["tag1", "tag2", "tag3", "tag4"],
  "stipend_extracted": "stipend if mentioned or null",
  "deadline_extracted": "deadline if mentioned in YYYY-MM-DD format or null"
}`;

  const response = await callAI(prompt);
  return JSON.parse(response.text.replace(/```json|```/g, '').trim());
}
```
Add to admin panel "Add Opportunity" form:
"✨ AI Auto-Fill" button next to description field
User pastes raw text from official notification
Clicks button → AI fills all other fields automatically
User reviews and saves
---
FEATURE B: Personalized Opportunity Matching
Create lib/ai/matcher.ts + app/api/ai/match/route.ts:
```typescript
export async function matchOpportunities(
  userProfile: {
    qualification: string,  // e.g. "MSc Electronics"
    specialization: string, // e.g. "thin film, spintronics"
    hasNET: boolean,
    hasGATE: boolean,
    preferredLocation: string,
    lookingFor: string[]    // e.g. ["JRF", "PhD"]
  },
  opportunities: any[]
) {
  const prompt = `
You are a career advisor for electronics researchers in India.

User Profile:
- Qualification: ${userProfile.qualification}
- Specialization: ${userProfile.specialization}  
- NET Qualified: ${userProfile.hasNET}
- GATE Qualified: ${userProfile.hasGATE}
- Preferred Location: ${userProfile.preferredLocation}
- Looking For: ${userProfile.lookingFor.join(', ')}

Here are available opportunities:
${opportunities.map((o, i) => `${i+1}. ${o.title} at ${o.organization} | ${o.category} | ${o.location} | Eligibility: ${o.eligibility} | Tags: ${o.tags?.join(', ')}`).join('\n')}

Return ONLY a JSON array of the top 5 most relevant opportunity numbers with match reasons:
[
  { "index": 1, "score": 95, "reason": "Perfect match - thin film + NET qualified + DRDO" },
  { "index": 3, "score": 87, "reason": "Strong match - spintronics research aligns well" }
]`;

  const response = await callAI(prompt);
  const matches = JSON.parse(response.text.replace(/```json|```/g, '').trim());
  return matches.map((m: any) => ({ ...opportunities[m.index - 1], matchScore: m.score, matchReason: m.reason }));
}
```
Create a "Find My Match" page at app/match/page.tsx:
Simple form: qualification dropdown, specialization text, NET/GATE checkboxes, location preference
Submit → calls /api/ai/match → shows personalized ranked opportunities
Each result shows match score (%) and why it matches
Add "🎯 Find My Match" button in navbar
---
FEATURE C: AI News Relevance Filter (Backend)
Create lib/ai/news-filter.ts:
For each scraped news article, AI decides if it's truly electronics/semiconductor relevant:
```typescript
export async function isArticleRelevant(title: string, summary: string): Promise<boolean> {
  // First do fast keyword check (no API call needed)
  const FAST_KEYWORDS = ['semiconductor', 'chip', 'vlsi', 'electronics', 'transistor', 
    'wafer', 'photonics', 'embedded', 'sensor', 'mems', 'spintronics'];
  const text = (title + ' ' + summary).toLowerCase();
  const hasKeyword = FAST_KEYWORDS.some(kw => text.includes(kw));
  
  // If clear keyword match, approve without AI call (saves API credits)
  if (hasKeyword) return true;
  
  // Borderline cases: use AI to decide
  const prompt = `Is this news article relevant to electronics or semiconductor industry professionals?
Title: ${title}
Summary: ${summary}
Answer with only "yes" or "no".`;
  
  try {
    const response = await callAI(prompt);
    return response.text.toLowerCase().trim().startsWith('yes');
  } catch {
    return false; // If AI fails, reject borderline articles (safer)
  }
}
```
---
FEATURE D: Opportunity Detail AI Summary
On each opportunity detail page (app/opportunities/[slug]/page.tsx):
Add a "🤖 AI Summary" collapsible section:
Lazy loaded (only calls AI when user expands it)
Shows: "What this opportunity is about", "Why you should apply", "What documents you'll likely need"
Create app/api/ai/opportunity-summary/[slug]/route.ts
```typescript
// GET /api/ai/opportunity-summary/[slug]
// Returns AI-generated helpful context for that opportunity
const prompt = `
You are helping an Indian electronics researcher understand this opportunity.

Opportunity: ${opportunity.title}
Organization: ${opportunity.organization}
Description: ${opportunity.description}
Eligibility: ${opportunity.eligibility}
Category: ${opportunity.category}

Provide a helpful, concise analysis in this JSON format:
{
  "what_you_will_do": "2-3 sentences about the actual research/work",
  "why_apply": "2-3 sentences on career value and growth",
  "typical_documents": ["CV", "MSc marksheets", "NET certificate", ...],
  "tips": "1-2 specific tips for this type of application",
  "difficulty_level": "Low / Medium / High",
  "career_stage": "Fresh MSc / 1-2 years experience / PhD required"
}`;
```
UI: Expandable card below description, "✨ Get AI Insights" button, shows spinner while loading.
---
FEATURE E: Search with AI Understanding
Upgrade the search bar in app/opportunities/page.tsx:
When user types a natural language query, AI converts it to structured filters:
```typescript
// app/api/ai/search/route.ts
// POST { query: "DRDO thin film JRF Delhi NET qualified" }
// AI extracts: { category: "JRF", tags: ["thin film"], location: "Delhi", 
//               eligibility: "NET", organization_hint: "DRDO" }

const prompt = `
Extract search filters from this query for an electronics job platform.
Query: "${query}"

Return ONLY JSON:
{
  "category": "JRF|SRF|PhD|Govt Job|Private Job|Fellowship|null",
  "location": "city name or null",
  "tags": ["tag1", "tag2"],
  "organization_hint": "org name or null",
  "eligibility": "NET|GATE|MSc|BTech|null"
}`;
```
The search bar should:
Accept natural language: "ISRO fellowship for thin film researcher with NET"
Show extracted filters as chips below search bar
Apply them to filter opportunities
Fallback to normal text search if AI fails
---
FEATURE F: Weekly AI-Curated Newsletter
Create lib/ai/newsletter.ts:
Every Sunday, AI generates a personalized newsletter summary:
```typescript
export async function generateWeeklyDigest(opportunities: any[], newsArticles: any[]) {
  const prompt = `
You are the editor of ElectroBridge, a platform for electronics and semiconductor researchers in India.

Write a weekly digest email. This week we have:

NEW OPPORTUNITIES (${opportunities.length}):
${opportunities.map(o => `- ${o.title} at ${o.organization} | Deadline: ${o.deadline} | ${o.stipend}`).join('\n')}

TOP NEWS (${newsArticles.length} articles, show top 5):
${newsArticles.slice(0, 10).map(n => `- ${n.title} (${n.source})`).join('\n')}

Write a digest with:
1. A brief exciting intro (2 sentences, mention count of new opportunities)
2. "Opportunity Spotlight" — highlight the most interesting opportunity this week with 3 sentences
3. "News Roundup" — 3-4 sentence summary of the most important industry news
4. A motivating closing line for researchers

Keep it professional but warm. Under 300 words total.
Return plain text (not HTML, not JSON).`;

  const response = await callAI(prompt);
  return response.text;
}
```
---
FEATURE G: AI Chatbot (Ask ElectroBridge)
Create app/chat/page.tsx — a simple AI assistant page:
System prompt:
```
You are ElectroBridge Assistant, a helpful AI for electronics and semiconductor researchers in India.
You help users:
- Find relevant JRF, PhD, and job opportunities
- Understand eligibility criteria (NET, GATE, age limits)
- Know about DRDO, ISRO, CSIR, IIT opportunities
- Learn about international fellowships (DAAD, SINGA, MEXT)
- Understand the difference between JRF, SRF, RA, Project Associate
- Prepare for interviews and applications

Be concise, accurate, and helpful. If you don't know something specific, say so.
Do not make up deadlines or stipends — say "check the official website".
```
UI:
Simple chat interface with message bubbles
Quick suggestion chips: "Find JRF for NET Electronics", "DRDO vs CSIR opportunities",
"International PhD for thin film researcher", "ISRO recruitment process"
Add "💬 Ask AI" button in navbar
Create app/api/ai/chat/route.ts:
POST { messages: [{role, content}], conversationHistory: [...] }
Passes full conversation history to callAI()
Returns AI response with provider name shown subtly ("Powered by Groq")
---
FEATURE H: Auto-Expire Checker
Create lib/ai/expiry-checker.ts + cron endpoint:
AI checks if an opportunity description mentions that it's expired/closed:
```typescript
export async function checkIfExpired(opportunity: any): Promise<boolean> {
  // First check: is deadline past?
  if (opportunity.deadline && new Date(opportunity.deadline) < new Date()) {
    return true; // Definitely expired
  }
  
  // For opportunities without deadline, use AI to check description
  if (!opportunity.deadline && opportunity.description) {
    const prompt = `Does this job posting appear to be closed, expired, or no longer accepting applications?
Text: "${opportunity.description.slice(0, 500)}"
Answer only "yes" or "no".`;
    
    try {
      const response = await callAI(prompt);
      return response.text.toLowerCase().includes('yes');
    } catch {
      return false;
    }
  }
  return false;
}
```
Run daily via cron — auto-marks expired opportunities as is_active = false.
═══════════════════════════════════════════════════
STEP 4: ADMIN PANEL — AI USAGE MONITOR
═══════════════════════════════════════════════════
Add to app/admin/page.tsx — "AI Usage" tab showing:
```sql
-- Create ai_usage_log table
CREATE TABLE IF NOT EXISTS ai_usage_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  feature text NOT NULL,  -- 'summarizer', 'matcher', 'chat', 'newsletter', etc.
  provider text NOT NULL,
  model text,
  prompt_length integer,
  response_length integer,
  success boolean DEFAULT true,
  error_message text,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE ai_usage_log ENABLE ROW LEVEL SECURITY;
```
Admin tab shows:
Pie chart of provider usage (Groq 70%, Gemini 20%, etc)
Total AI calls today / this week
Provider success/failure rates
Which features use AI most
Log of recent AI calls
Update callAI() to log every call to this table.
═══════════════════════════════════════════════════
STEP 5: NAVBAR UPDATES
═══════════════════════════════════════════════════
Add to navbar (in order):
Opportunities | News | Organizations | Resources | 🎯 Find My Match | 💬 Ask AI
═══════════════════════════════════════════════════
BUILD ORDER — FOLLOW EXACTLY
═══════════════════════════════════════════════════
Create lib/ai/providers.ts (fallback engine — core of everything)
Create ai_usage_log table in Supabase
Feature A: Summarizer + Admin panel AI button
Feature B: Matcher + /match page
Feature C: News relevance filter (integrate into existing scraper)
Feature D: Opportunity detail AI summary
Feature E: AI-powered smart search
Feature F: Newsletter generator (update existing digest)
Feature G: AI Chatbot + /chat page
Feature H: Auto-expire checker
Step 4: Admin AI usage monitor
Step 5: Update navbar
After all done:
List every file created/modified
Show me the test command for the AI fallback (call /api/ai/chat with a test message)
Confirm all 5 API keys are being used in the fallback chain
Give me the Supabase SQL for ai_usage_log cron cleanup (keep only 30 days)
NEVER STOP. FIX ALL ERRORS. COMPLETE ALL STEPS.
```