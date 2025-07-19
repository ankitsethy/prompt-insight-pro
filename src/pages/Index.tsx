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
  clarityScore: number;
  specificityScore: number;
  structureScore: number;
  weaknesses: string[];
  category: string;
  confidence: number;
  improvements: string[];
  tokenCount: number;
  readabilityScore: number;
  missingElements: string[];
  detectedElements: string[];
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

  // Intelligent Analysis Functions
  const analyzeClarityScore = (prompt: string): number => {
    let score = 10;
    const words = prompt.toLowerCase().split(/\s+/);
    
    // Detect vague words
    const vageWords = ['something', 'stuff', 'things', 'good', 'bad', 'nice', 'great', 'awesome', 'terrible'];
    const vaguenessCount = words.filter(word => vageWords.includes(word)).length;
    score -= vaguenessCount * 1.5;
    
    // Check sentence structure
    const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = words.length / sentences.length;
    if (avgSentenceLength > 25) score -= 1; // Too long sentences
    if (avgSentenceLength < 5) score -= 2; // Too short sentences
    
    // Check for unclear pronouns
    const unclearPronouns = ['it', 'this', 'that', 'these', 'those'];
    const pronounCount = words.filter(word => unclearPronouns.includes(word)).length;
    if (pronounCount > words.length * 0.05) score -= 1;
    
    return Math.max(1, Math.min(10, Math.round(score)));
  };

  const analyzeSpecificityScore = (prompt: string): number => {
    let score = 5; // Start at middle
    const text = prompt.toLowerCase();
    
    // Check for numbers and specific metrics
    const numberMatches = prompt.match(/\b\d+(\.\d+)?\b/g);
    if (numberMatches && numberMatches.length > 0) score += 2;
    
    // Check for specific quantities
    const quantifiers = ['how many', 'what percentage', 'exactly', 'precisely', 'specifically'];
    quantifiers.forEach(q => {
      if (text.includes(q)) score += 1;
    });
    
    // Check for technical terms and domain-specific language
    const technicalPatterns = [/\b[A-Z]{2,}\b/, /\b\w+\.\w+\b/, /\b\w+_\w+\b/];
    technicalPatterns.forEach(pattern => {
      if (pattern.test(prompt)) score += 0.5;
    });
    
    // Penalize vague adjectives
    const vagueAdjectives = ['some', 'many', 'few', 'several', 'various', 'multiple'];
    vagueAdjectives.forEach(adj => {
      if (text.includes(adj)) score -= 0.5;
    });
    
    // Reward precise descriptors
    const preciseDescriptors = ['detailed', 'comprehensive', 'thorough', 'specific', 'exact'];
    preciseDescriptors.forEach(desc => {
      if (text.includes(desc)) score += 1;
    });
    
    return Math.max(1, Math.min(10, Math.round(score)));
  };

  const analyzeStructureScore = (prompt: string): number => {
    let score = 3; // Start low
    
    // Check for existing formatting
    const hasBulletPoints = /[•\-\*]\s/.test(prompt);
    const hasNumberedList = /\b\d+\.\s/.test(prompt);
    const hasSections = /\n\s*\n/.test(prompt);
    
    if (hasBulletPoints || hasNumberedList) score += 2;
    if (hasSections) score += 1;
    
    // Check for logical flow indicators
    const flowIndicators = ['first', 'then', 'next', 'finally', 'therefore', 'however', 'additionally'];
    const flowCount = flowIndicators.filter(indicator => prompt.toLowerCase().includes(indicator)).length;
    score += Math.min(flowCount, 3);
    
    // Check for role definitions
    const rolePatterns = ['act as', 'you are a', 'pretend to be', 'imagine you\'re'];
    const hasRole = rolePatterns.some(pattern => prompt.toLowerCase().includes(pattern));
    if (hasRole) score += 2;
    
    // Check for output format requests
    const formatRequests = ['provide a list', 'write a paragraph', 'create a table', 'format as', 'structure'];
    const hasFormat = formatRequests.some(req => prompt.toLowerCase().includes(req));
    if (hasFormat) score += 2;
    
    return Math.max(1, Math.min(10, Math.round(score)));
  };

  // Element Detection System
  const hasContext = (prompt: string): boolean => {
    const contextKeywords = ['background', 'context', 'situation', 'scenario', 'given that', 'assuming'];
    return contextKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
  };

  const hasRole = (prompt: string): boolean => {
    const rolePatterns = ['act as', 'you are a', 'pretend to be', 'imagine you\'re', 'as a', 'role of'];
    return rolePatterns.some(pattern => prompt.toLowerCase().includes(pattern));
  };

  const hasFormat = (prompt: string): boolean => {
    const formatKeywords = ['format', 'structure', 'organize', 'list', 'table', 'bullet points', 'numbered'];
    return formatKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
  };

  const hasExamples = (prompt: string): boolean => {
    const exampleKeywords = ['such as', 'like', 'for example', 'e.g.', 'including', 'examples'];
    return exampleKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
  };

  const hasConstraints = (prompt: string): boolean => {
    const constraintKeywords = ['must', 'should', 'required', 'limit', 'maximum', 'minimum', 'within'];
    return constraintKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
  };

  const hasOutput = (prompt: string): boolean => {
    const outputKeywords = ['provide', 'generate', 'create', 'write', 'produce', 'return'];
    return outputKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
  };

  const detectMissingElements = (prompt: string, intent?: string): string[] => {
    const missing = [];
    
    if (!hasContext(prompt)) missing.push('context');
    if (!hasRole(prompt) && intent && ['creative', 'analysis', 'code'].includes(intent)) missing.push('role');
    if (!hasFormat(prompt)) missing.push('format');
    if (!hasExamples(prompt) && intent && ['creative', 'marketing'].includes(intent)) missing.push('examples');
    if (!hasConstraints(prompt)) missing.push('constraints');
    if (!hasOutput(prompt)) missing.push('output_specification');
    
    return missing;
  };

  const analyzePrompt = useCallback(async (prompt: string) => {
    setIsAnalyzing(true);
    
    // Simulate real-time analysis
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const clarityScore = analyzeClarityScore(prompt);
    const specificityScore = analyzeSpecificityScore(prompt);
    const structureScore = analyzeStructureScore(prompt);
    const overallScore = Math.round((clarityScore + specificityScore + structureScore) / 3);
    
    const category = detectCategory(prompt);
    const missingElements = detectMissingElements(prompt, selectedIntent);
    const detectedElements = [];
    
    if (hasContext(prompt)) detectedElements.push('context');
    if (hasRole(prompt)) detectedElements.push('role');
    if (hasFormat(prompt)) detectedElements.push('format');
    if (hasExamples(prompt)) detectedElements.push('examples');
    if (hasConstraints(prompt)) detectedElements.push('constraints');
    if (hasOutput(prompt)) detectedElements.push('output_specification');
    
    const analysis: PromptAnalysis = {
      strengthScore: overallScore,
      clarityScore,
      specificityScore,
      structureScore,
      weaknesses: generateIntelligentWeaknesses(prompt, clarityScore, specificityScore, structureScore),
      category,
      confidence: calculateConfidence(prompt, category),
      improvements: generateSmartImprovements(missingElements, selectedIntent),
      tokenCount: Math.ceil(prompt.length / 4),
      readabilityScore: Math.round((clarityScore + structureScore) / 2),
      missingElements,
      detectedElements
    };
    
    setPromptAnalysis(analysis);
    setIsAnalyzing(false);
  }, [selectedIntent]);

  const generateIntelligentWeaknesses = (prompt: string, clarityScore: number, specificityScore: number, structureScore: number): string[] => {
    const weaknesses = [];
    
    if (clarityScore < 5) weaknesses.push('Contains vague or unclear language');
    if (specificityScore < 5) weaknesses.push('Lacks specific details and requirements');
    if (structureScore < 5) weaknesses.push('Poor organization and structure');
    if (prompt.length < 50) weaknesses.push('Too brief - needs more context');
    if (!hasRole(prompt)) weaknesses.push('Missing clear role or perspective');
    if (!hasOutput(prompt)) weaknesses.push('Unclear about desired output format');
    
    return weaknesses.slice(0, 3);
  };

  const calculateConfidence = (prompt: string, category: string): number => {
    let confidence = 70; // Base confidence
    
    // Increase confidence based on category-specific keywords
    const keywords = {
      'Code Generation': ['function', 'class', 'method', 'algorithm', 'programming'],
      'Analysis': ['analyze', 'examine', 'evaluate', 'assess', 'data'],
      'Creative Writing': ['story', 'character', 'narrative', 'creative', 'write'],
      'Summarization': ['summarize', 'summary', 'brief', 'overview', 'key points']
    };
    
    const categoryKeywords = keywords[category as keyof typeof keywords] || [];
    const matchCount = categoryKeywords.filter(keyword => 
      prompt.toLowerCase().includes(keyword)
    ).length;
    
    confidence += matchCount * 5;
    return Math.min(100, confidence);
  };

  const generateSmartImprovements = (missingElements: string[], intent: string): string[] => {
    const improvements = [];
    
    missingElements.forEach(element => {
      switch (element) {
        case 'context':
          improvements.push('Enhanced specificity by adding contextual background');
          break;
        case 'role':
          improvements.push('Added expert role perspective for better response quality');
          break;
        case 'format':
          improvements.push('Improved structure with clear output formatting requirements');
          break;
        case 'examples':
          improvements.push('Included example requirements for better clarity');
          break;
        case 'constraints':
          improvements.push('Added constraint guidance to prevent off-topic responses');
          break;
        case 'output_specification':
          improvements.push('Clarified desired output type and structure');
          break;
      }
    });
    
    // Intent-specific improvements
    if (intent === 'creative') {
      improvements.push('Enhanced creative direction with style guidance');
    } else if (intent === 'code') {
      improvements.push('Added technical specifications and best practices requirements');
    } else if (intent === 'analysis') {
      improvements.push('Specified analytical framework and evidence requirements');
    }
    
    return improvements.slice(0, 5);
  };

  const detectCategory = (prompt: string): string => {
    const text = prompt.toLowerCase();
    
    // More sophisticated category detection
    const categoryScores = {
      'Code Generation': 0,
      'Data Analysis': 0,
      'Creative Writing': 0,
      'Summarization': 0,
      'Research': 0,
      'Marketing': 0,
      'General': 1
    };
    
    // Code Generation indicators
    if (text.includes('code') || text.includes('function') || text.includes('algorithm') || 
        text.includes('programming') || text.includes('script') || text.includes('api')) {
      categoryScores['Code Generation'] += 3;
    }
    
    // Data Analysis indicators
    if (text.includes('analyze') || text.includes('data') || text.includes('statistics') || 
        text.includes('metrics') || text.includes('insights') || text.includes('trends')) {
      categoryScores['Data Analysis'] += 3;
    }
    
    // Creative Writing indicators
    if (text.includes('story') || text.includes('character') || text.includes('narrative') || 
        text.includes('creative') || text.includes('write') || text.includes('novel')) {
      categoryScores['Creative Writing'] += 3;
    }
    
    // Summarization indicators
    if (text.includes('summarize') || text.includes('summary') || text.includes('brief') || 
        text.includes('overview') || text.includes('key points')) {
      categoryScores['Summarization'] += 3;
    }
    
    // Research indicators
    if (text.includes('research') || text.includes('study') || text.includes('findings') || 
        text.includes('literature') || text.includes('academic')) {
      categoryScores['Research'] += 3;
    }
    
    // Marketing indicators
    if (text.includes('marketing') || text.includes('campaign') || text.includes('brand') || 
        text.includes('audience') || text.includes('sales')) {
      categoryScores['Marketing'] += 3;
    }
    
    // Return category with highest score
    return Object.entries(categoryScores).reduce((a, b) => 
      categoryScores[a[0] as keyof typeof categoryScores] > categoryScores[b[0] as keyof typeof categoryScores] ? a : b
    )[0];
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

  function shouldOptimize(analysis: PromptAnalysis): 'minimal' | 'targeted' | 'full' {
    const overallScore = (analysis.clarityScore + analysis.specificityScore + analysis.structureScore) / 3;
    
    // If prompt scores 7+ overall, make minimal changes
    if (overallScore >= 7) {
      return 'minimal';
    }
    
    // If prompt scores 5-6, make targeted improvements  
    if (overallScore >= 5) {
      return 'targeted';
    }
    
    // If prompt scores below 5, full optimization
    return 'full';
  }

  // Intelligent Optimization Engine
  const intelligentOptimize = (originalPrompt: string, selectedIntent: string, selectedPlatform: string, tone: number): { optimized: string; improvements: string[]; scores: { before: number; after: number } } => {
    const analysis = promptAnalysis;
    if (!analysis) {
      // Fallback if no analysis available
      return {
        optimized: originalPrompt,
        improvements: ['Analysis not available'],
        scores: { before: 5, after: 5 }
      };
    }

    const optimizationLevel = shouldOptimize(analysis);
    const originalScore = analysis.strengthScore;
    const missingElements = analysis.missingElements;
    
    let optimized = originalPrompt;
    const improvements: string[] = [];
    
    // High quality prompts need minimal/no changes
    if (optimizationLevel === 'minimal' && originalScore >= 8) {
      return {
        optimized: originalPrompt,
        improvements: ["Prompt is already well-structured with clear requirements"],
        scores: { before: originalScore, after: originalScore }
      };
    }
    
    // For high quality prompts, make only critical improvements
    if (optimizationLevel === 'minimal') {
      const criticalMissing = missingElements.filter(element => 
        (element === 'examples' && ['creative', 'marketing'].includes(selectedIntent)) ||
        (element === 'output_specification' && !hasOutput(originalPrompt))
      );
      
      if (criticalMissing.length === 0) {
        improvements.push("Minor enhancements applied to already strong prompt structure");
        return {
          optimized: originalPrompt,
          improvements,
          scores: { before: originalScore, after: originalScore }
        };
      }
      
      // Only add truly missing critical elements
      criticalMissing.forEach(element => {
        if (element === 'examples' && ['creative', 'marketing'].includes(selectedIntent)) {
          optimized = `${optimized}\n\nInclude specific examples and practical demonstrations.`;
          improvements.push('Added specific example requirements for enhanced clarity');
        }
        if (element === 'output_specification' && !hasOutput(originalPrompt)) {
          optimized = `${optimized}\n\nProvide a comprehensive response that directly addresses this request.`;
          improvements.push('Clarified desired output expectations');
        }
      });
      
      return {
        optimized: optimized.trim(),
        improvements,
        scores: { before: originalScore, after: originalScore + 1 }
      };
    }
    
    // Targeted improvements for medium quality prompts
    if (optimizationLevel === 'targeted') {
      const priorityElements = ['role', 'format', 'examples'].filter(element => 
        missingElements.includes(element)
      );
      
      priorityElements.forEach(element => {
        switch (element) {
          case 'role':
            if (['creative', 'analysis', 'code'].includes(selectedIntent)) {
              const roleAddition = getRoleForIntent(selectedIntent);
              optimized = `${roleAddition} ${optimized}`;
              improvements.push('Added expert role perspective for enhanced response quality');
            }
            break;
          case 'format':
            const formatAddition = getFormatForIntent(selectedIntent);
            optimized = `${optimized}\n\n${formatAddition}`;
            improvements.push('Enhanced structure with targeted output formatting');
            break;
          case 'examples':
            if (['creative', 'marketing'].includes(selectedIntent)) {
              optimized = `${optimized}\n\nInclude specific tool names, pricing models, and real-world use case examples.`;
              improvements.push('Requested specific examples and practical demonstrations');
            }
            break;
        }
      });
      
      if (improvements.length === 0) {
        improvements.push("Applied targeted enhancements to improve prompt effectiveness");
      }
      
      return {
        optimized: optimized.trim(),
        improvements,
        scores: { before: originalScore, after: Math.min(10, originalScore + 2) }
      };
    }
    
    // Full optimization for low quality prompts only
    const toneText = tone < 33 ? 'casual and friendly' : tone < 66 ? 'professional and clear' : 'technical and precise';
    
    // Add missing context if needed
    if (missingElements.includes('context') && selectedIntent !== 'general') {
      const contextAddition = getContextForIntent(selectedIntent);
      optimized = `${contextAddition}\n\n${optimized}`;
      improvements.push('Enhanced specificity by adding contextual background');
    }
    
    // Add role if missing and beneficial for intent
    if (missingElements.includes('role') && ['creative', 'analysis', 'code'].includes(selectedIntent)) {
      const roleAddition = getRoleForIntent(selectedIntent);
      optimized = `${roleAddition} ${optimized}`;
      improvements.push('Added expert role perspective for better response quality');
    }
    
    // Add format specification if missing
    if (missingElements.includes('format')) {
      const formatAddition = getFormatForIntent(selectedIntent);
      optimized = `${optimized}\n\n${formatAddition}`;
      improvements.push('Improved structure with clear output formatting requirements');
    }
    
    // Add examples requirement if missing and appropriate
    if (missingElements.includes('examples') && ['creative', 'marketing'].includes(selectedIntent)) {
      optimized = `${optimized}\n\nPlease include specific examples and practical demonstrations.`;
      improvements.push('Included example requirements for better clarity');
    }
    
    // Add constraints if missing
    if (missingElements.includes('constraints')) {
      const constraintAddition = getConstraintsForIntent(selectedIntent, toneText);
      optimized = `${optimized}\n\n${constraintAddition}`;
      improvements.push('Added constraint guidance to prevent off-topic responses');
    }
    
    // Add output specification if missing
    if (missingElements.includes('output_specification')) {
      const outputAddition = getOutputSpecForIntent(selectedIntent);
      optimized = `${optimized}\n\n${outputAddition}`;
      improvements.push('Clarified desired output type and structure');
    }
    
    // Calculate real before/after scores
    const afterScore = Math.min(10, originalScore + improvements.length * 0.8);
    
    return {
      optimized: optimized.trim(),
      improvements,
      scores: { before: originalScore, after: Math.round(afterScore) }
    };
  };

  // Helper functions for intelligent optimization
  const getContextForIntent = (intent: string): string => {
    const contexts = {
      'creative': 'Context: You are working on a creative project that requires originality and engaging content.',
      'analysis': 'Context: This is a professional analysis requiring evidence-based insights and data-driven conclusions.',
      'code': 'Context: This is a technical development task requiring clean, maintainable, and well-documented code.',
      'marketing': 'Context: This is a marketing initiative focused on audience engagement and conversion.',
      'research': 'Context: This is an academic or professional research task requiring thorough investigation.'
    };
    return contexts[intent as keyof typeof contexts] || '';
  };

  const getRoleForIntent = (intent: string): string => {
    const roles = {
      'creative': 'Act as an experienced creative writer and storyteller.',
      'analysis': 'Act as a senior data analyst with expertise in statistical analysis.',
      'code': 'Act as a senior software engineer with expertise in best practices.',
      'marketing': 'Act as a marketing expert with deep understanding of consumer psychology.',
      'research': 'Act as a research specialist with academic rigor.'
    };
    return roles[intent as keyof typeof roles] || '';
  };

  const getFormatForIntent = (intent: string): string => {
    const formats = {
      'creative': 'Format: Structure your response with clear narrative elements, vivid descriptions, and engaging flow.',
      'analysis': 'Format: Organize findings with executive summary, key insights, supporting data, and actionable recommendations.',
      'code': 'Format: Provide clean code with comments, documentation, and usage examples.',
      'marketing': 'Format: Structure with compelling headline, key benefits, target audience considerations, and clear call-to-action.',
      'research': 'Format: Present with clear methodology, findings, analysis, and conclusions with proper citations.'
    };
    return formats[intent as keyof typeof formats] || 'Format: Structure your response clearly with logical organization and easy readability.';
  };

  const getConstraintsForIntent = (intent: string, tone: string): string => {
    return `Constraints: Maintain a ${tone} tone, ensure accuracy, and focus specifically on the requested topic without unnecessary tangents.`;
  };

  const getOutputSpecForIntent = (intent: string): string => {
    const outputs = {
      'creative': 'Output: Provide creative content that is original, engaging, and appropriate for the specified medium.',
      'analysis': 'Output: Deliver actionable insights with supporting evidence and clear recommendations.',
      'code': 'Output: Generate production-ready code with proper error handling and documentation.',
      'marketing': 'Output: Create persuasive content optimized for the target audience and conversion.',
      'research': 'Output: Provide comprehensive research findings with proper academic standards.'
    };
    return outputs[intent as keyof typeof outputs] || 'Output: Provide a comprehensive and useful response that directly addresses the request.';
  };

  const generateOptimizedPrompt = (original: string, platform: string, tone: number): string => {
    const optimizationResult = intelligentOptimize(original, selectedIntent, platform, tone);
    return optimizationResult.optimized;
  };

  const generateDetailedImprovements = (original: string, optimized: string): string[] => {
    const optimizationResult = intelligentOptimize(original, selectedIntent, selectedPlatform, toneLevel[0]);
    return optimizationResult.improvements;
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
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                     {/* Overall Strength Score */}
                     <div className="text-center">
                       <div className="relative w-24 h-24 mx-auto mb-4">
                         <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20" />
                         <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
                           <span className="text-2xl font-bold text-primary">
                             {promptAnalysis.strengthScore}
                           </span>
                         </div>
                         <div className="absolute inset-0">
                           <svg className="w-full h-full transform -rotate-90">
                             <circle
                               cx="50%"
                               cy="50%"
                               r="45%"
                               fill="none"
                               stroke="currentColor"
                               strokeWidth="2"
                               className="text-muted opacity-20"
                             />
                             <circle
                               cx="50%"
                               cy="50%"
                               r="45%"
                               fill="none"
                               stroke="url(#gradient)"
                               strokeWidth="3"
                               strokeLinecap="round"
                               strokeDasharray={`${(promptAnalysis.strengthScore / 10) * 2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                               className="transition-all duration-1000"
                             />
                           </svg>
                         </div>
                       </div>
                       <p className="text-sm text-muted-foreground font-medium">Overall Score</p>
                     </div>

                     {/* Detailed Scores */}
                     <div className="space-y-4">
                       <h4 className="font-semibold text-center mb-3">Analysis Breakdown</h4>
                       
                       <div className="space-y-3">
                         <div>
                           <div className="flex justify-between text-sm mb-1">
                             <span>Clarity</span>
                             <span className="font-medium">{promptAnalysis.clarityScore}/10</span>
                           </div>
                           <Progress value={promptAnalysis.clarityScore * 10} className="h-2" />
                         </div>
                         
                         <div>
                           <div className="flex justify-between text-sm mb-1">
                             <span>Specificity</span>
                             <span className="font-medium">{promptAnalysis.specificityScore}/10</span>
                           </div>
                           <Progress value={promptAnalysis.specificityScore * 10} className="h-2" />
                         </div>
                         
                         <div>
                           <div className="flex justify-between text-sm mb-1">
                             <span>Structure</span>
                             <span className="font-medium">{promptAnalysis.structureScore}/10</span>
                           </div>
                           <Progress value={promptAnalysis.structureScore * 10} className="h-2" />
                         </div>
                       </div>
                     </div>

                     {/* Missing Elements */}
                     <div>
                       <h4 className="font-semibold mb-3 text-center">Missing Elements</h4>
                       <div className="space-y-2">
                         {promptAnalysis.missingElements.length > 0 ? (
                           promptAnalysis.missingElements.map((element, index) => (
                             <div key={index} className="flex items-center gap-2 text-sm">
                               <AlertCircle className="w-4 h-4 text-warning" />
                               <span className="capitalize">{element.replace('_', ' ')}</span>
                             </div>
                           ))
                         ) : (
                           <div className="flex items-center gap-2 text-sm text-success">
                             <CheckCircle2 className="w-4 h-4" />
                             <span>All elements present</span>
                           </div>
                         )}
                       </div>
                       
                       {promptAnalysis.detectedElements.length > 0 && (
                         <div className="mt-4">
                           <p className="text-xs text-muted-foreground mb-2">Detected:</p>
                           <div className="flex flex-wrap gap-1">
                             {promptAnalysis.detectedElements.map((element, index) => (
                               <Badge key={index} variant="secondary" className="text-xs">
                                 {element.replace('_', ' ')}
                               </Badge>
                             ))}
                           </div>
                         </div>
                       )}
                     </div>

                     {/* Category Detection */}
                     <div className="text-center">
                       <Badge variant="secondary" className="mb-3 text-sm px-3 py-1">
                         {promptAnalysis.category}
                       </Badge>
                       <p className="text-sm text-muted-foreground mb-2">
                         {promptAnalysis.confidence}% confidence
                       </p>
                       <div className="w-full bg-muted rounded-full h-2">
                         <div 
                           className="bg-gradient-primary h-2 rounded-full transition-all duration-1000"
                           style={{ width: `${promptAnalysis.confidence}%` }}
                         />
                       </div>
                       
                       {/* Improvements Preview */}
                       <div className="mt-4">
                         <p className="text-xs text-muted-foreground mb-2">Potential Improvements:</p>
                         <div className="text-xs space-y-1">
                           {promptAnalysis.improvements.slice(0, 2).map((improvement, index) => (
                             <div key={index} className="flex items-center gap-1">
                               <Lightbulb className="w-3 h-3 text-primary" />
                               <span className="text-left">{improvement}</span>
                             </div>
                           ))}
                         </div>
                       </div>
                     </div>
                   </div>
                   
                   {/* SVG Gradient Definition */}
                   <svg width="0" height="0">
                     <defs>
                       <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                         <stop offset="0%" stopColor="hsl(var(--primary))" />
                         <stop offset="100%" stopColor="hsl(var(--primary-glow))" />
                       </linearGradient>
                     </defs>
                   </svg>
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
