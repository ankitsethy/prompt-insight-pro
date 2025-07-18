import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, 
  Copy, 
  Download, 
  History, 
  BarChart, 
  Wand2, 
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Star,
  Brain,
  Lightbulb,
  Rocket,
  Shield,
  Cpu,
  Search,
  BookOpen,
  Code,
  PenTool,
  MessageSquare,
  Globe,
  X,
  Plus,
  Minus,
  Clock
} from 'lucide-react';

interface OptimizationResult {
  id: string;
  originalPrompt: string;
  optimizedPrompt: string;
  improvements: string[];
  intent: string;
  timestamp: number;
  characterCount: {
    original: number;
    optimized: number;
  };
  strengthScore: number;
  weaknesses: string[];
  platform: string;
  tone: number;
}

interface PromptAnalysis {
  strengthScore: number;
  weaknesses: string[];
  category: string;
  confidence: number;
  improvements: string[];
  tokenCount: number;
  readabilityScore: number;
}

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  category: string;
  icon: typeof BookOpen;
  color: string;
}

const promptTemplates: PromptTemplate[] = [
  {
    id: 'analysis',
    name: 'Data Analysis',
    description: 'Analyze data and provide insights',
    template: 'Analyze the following data and provide key insights, trends, and actionable recommendations with specific metrics and examples: [INSERT DATA]',
    category: 'Analysis',
    icon: BarChart,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'creative',
    name: 'Creative Writing',
    description: 'Generate creative content',
    template: 'Create a compelling and original [TYPE] about [TOPIC]. Use vivid imagery, engaging dialogue, and maintain a [TONE] throughout. Include specific details that bring the story to life.',
    category: 'Creative',
    icon: PenTool,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'code',
    name: 'Code Generation',
    description: 'Generate clean, documented code',
    template: 'Generate production-ready [LANGUAGE] code for [FUNCTIONALITY]. Include comprehensive error handling, detailed comments, type annotations, and usage examples with best practices.',
    category: 'Code',
    icon: Code,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'marketing',
    name: 'Marketing Copy',
    description: 'Create compelling marketing content',
    template: 'Write persuasive marketing copy for [PRODUCT/SERVICE]. Focus on [TARGET AUDIENCE], highlight key benefits, include compelling calls-to-action, and maintain a [TONE] voice.',
    category: 'Marketing',
    icon: Rocket,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'research',
    name: 'Research Summary',
    description: 'Summarize research findings',
    template: 'Provide a comprehensive research summary on [TOPIC]. Include key findings, methodology analysis, statistical significance, limitations, and practical implications with citations.',
    category: 'Research',
    icon: Search,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'education',
    name: 'Educational Content',
    description: 'Create learning materials',
    template: 'Create educational content about [TOPIC] for [AUDIENCE LEVEL]. Include clear explanations, practical examples, interactive elements, and assessment questions.',
    category: 'Education',
    icon: BookOpen,
    color: 'from-teal-500 to-blue-500'
  }
];

const platformOptions = [
  { value: 'chatgpt', label: 'ChatGPT', icon: MessageSquare },
  { value: 'claude', label: 'Claude', icon: Brain },
  { value: 'gemini', label: 'Gemini', icon: Star },
  { value: 'general', label: 'General', icon: Globe }
];

const quickActions = [
  { label: 'Make Shorter', icon: Minus, action: 'shorten' },
  { label: 'Add Examples', icon: Plus, action: 'examples' },
  { label: 'More Professional', icon: Shield, action: 'professional' },
  { label: 'Technical', icon: Cpu, action: 'technical' }
];

