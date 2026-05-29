# SafeTrace AI — Emotional Support & Safety App

## Problem We're Solving

Millions of people experience trauma, anxiety, harassment, and crisis moments—but many face barriers to professional help:
- **Cost** — Therapy is expensive and inaccessible
- **Stigma** — Many fear judgment or retaliation
- **Availability** — Crisis moments happen 24/7, but professional help isn't always available
- **Isolation** — Trauma survivors often feel alone with their experiences

**SafeTrace AI** bridges this gap by providing **immediate, judgment-free emotional support** combined with pathways to professional care.

---

## Solution: SafeTrace AI

SafeTrace AI is a comprehensive support platform that combines:

### 🤖 **SafeConnect AI** — Intelligent Emotional Support
- Real-time chat with Claude AI providing warm, empathetic guidance
- Validates feelings and helps users process emotions
- Asks thoughtful follow-up questions without judgment
- Reminds users when professional help is needed
- Available 24/7 with zero cost

### 📋 **Smart Incident Reporting** (Docs Tab)
- Voice-to-text incident documentation using Web Speech Recognition
- AI-powered analysis of incidents with Claude
- Auto-formatted reports ready for authorities or HR
- End-to-end encrypted storage

### 👥 **Professional Connection**
- Direct access to verified trauma-informed therapists
- Peer mentorship from survivor advocates
- Crisis support hotlines
- Cost-transparent booking

### 📊 **Wellness Tracking**
- Mood check-ins with visual progress tracking
- Personal safety metrics
- Emotion journaling

### 🔐 **Privacy-First Design**
- End-to-end encrypted communications
- No account required (localStorage-based)
- Users control their own data
- Professional-grade security

---

## How Claude AI Powers SafeTrace

### SafeConnect AI Chatbot
**Claude API Integration:**
```javascript
// Real-time emotional support with Claude
window.claude.complete(userMessage, conversationHistory)
```

**Model Used:** `claude-opus-4-1-20250805` (latest Claude model)

**Capabilities:**
- **Empathetic Listening** — Validates emotions with genuine warmth
- **Intelligent Responses** — Understands trauma context and responds appropriately
- **Safety Awareness** — Detects crisis signals and escalates to professional help
- **Conversation Memory** — Maintains context across multiple exchanges
- **Appropriate Boundaries** — Reminds users they're talking to AI, not a therapist

**System Prompt:**
```
You are SafeConnect, the emotional support guide within SafeTrace AI. 
You are NOT a therapist or counselor. Your role:
1) Listen with genuine warmth and validation
2) Help the user feel heard and understood
3) Gently ask one follow-up question to help them process
4) If you detect crisis signs, immediately prioritize safety
5) Periodically remind users you can connect them with professionals
Keep responses warm, human, and concise (2-3 sentences)
```

### Incident Report Analysis
Claude analyzes user-submitted incidents to:
- Extract key details automatically
- Identify patterns and risk factors
- Format reports for legal/HR submission
- Provide plain-language summaries

---

## Impact We're Aiming For

### Immediate Impact
- ✅ **Reduce Crisis Response Time** — 24/7 support available instantly
- ✅ **Lower Barriers to Care** — Free, accessible, judgment-free
- ✅ **Improve Documentation** — AI-assisted incident reporting increases accuracy and follow-through
- ✅ **Increase Help-Seeking** — Anonymous support builds trust before professional engagement

### Long-Term Vision
- 🎯 **1M+ Users Supported** — Reach trauma survivors globally
- 🎯 **Higher Professional Help Conversion** — AI support as bridge to therapy
- 🎯 **Institutional Change** — Universities & workplaces integrate SafeTrace for employee/student support
- 🎯 **Policy Impact** — Data from incident reports informs institutional accountability

### Measurable Outcomes
- Reduced time-to-help for crisis situations
- Increased therapy engagement rates (AI support → professional care)
- Higher incident reporting accuracy
- Improved user emotional wellbeing (mood tracking)
- Lower barrier to accessing professional support

---

## Features

| Feature | Status | Details |
|---------|--------|---------|
| 💬 SafeConnect AI Chat | ✅ Live | Real-time Claude AI support |
| 🎙️ Voice Incident Reports | ✅ Live | Speech-to-text → AI analysis |
| 👨‍⚕️ Therapist Matching | ✅ Live | Verified professional connections |
| 📊 Wellness Dashboard | ✅ Live | Mood tracking & trends |
| 👥 Peer Mentors | ✅ Live | Survivor-led support circles |
| 🆘 Crisis Line Integration | ✅ Live | Direct 24/7 hotline access |
| 🔐 E2E Encryption | ✅ Live | End-to-end data protection |
| 💾 Data Export | 🔄 Planned | User data portability |

