import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, 
  Copy, 
  Download, 
  History, 
  BarChart, 
  Wand2, 
  FileText, 
  TrendingUp,
  Lightbulb,
  Clock,
  CheckCircle2,
  ArrowRight
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
}

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  category: string;
}

const promptTemplates: PromptTemplate[] = [
  {
    id: 'analysis',
    name: 'Data Analysis',
    description: 'Analyze data and provide insights',
    template: 'Analyze the following data and provide key insights, trends, and actionable recommendations: [INSERT DATA]',
    category: 'Analysis'
  },
  {
    id: 'blog',
    name: 'Blog Post',
    description: 'Create engaging blog content',
    template: 'Write a comprehensive and engaging blog post about [TOPIC]. Include an attention-grabbing introduction, 3-4 main sections with practical insights, and a compelling conclusion that encourages action.',
    category: 'Content'
  },
  {
    id: 'summary',
    name: 'Text Summary',
    description: 'Summarize long content',
    template: 'Provide a concise summary of the following text, highlighting the main points and key takeaways: [INSERT TEXT]',
    category: 'Summary'
  },
  {
    id: 'code',
    name: 'Code Generation',
    description: 'Generate clean, documented code',
    template: 'Generate clean, well-documented code for [FUNCTIONALITY]. Include comments explaining the logic and provide usage examples.',
    category: 'Code'
  },
  {
    id: 'creative',
    name: 'Creative Writing',
    description: 'Creative content generation',
    template: 'Create a creative and engaging piece about [TOPIC]. Use vivid descriptions, compelling characters (if applicable), and maintain a [TONE] throughout.',
    category: 'Creative'
  },
  {
    id: 'qa',
    name: 'Q&A Format',
    description: 'Question and answer format',
    template: 'Provide detailed answers to the following questions about [TOPIC]. Structure each answer clearly and include practical examples where relevant: [INSERT QUESTIONS]',
    category: 'Q&A'
  }
];

const intentOptions = [
  { value: 'general', label: 'General Purpose' },
  { value: 'analysis', label: 'Analyze Data' },
  { value: 'creative', label: 'Creative Writing' },
  { value: 'summary', label: 'Summarization' },
  { value: 'qa', label: 'Q&A' },
  { value: 'code', label: 'Code Generation' },
  { value: 'content', label: 'Content Creation' }
];