const Index = () => {
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [selectedIntent, setSelectedIntent] = useState('general');
  const [selectedPlatform, setSelectedPlatform] = useState('chatgpt');
  const [toneLevel, setToneLevel] = useState([50]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [promptAnalysis, setPromptAnalysis] = useState<PromptAnalysis | null>(null);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult[]>([]);
  const [usageCount, setUsageCount] = useState(0);
  const [textMorphing, setTextMorphing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load data from localStorage
    const savedResults = localStorage.getItem('promptOptimizationResults');
    const savedUsage = localStorage.getItem('promptOptimizationUsage');
    
    if (savedResults) {
      setOptimizationResults(JSON.parse(savedResults));
    }
    if (savedUsage) {
      setUsageCount(parseInt(savedUsage));
    }
  }, []);

  // Real-time analysis with debounce
  useEffect(() => {
    if (!originalPrompt.trim()) {
      setPromptAnalysis(null);
      return;
    }

    const debounceTimer = setTimeout(() => {
      analyzePrompt(originalPrompt);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [originalPrompt]);

  const analyzePrompt = useCallback(async (prompt: string) => {
    setIsAnalyzing(true);
    
    // Simulate real-time analysis
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const analysis: PromptAnalysis = {
      strengthScore: Math.floor(Math.random() * 4) + 6, // 6-10 range
      weaknesses: generateWeaknesses(prompt),
      category: detectCategory(prompt),
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100 range
      improvements: generateImprovements(prompt),
      tokenCount: Math.ceil(prompt.length / 4),
      readabilityScore: Math.floor(Math.random() * 30) + 70
    };
    
    setPromptAnalysis(analysis);
    setIsAnalyzing(false);
  }, []);

  const generateWeaknesses = (prompt: string): string[] => {
    const weaknesses = [];
    if (prompt.length < 50) weaknesses.push('Too vague');
    if (!prompt.includes('?') && !prompt.includes('example')) weaknesses.push('Missing context');
    if (prompt.split(' ').length < 10) weaknesses.push('Unclear intent');
    if (!prompt.includes('specific') && !prompt.includes('detail')) weaknesses.push('Needs specificity');
    return weaknesses.slice(0, 3);
  };

  const detectCategory = (prompt: string): string => {
    if (prompt.toLowerCase().includes('code') || prompt.toLowerCase().includes('function')) return 'Code Generation';
    if (prompt.toLowerCase().includes('analyze') || prompt.toLowerCase().includes('data')) return 'Analysis';
    if (prompt.toLowerCase().includes('write') || prompt.toLowerCase().includes('story')) return 'Creative Writing';
    if (prompt.toLowerCase().includes('summarize') || prompt.toLowerCase().includes('summary')) return 'Summarization';
    return 'General';
  };

  const generateImprovements = (prompt: string): string[] => {
    return [
      'Add specific context and examples',
      'Define output format clearly',
      'Include success criteria',
      'Specify target audience'
    ];
  };

  const optimizePrompt = async () => {
    if (!originalPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to optimize.",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    setTextMorphing(true);
    
    try {
      // Simulate optimization process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const optimized = generateOptimizedPrompt(originalPrompt, selectedPlatform, toneLevel[0]);
      const improvements = generateDetailedImprovements(originalPrompt, optimized);
      
      const result: OptimizationResult = {
        id: Date.now().toString(),
        originalPrompt,
        optimizedPrompt: optimized,
        improvements,
        intent: selectedIntent,
        timestamp: Date.now(),
        characterCount: {
          original: originalPrompt.length,
          optimized: optimized.length
        },
        strengthScore: promptAnalysis?.strengthScore || 8,
        weaknesses: promptAnalysis?.weaknesses || [],
        platform: selectedPlatform,
        tone: toneLevel[0]
      };

      setOptimizedPrompt(optimized);
      
      const newResults = [result, ...optimizationResults.slice(0, 9)];
      const newUsage = usageCount + 1;
      
      setOptimizationResults(newResults);
      setUsageCount(newUsage);
      
      localStorage.setItem('promptOptimizationResults', JSON.stringify(newResults));
      localStorage.setItem('promptOptimizationUsage', newUsage.toString());

      toast({
        title: "✨ Optimization Complete!",
        description: "Your prompt has been enhanced with AI magic.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to optimize prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
      setTextMorphing(false);
    }
  };

  const generateOptimizedPrompt = (original: string, platform: string, tone: number): string => {
    const toneText = tone < 33 ? 'casual and friendly' : tone < 66 ? 'professional and clear' : 'technical and precise';
    
    return `${original}

Context: Provide detailed and specific information tailored for ${platform}.
Format: Structure your response clearly with examples and actionable insights.
Tone: Maintain a ${toneText} tone throughout your response.
Goal: Ensure the output is comprehensive, accurate, and immediately useful.
Constraints: Include relevant details and avoid unnecessary complexity.`;
  };

  const generateDetailedImprovements = (original: string, optimized: string): string[] => {
    return [
      'Enhanced clarity with specific context',
      'Added platform-specific optimization',
      'Improved structure with clear formatting',
      'Included tone and style guidelines',
      'Added success criteria and constraints'
    ];
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "✅ Copied!",
      description: "Text copied to clipboard with magic.",
    });
  };

  const loadTemplate = (template: PromptTemplate) => {
    setOriginalPrompt(template.template);
    setSelectedIntent(template.category.toLowerCase());
    toast({
      title: "Template Loaded",
      description: `${template.name} template is ready to customize.`,
    });
  };

  const applyQuickAction = (action: string) => {
    if (!originalPrompt.trim()) return;
    
    let modified = originalPrompt;
    switch (action) {
      case 'shorten':
        modified = `Please be concise. ${originalPrompt}`;
        break;
      case 'examples':
        modified = `${originalPrompt}

Please include specific examples and practical demonstrations.`;
        break;
      case 'professional':
        modified = `${originalPrompt}

Please respond in a professional, business-appropriate tone with industry-standard terminology.`;
        break;
      case 'technical':
        modified = `${originalPrompt}

Please provide a technical, detailed response with specific implementations and best practices.`;
        break;
    }
    setOriginalPrompt(modified);
  };

  const getToneDescription = (value: number): string => {
    if (value < 33) return 'Casual & Friendly';
    if (value < 66) return 'Professional & Clear';
    return 'Technical & Precise';
  };

  const getCharacterColor = (count: number): string => {
    if (count < 100) return 'text-destructive';
    if (count < 300) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 particle-bg" />
      
      {/* Header */}
      <motion.header 
        className="relative z-10 py-8 px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <motion.div 
              className="flex items-center gap-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-xl blur-lg opacity-50" />
                <div className="relative p-4 bg-gradient-primary rounded-xl">
                  <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gradient">
                  AI Prompt Optimizer
                </h1>
                <p className="text-muted-foreground text-lg">
                  Transform prompts into magic ✨
                </p>
              </div>
            </motion.div>
            
            <div className="flex items-center gap-4">
              <motion.div
                className="glass-card px-4 py-2 rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-sm text-muted-foreground">Optimized Today</span>
                <span className="ml-2 text-2xl font-bold text-primary">{usageCount}</span>
              </motion.div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="neon-border"
              >
                <History className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-12">
        {/* Split Screen Layout */}
        <div className="split-screen mb-12">
          {/* Original Prompt Panel */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass-card hover-lift">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Original Prompt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Platform & Intent Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Platform</label>
                    <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                      <SelectTrigger className="neon-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card">
                        {platformOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <option.icon className="w-4 h-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Intent</label>
                    <Select value={selectedIntent} onValueChange={setSelectedIntent}>
                      <SelectTrigger className="neon-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card">
                        <SelectItem value="general">General Purpose</SelectItem>
                        <SelectItem value="analysis">Data Analysis</SelectItem>
                        <SelectItem value="creative">Creative Writing</SelectItem>
                        <SelectItem value="code">Code Generation</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tone Slider */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Tone: {getToneDescription(toneLevel[0])}
                  </label>
                  <Slider
                    value={toneLevel}
                    onValueChange={setToneLevel}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Casual</span>
                    <span>Professional</span>
                    <span>Technical</span>
                  </div>
                </div>

                {/* Prompt Input */}
                <div className="relative">
                  <Textarea
                    value={originalPrompt}
                    onChange={(e) => setOriginalPrompt(e.target.value)}
                    placeholder="Enter your prompt here... ✨"
                    className="min-h-[300px] resize-none neon-border text-lg"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                      backdropFilter: 'blur(20px)'
                    }}
                  />
                  
                  {/* Character Counter */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <Badge variant="secondary" className={getCharacterColor(originalPrompt.length)}>
                      {originalPrompt.length} chars
                    </Badge>
                    <Badge variant="secondary">
                      ~{Math.ceil(originalPrompt.length / 4)} tokens
                    </Badge>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.action}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => applyQuickAction(action.action)}
                        className="w-full neon-border"
                        disabled={!originalPrompt.trim()}
                      >
                        <action.icon className="w-4 h-4 mr-2" />
                        {action.label}
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {/* Optimize Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={optimizePrompt}
                    disabled={isOptimizing || !originalPrompt.trim()}
                    className="w-full h-14 text-lg font-semibold bg-gradient-primary neon-glow"
                  >
                    {isOptimizing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                        Optimizing Magic...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 mr-3" />
                        Optimize Prompt
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Optimized Prompt Panel */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="glass-card hover-lift">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  Optimized Prompt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {optimizedPrompt ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative">
                      <motion.div
                        className={textMorphing ? 'animate-text-morph' : ''}
                      >
                        <Textarea
                          value={optimizedPrompt}
                          readOnly
                          className="min-h-[300px] resize-none text-lg border-success/30 bg-gradient-to-br from-success/5 to-transparent"
                        />
                      </motion.div>
                      
                      {/* Character Counter */}
                      <div className="absolute bottom-4 right-4 flex items-center gap-2">
                        <Badge variant="default" className="bg-success">
                          {optimizedPrompt.length} chars
                        </Badge>
                        <Badge variant="default" className="bg-success">
                          ~{Math.ceil(optimizedPrompt.length / 4)} tokens
                        </Badge>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyToClipboard(optimizedPrompt)}
                        variant="outline"
                        className="flex-1 neon-border"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        onClick={() => {
                          const dataStr = `data:text/plain;charset=utf-8,${encodeURIComponent(optimizedPrompt)}`;
                          const downloadAnchorNode = document.createElement('a');
                          downloadAnchorNode.setAttribute('href', dataStr);
                          downloadAnchorNode.setAttribute('download', `optimized-prompt-${Date.now()}.txt`);
                          document.body.appendChild(downloadAnchorNode);
                          downloadAnchorNode.click();
                          downloadAnchorNode.remove();
                        }}
                        variant="outline"
                        className="flex-1 neon-border"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="min-h-[300px] flex items-center justify-center">
                    <motion.div
                      className="text-center"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ArrowRight className="w-12 h-12 mx-auto mb-4 text-muted-foreground rotate-180" />
                      <p className="text-muted-foreground text-lg">
                        Your optimized prompt will appear here
                      </p>
                      <p className="text-muted-foreground text-sm mt-2">
                        Like magic ✨
                      </p>
                    </motion.div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Smart Analysis Panel */}
        <AnimatePresence>
          {promptAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Smart Analysis
                    {isAnalyzing && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary ml-2" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Strength Score */}
                    <div className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20" />
                        <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary">
                            {promptAnalysis.strengthScore}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">Prompt Strength</p>
                    </div>

                    {/* Detected Issues */}
                    <div>
                      <h4 className="font-semibold mb-3 text-center">Detected Issues</h4>
                      <div className="space-y-2">
                        {promptAnalysis.weaknesses.map((weakness, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4 text-warning" />
                            {weakness}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Category Detection */}
                    <div className="text-center">
                      <Badge variant="secondary" className="mb-2">
                        {promptAnalysis.category}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {promptAnalysis.confidence}% confidence
                      </p>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div 
                          className="bg-gradient-primary h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${promptAnalysis.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Templates */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold mb-6 text-center">
            Quick Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {promptTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="glass-card hover-lift cursor-pointer h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${template.color}`}>
                        <template.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      {template.description}
                    </p>
                    <Button
                      onClick={() => loadTemplate(template)}
                      variant="outline"
                      size="sm"
                      className="w-full neon-border"
                    >
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* History Panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 overflow-hidden"
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="w-5 h-5 text-primary" />
                      Optimization History
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHistory(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {optimizationResults.length === 0 ? (
                    <div className="text-center py-8">
                      <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No optimization history yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {optimizationResults.map((result, index) => (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="glass-card p-4 cursor-pointer hover-lift"
                          onClick={() => {
                            setOriginalPrompt(result.originalPrompt);
                            setOptimizedPrompt(result.optimizedPrompt);
                            setShowHistory(false);
                          }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline">{result.intent}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(result.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm truncate mb-2">
                            {result.originalPrompt}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              Score: {result.strengthScore}/10
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {result.platform}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
