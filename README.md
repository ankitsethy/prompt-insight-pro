# 🚀 AI Prompt Optimizer

A beautiful, professional web application that transforms your prompts into powerful, optimized instructions that get better AI results.

![AI Prompt Optimizer Hero](src/assets/hero-ai-optimizer.jpg)

## ✨ Features

### Core Functionality
- **Smart Prompt Optimization**: Transform basic prompts into detailed, structured instructions
- **Intent Detection**: Automatically categorize and optimize based on your goal
- **Real-time Processing**: Live character/token counting and optimization feedback
- **One-click Copy**: Instantly copy optimized prompts to clipboard

### Advanced Features
- **Before/After Comparison**: See exactly what improvements were made
- **Improvement Explanations**: Understand why specific changes enhance results
- **Quick Templates**: Pre-built prompts for common use cases
- **Usage Analytics**: Track your optimization history and success metrics
- **Export Functionality**: Download optimized prompts as text files

### Templates Available
- **Data Analysis**: Perfect for analyzing datasets and trends
- **Blog Posts**: SEO-optimized content creation prompts
- **Code Generation**: Clean, documented code with examples
- **Creative Writing**: Engaging storytelling and creative content
- **Q&A Format**: Structured question-answer prompts
- **Text Summary**: Comprehensive summarization templates

## 🎨 Design System

Beautiful modern interface featuring:
- **Purple/Blue Gradient Theme**: Professional tech aesthetic
- **Smooth Animations**: Elegant transitions and hover effects
- **Mobile Responsive**: Perfect on all devices
- **Dark/Light Mode**: Automatic theme adaptation
- **Glassmorphism Effects**: Modern card designs with subtle shadows

## 🔧 Technology Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS + Custom Design System
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Hooks + LocalStorage

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key (for live optimization)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-prompt-optimizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up OpenAI API** (Optional - for live optimization)
   
   **Option 1: Connect to Supabase (Recommended)**
   - Connect your project to Supabase for secure API key management
   - Add your OpenAI API key to Supabase secrets
   - The app will automatically use secure edge functions for optimization

   **Option 2: Frontend-only with user input**
   - Users can enter their API key in the app settings
   - Key is stored securely in localStorage
   - No server required, fully client-side

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:8080
   ```

## 🔑 OpenAI API Integration

### Current Implementation
The app currently uses **mock optimization** for demonstration. To enable real OpenAI integration:

### Method 1: Supabase Integration (Recommended)
```typescript
// Create edge function in Supabase
import { OpenAI } from 'openai';

export default async function optimizePrompt(req: Request) {
  const openai = new OpenAI({
    apiKey: Deno.env.get('OPENAI_API_KEY'),
  });

  const { prompt, intent } = await req.json();
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a prompt optimization expert. Improve the following prompt for ${intent} tasks. Make it more specific, structured, and effective.`
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  return new Response(JSON.stringify({
    optimizedPrompt: response.choices[0].message.content,
    improvements: [...] // Extract improvements
  }));
}
```

### Method 2: Client-side Integration
```typescript
// Replace the mock optimization in src/pages/Index.tsx
const optimizePrompt = async () => {
  const apiKey = localStorage.getItem('openai-api-key');
  
  if (!apiKey) {
    // Show API key input dialog
    return;
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a prompt optimization expert...`
        },
        {
          role: 'user',
          content: originalPrompt
        }
      ],
    }),
  });

  const result = await response.json();
  // Process and display results
};
```

## 📱 Usage Guide

### Basic Optimization
1. **Enter your prompt** in the left text area
2. **Select intent** from the dropdown (optional)
3. **Click "Optimize Prompt"** to enhance your prompt
4. **Copy or export** the optimized result
5. **Review improvements** to understand the changes

### Using Templates
1. Go to the **Templates** tab
2. Browse available templates by category
3. **Click "Use Template"** to load it
4. **Customize** the template for your needs
5. **Optimize** as usual

### Viewing History
1. Navigate to the **History** tab
2. **Click any previous optimization** to reload it
3. **Compare results** across different sessions
4. **Track your improvement metrics**

## 🎯 Optimization Examples

### Before
```
Write about dogs
```

### After
```
Write about dogs

Context: Provide detailed and specific information.
Format: Structure your response clearly with examples where relevant.
Goal: Ensure the output is actionable and comprehensive.

Write a comprehensive article about dogs that includes:
- Different breeds and their characteristics
- Care and training tips for dog owners
- Health considerations and common issues
- The historical relationship between humans and dogs

Use engaging examples and practical advice throughout.
```

## 📊 Analytics & Metrics

The app tracks:
- **Total prompts optimized**
- **Average improvement percentage**
- **Success rate of optimizations**
- **Most used prompt categories**
- **Optimization history with timestamps**

## 🔧 Customization

### Adding New Templates
Edit the `promptTemplates` array in `src/pages/Index.tsx`:

```typescript
{
  id: 'your-template',
  name: 'Your Template Name',
  description: 'What this template does',
  template: 'Your prompt template with [PLACEHOLDERS]',
  category: 'Category'
}
```

### Modifying the Design System
Update colors and styles in `src/index.css` and `tailwind.config.ts`:

```css
:root {
  --primary: 248 95% 66%; /* Your brand color */
  --gradient-primary: linear-gradient(135deg, ...);
}
```



### Deploy Elsewhere
```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments


- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Powered by [OpenAI API](https://openai.com/api/)

---

**Ready to optimize your AI prompts?** 🚀 Start transforming your prompts into powerful, results-driven instructions today!