const Index = () => {
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [selectedIntent, setSelectedIntent] = useState('general');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult[]>([]);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [usageCount, setUsageCount] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load data from localStorage on component mount
    const savedResults = localStorage.getItem('promptOptimizationResults');
    const savedUsage = localStorage.getItem('promptOptimizationUsage');
    
    if (savedResults) {
      setOptimizationResults(JSON.parse(savedResults));
    }
    if (savedUsage) {
      setUsageCount(parseInt(savedUsage));
    }
  }, []);

  const saveToLocalStorage = (results: OptimizationResult[], usage: number) => {
    localStorage.setItem('promptOptimizationResults', JSON.stringify(results));
    localStorage.setItem('promptOptimizationUsage', usage.toString());
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
    
    try {
      // Simulate API call for now - in a real app, this would call OpenAI API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock optimization result
      const mockOptimized = `${originalPrompt}\n\nContext: Provide detailed and specific information.\nFormat: Structure your response clearly with examples where relevant.\nGoal: Ensure the output is actionable and comprehensive.`;
      
      const mockImprovements = [
        "Added specific context for clarity",
        "Improved structure with clear formatting instructions",
        "Enhanced specificity for better results",
        "Added examples requirement for practical guidance"
      ];

      const result: OptimizationResult = {
        id: Date.now().toString(),
        originalPrompt,
        optimizedPrompt: mockOptimized,
        improvements: mockImprovements,
        intent: selectedIntent,
        timestamp: Date.now(),
        characterCount: {
          original: originalPrompt.length,
          optimized: mockOptimized.length
        }
      };

      setOptimizedPrompt(mockOptimized);
      setImprovements(mockImprovements);
      setShowComparison(true);
      
      const newResults = [result, ...optimizationResults.slice(0, 4)];
      const newUsage = usageCount + 1;
      
      setOptimizationResults(newResults);
      setUsageCount(newUsage);
      saveToLocalStorage(newResults, newUsage);

      toast({
        title: "Success!",
        description: "Your prompt has been optimized successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to optimize prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard.",
    });
  };

  const exportPrompt = () => {
    if (!optimizedPrompt) return;
    
    const dataStr = `data:text/plain;charset=utf-8,${encodeURIComponent(optimizedPrompt)}`;
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', `optimized-prompt-${Date.now()}.txt`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const loadTemplate = (template: PromptTemplate) => {
    setOriginalPrompt(template.template);
    setSelectedIntent(template.category.toLowerCase());
  };

  const loadFromHistory = (result: OptimizationResult) => {
    setOriginalPrompt(result.originalPrompt);
    setOptimizedPrompt(result.optimizedPrompt);
    setImprovements(result.improvements);
    setSelectedIntent(result.intent);
    setShowComparison(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-glow">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
            AI Prompt Optimizer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your prompts into powerful, optimized instructions that get better AI results
          </p>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Prompts Optimized</p>
                  <p className="text-2xl font-bold text-primary">{usageCount}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Improvement</p>
                  <p className="text-2xl font-bold text-success">+127%</p>
                </div>
                <BarChart className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-success">98.5%</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="optimize" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="optimize" className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              Optimize
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="optimize" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    Original Prompt
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      What are you trying to do?
                    </label>
                    <Select value={selectedIntent} onValueChange={setSelectedIntent}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select intent" />
                      </SelectTrigger>
                      <SelectContent>
                        {intentOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Textarea
                      value={originalPrompt}
                      onChange={(e) => setOriginalPrompt(e.target.value)}
                      placeholder="Enter your prompt here..."
                      className="min-h-[200px] resize-y"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">
                        {originalPrompt.length} characters
                      </span>
                      <Badge variant="secondary">
                        ~{Math.ceil(originalPrompt.length / 4)} tokens
                      </Badge>
                    </div>
                  </div>

                  <Button 
                    onClick={optimizePrompt}
                    disabled={isOptimizing || !originalPrompt.trim()}
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    size="lg"
                  >
                    {isOptimizing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Optimize Prompt
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Output Section */}
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    Optimized Prompt
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {optimizedPrompt ? (
                    <>
                      <div className="relative">
                        <Textarea
                          value={optimizedPrompt}
                          readOnly
                          className="min-h-[200px] bg-success/5 border-success/20"
                        />
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-muted-foreground">
                            {optimizedPrompt.length} characters
                          </span>
                          <Badge variant="default" className="bg-success">
                            ~{Math.ceil(optimizedPrompt.length / 4)} tokens
                          </Badge>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={() => copyToClipboard(optimizedPrompt)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        <Button 
                          onClick={exportPrompt}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                      <div className="text-center">
                        <ArrowRight className="w-8 h-8 mx-auto mb-2 rotate-180" />
                        <p>Your optimized prompt will appear here</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Improvements Section */}
            {improvements.length > 0 && (
              <Card className="bg-gradient-card border-0 shadow-card animate-slide-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-success" />
                    Improvements Made
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {improvements.map((improvement, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-success/10 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
                        <span className="text-sm">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promptTemplates.map((template) => (
                <Card key={template.id} className="bg-gradient-card border-0 shadow-card hover:shadow-glow transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="secondary" className="w-fit">
                      {template.category}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {template.description}
                    </p>
                    <p className="text-sm bg-muted p-3 rounded-lg mb-4 font-mono">
                      {template.template.substring(0, 100)}...
                    </p>
                    <Button 
                      onClick={() => loadTemplate(template)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {optimizationResults.length === 0 ? (
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardContent className="p-12 text-center">
                  <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No optimization history yet</h3>
                  <p className="text-muted-foreground">
                    Start optimizing prompts to see your history here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {optimizationResults.map((result, index) => (
                  <Card 
                    key={result.id} 
                    className="bg-gradient-card border-0 shadow-card hover:shadow-glow transition-all duration-300 cursor-pointer"
                    onClick={() => loadFromHistory(result)}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            {result.intent}
                          </Badge>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {new Date(result.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Improvement</p>
                          <p className="text-lg font-semibold text-success">
                            +{Math.round(((result.characterCount.optimized - result.characterCount.original) / result.characterCount.original) * 100)}%
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-foreground mb-2 truncate">
                        <strong>Original:</strong> {result.originalPrompt}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        <strong>Optimized:</strong> {result.optimizedPrompt}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
