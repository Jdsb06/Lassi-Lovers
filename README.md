# FactCheck - No Misinfo

An AI-powered fact-checking platform to combat the spread of misinformation across social and news media. The platform allows users to submit content for verification and provides trust scores backed by reputable sources.

## Features

- **Claim Detection**: Uses NLP models to detect factual claims within submitted text or audio
- **Multi-Source Verification**: Cross-checks claims against verified news sources and trusted fact-checking websites
- **Confidence Scoring**: Assigns credibility scores with detailed explanations
- **Crowdsourced Fact-Checking**: Users can flag content and contribute corrections
- **Educational Chatbot**: Answers questions with fact-backed sources
- **Modern UI**: Built with React and Next.js for a smooth user experience

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Heroicons

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm (Node Package Manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/factcheck.git
cd factcheck
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── home/             # Home page components
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   └── HowItWorksSection.tsx
│   └── layout/           # Layout components
│       ├── Header.tsx
│       └── Footer.tsx
└── styles/               # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Heroicons](https://heroicons.com/)