---

## Technology Stack

**Frontend:**
- React 18.3.1 (in-browser via Babel)
- Native Web Speech API (voice recognition)
- localStorage (client-side storage)

**AI Backend:**
- Anthropic Claude API (`claude-opus-4-1-20250805`)
- System-prompt driven responses
- Real-time streaming (when available)

**Deployment:**
- Vercel (or any static host)
- No server required
- API key managed by user

---

## Getting Started

### Local Development
1. Clone this repository
2. Open `SafeTrace AI.html` in a web browser
3. Get an Anthropic API key at [console.anthropic.com](https://console.anthropic.com)
4. Enter your API key in **Profile → AI Settings**
5. Start using SafeConnect AI!

### Deploy to Vercel
```bash
git remote add origin https://github.com/YOUR_USERNAME/safetrace-ai.git
git push -u origin main
```
Then connect your GitHub repo to [vercel.com](https://vercel.com) for one-click deployment.

---

## API Key Setup

SafeTrace uses the **Anthropic Claude API** for AI support:

1. **Sign up** at [console.anthropic.com](https://console.anthropic.com)
2. **Create an API key** (free tier includes API credits)
3. **Enter in app** → Profile → AI Settings
4. **API calls are made from your browser** (not our servers)
5. **Your data stays on your device** (localStorage)

**Note:** Free tier accounts have access to Claude Opus. Check your account at console.anthropic.com for available models.

---

## File Structure

```
safetrace-ai/
├── SafeTrace AI.html       # Main entry point & API setup
├── app.jsx                 # Core app logic & routing
├── wellness.jsx            # SafeConnect AI & mood tracking
├── document.jsx            # Incident reporting interface
├── profile.jsx             # Settings & API key management
├── community.jsx           # Therapist & mentor directory
├── home.jsx                # Welcome screen
├── shared.jsx              # UI components (TabBar, Modal, etc)
├── icons.jsx               # Icon assets
├── styles.css              # Global styling
├── brand-tokens.css        # Design tokens & colors
├── README.md               # This file
└── vercel.json             # Deployment config
```

---

## Privacy & Security

✅ **Client-Side Only** — No servers, no data collection
✅ **User-Owned API Keys** — You control your Claude API access
✅ **localStorage Storage** — Data stays on your device
✅ **No Tracking** — No analytics, no ads
✅ **Open Design** — Transparent about AI limitations

**Limitations:**
- SafeConnect AI is NOT a replacement for professional therapy
- For emergencies, always contact local crisis services
- AI responses are generated in real-time—no guarantees of medical accuracy

---

## Contributing

Have ideas to improve SafeTrace? We'd love your help!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-idea`)
3. Make your changes
4. Commit (`git commit -m 'Add: your feature'`)
5. Push (`git push origin feature/your-idea`)
6. Open a Pull Request

### Areas We Need Help With:
- 🌍 Translations (other languages)
- 🎨 UI/UX improvements
- 🐛 Bug fixes
- 📚 Documentation
- ♿ Accessibility features
- 📱 Mobile optimization

---

## Roadmap

- [ ] Multi-language support
- [ ] Offline mode
- [ ] Advanced incident analytics dashboard
- [ ] Integration with institutional systems (universities, workplaces)
- [ ] Mobile app (React Native)
- [ ] Community forum
- [ ] Research partnerships with universities
- [ ] Nonprofit sustainability model

---

## Support

**Questions or issues?**
- 📧 Open an issue on GitHub
- 💬 Check our documentation
- 🆘 For crisis: Contact local emergency services

---

## License

This project is open source and available under the MIT License—feel free to use, modify, and share SafeTrace AI.

---

## Acknowledgments

SafeTrace AI is built with:
- **Claude AI** by Anthropic — for empathetic, intelligent support
- **React** — for responsive, dynamic interfaces
- **Web APIs** — for privacy-first data storage and voice recognition
- **The survivor community** — for inspiring this work

---

## Impact Statement

**Our Goal:** Remove barriers to emotional support and professional care for trauma survivors worldwide.

Every person deserves:
- ✨ Immediate, judgment-free support
- 🤝 Connection to professionals who understand trauma
- 🔒 Privacy and control over their own data
- 💪 Tools to document and report incidents safely

**SafeTrace AI exists to make that possible.**

---

**Built with ❤️ for everyone who deserves to be heard.**
