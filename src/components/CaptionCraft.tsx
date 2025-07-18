import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, Image, Video, Sparkles, Download, RefreshCw, Copy, Check, AlertCircle, Bot, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

// Types
interface Platform {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
}

interface RefinedPrompt {
  id: string;
  text: string;
  selected: boolean;
}

interface CaptionOutput {
  platform: string;
  captions: string[];
}

interface WorkflowState {
  step: 'input' | 'refinement' | 'generation' | 'output';
  apiKey: string;
  productContext: string;
  selectedPlatforms: string[];
  coreIdea: string;
  mediaFiles: File[];
  refinedPrompts: RefinedPrompt[];
  selectedPrompt: string;
  generatedCaptions: CaptionOutput[];
  isLoading: boolean;
  error: string | null;
}

const PLATFORMS: Platform[] = [
  { id: 'twitter', name: 'Twitter/X', color: 'bg-blue-500', icon: '𝕏', description: '280 chars, trending hashtags' },
  { id: 'threads', name: 'Threads', color: 'bg-black', icon: '@', description: 'Conversational, authentic' },
  { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-r from-purple-500 to-pink-500', icon: '📷', description: 'Visual-first, story-driven' },
  { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-600', icon: '💼', description: 'Professional, thought leadership' },
  { id: 'facebook', name: 'Facebook', color: 'bg-blue-700', icon: '👥', description: 'Community-focused, engaging' },
  { id: 'reddit', name: 'Reddit', color: 'bg-orange-600', icon: '🤔', description: 'Authentic, value-driven' },
  { id: 'quora', name: 'Quora', color: 'bg-red-600', icon: '❓', description: 'Educational, detailed answers' },
];

const CaptionCraft: React.FC = () => {
  const [state, setState] = useState<WorkflowState>({
    step: 'input',
    apiKey: '',
    productContext: '',
    selectedPlatforms: [],
    coreIdea: '',
    mediaFiles: [],
    refinedPrompts: [],
    selectedPrompt: '',
    generatedCaptions: [],
    isLoading: false,
    error: null,
  });

  const [copiedCaption, setCopiedCaption] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contextFileRef = useRef<HTMLInputElement>(null);

  // File upload handlers
  const handleContextFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setState(prev => ({ ...prev, productContext: content }));
    };
    reader.readAsText(file);
  }, []);

  const handleMediaUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setState(prev => ({ ...prev, mediaFiles: [...prev.mediaFiles, ...files].slice(0, 5) }));
  }, []);

  const removeMediaFile = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter((_, i) => i !== index)
    }));
  }, []);

  // Platform selection
  const togglePlatform = useCallback((platformId: string) => {
    setState(prev => ({
      ...prev,
      selectedPlatforms: prev.selectedPlatforms.includes(platformId)
        ? prev.selectedPlatforms.filter(p => p !== platformId)
        : [...prev.selectedPlatforms, platformId]
    }));
  }, []);

  // Mock API calls (replace with actual API integration)
  const generateRefinedPrompts = useCallback(async () => {
    if (!state.coreIdea.trim()) {
      toast.error('Please enter your core idea first');
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockRefinedPrompts: RefinedPrompt[] = [
        {
          id: '1',
          text: `Create compelling social media captions that highlight the unique value proposition of ${state.coreIdea}, emphasizing user benefits and emotional connection while maintaining authentic brand voice.`,
          selected: false
        },
        {
          id: '2',
          text: `Generate engaging, platform-optimized captions for ${state.coreIdea} that drive user engagement through storytelling, clear calls-to-action, and strategic hashtag implementation.`,
          selected: false
        },
        {
          id: '3',
          text: `Develop creative, conversion-focused social media content for ${state.coreIdea} that addresses target audience pain points while showcasing product benefits through relatable scenarios.`,
          selected: false
        }
      ];

      setState(prev => ({
        ...prev,
        refinedPrompts: mockRefinedPrompts,
        step: 'refinement',
        isLoading: false
      }));

      toast.success('Refined prompts generated successfully!');
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to generate refined prompts. Please try again.',
        isLoading: false
      }));
      toast.error('Failed to generate prompts');
    }
  }, [state.coreIdea]);

  const selectRefinedPrompt = useCallback((promptId: string) => {
    const prompt = state.refinedPrompts.find(p => p.id === promptId);
    if (prompt) {
      setState(prev => ({
        ...prev,
        selectedPrompt: prompt.text,
        step: 'generation'
      }));
    }
  }, [state.refinedPrompts]);

  const generateCaptions = useCallback(async () => {
    if (!state.selectedPrompt || state.selectedPlatforms.length === 0) {
      toast.error('Please select a refined prompt and at least one platform');
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockCaptions: CaptionOutput[] = state.selectedPlatforms.map(platformId => {
        const platform = PLATFORMS.find(p => p.id === platformId);
        return {
          platform: platform?.name || platformId,
          captions: [
            `🚀 Discover the power of ${state.coreIdea}! Transform your workflow and boost productivity like never before. #Innovation #ProductivityHack`,
            `Ready to revolutionize your approach? ${state.coreIdea} is here to change everything. Join thousands who've already made the switch! ✨`,
            `Why settle for ordinary when you can have extraordinary? ${state.coreIdea} delivers results that speak for themselves. See the difference today!`,
            `Breaking: ${state.coreIdea} just made [problem] a thing of the past. Early adopters are seeing incredible results! 🎯 #GameChanger`,
            `The secret to [specific benefit]? It's simpler than you think. ${state.coreIdea} shows you exactly how. Ready to get started? 💡`
          ]
        };
      });

      setState(prev => ({
        ...prev,
        generatedCaptions: mockCaptions,
        step: 'output',
        isLoading: false
      }));

      toast.success('Captions generated successfully!');
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to generate captions. Please try again.',
        isLoading: false
      }));
      toast.error('Failed to generate captions');
    }
  }, [state.selectedPrompt, state.selectedPlatforms, state.coreIdea]);

  const regenerateCaptions = useCallback(() => {
    generateCaptions();
  }, [generateCaptions]);

  const copyCaption = useCallback((caption: string, index: string) => {
    navigator.clipboard.writeText(caption);
    setCopiedCaption(index);
    setTimeout(() => setCopiedCaption(null), 2000);
    toast.success('Caption copied to clipboard!');
  }, []);

  const downloadCaptions = useCallback(() => {
    const content = state.generatedCaptions.map(platform => 
      `${platform.platform.toUpperCase()} CAPTIONS:\n${'='.repeat(30)}\n\n${platform.captions.map((caption, i) => `${i + 1}. ${caption}`).join('\n\n')}\n\n`
    ).join('\n');

    const blob = new Blob([`CAPTIONCRAFT GENERATED CAPTIONS\n${'='.repeat(40)}\n\n${content}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'captions.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Captions downloaded successfully!');
  }, [state.generatedCaptions]);

return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30 animate-glow-pulse" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      {/* Header */}
      <div className="relative border-b border-border/50 bg-gradient-primary backdrop-blur-sm">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative p-4 bg-white/20 rounded-xl backdrop-blur-md border border-white/30 shadow-glow">
                <Sparkles className="w-10 h-10 text-white animate-pulse" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full animate-bounce" />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  CaptionCraft
                </h1>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
                  <span className="text-sm text-white/70 font-medium tracking-wide">AI POWERED</span>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Transform your ideas into <span className="font-semibold text-white">engaging social media captions</span> with our intelligent meta-prompting workflow
            </p>
            <div className="flex items-center justify-center gap-6 mt-6 text-white/80">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <span className="text-sm">Smart AI</span>
              </div>
              <div className="w-1 h-1 bg-white/40 rounded-full" />
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                <span className="text-sm">Meta-Prompting</span>
              </div>
              <div className="w-1 h-1 bg-white/40 rounded-full" />
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Multi-Platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-6 py-12 max-w-5xl">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6 relative">
            {['Input', 'Refinement', 'Generation', 'Output'].map((step, index) => {
              const isActive = ['input', 'refinement', 'generation', 'output'].indexOf(state.step) >= index;
              const isCurrent = ['input', 'refinement', 'generation', 'output'].indexOf(state.step) === index;
              
              return (
                <div
                  key={step}
                  className={`flex flex-col items-center gap-3 relative z-10 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-lg ${
                      isCurrent
                        ? 'bg-primary text-primary-foreground scale-110 shadow-glow animate-glow-pulse'
                        : isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary border-2 border-border text-muted-foreground'
                    }`}
                  >
                    {isActive ? (
                      <Sparkles className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`font-semibold text-sm ${isCurrent ? 'text-primary' : ''}`}>
                    {step}
                  </span>
                </div>
              );
            })}
            
            {/* Connecting Line */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-border -z-10" />
          </div>
          
          <div className="relative w-full bg-secondary/50 rounded-full h-3 overflow-hidden border border-border/50">
            <div
              className="bg-gradient-primary h-full rounded-full transition-all duration-500 ease-out relative"
              style={{
                width: `${((['input', 'refinement', 'generation', 'output'].indexOf(state.step) + 1) / 4) * 100}%`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {state.error && (
          <Alert className="mb-6 border-destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Input */}
        {state.step === 'input' && (
          <div className="space-y-8 animate-fade-in">
            {/* API Key Input */}
            <Card className="step-card group hover:shadow-glow transition-all duration-300 border-primary/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  LLM API Configuration
                  <div className="ml-auto px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full">
                    SECURE
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="apiKey" className="text-sm font-medium flex items-center gap-2">
                    API Key (OpenAI, Anthropic, or Google)
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="sk-..."
                      value={state.apiKey}
                      onChange={(e) => setState(prev => ({ ...prev, apiKey: e.target.value }))}
                      className="font-mono pr-12 border-border/50 focus:border-primary/50 transition-colors"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {state.apiKey && <Check className="w-4 h-4 text-success" />}
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg border border-border/30">
                    <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Your API key is used securely and never stored permanently. We use client-side encryption.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Context Upload */}
            <Card className="step-card group hover:shadow-glow transition-all duration-300 border-primary/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  Product/Brand Context
                  <div className="ml-auto px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full">
                    OPTIONAL
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div
                    className={`upload-zone relative overflow-hidden group/upload transition-all duration-300 ${
                      state.productContext ? 'upload-zone-active border-success' : ''
                    }`}
                    onClick={() => contextFileRef.current?.click()}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover/upload:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      {state.productContext ? (
                        <Check className="w-12 h-12 mx-auto mb-4 text-success" />
                      ) : (
                        <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground group-hover/upload:text-primary transition-colors" />
                      )}
                      <p className="text-lg font-semibold mb-2">
                        {state.productContext ? 'Context Loaded Successfully!' : 'Upload Context Document'}
                      </p>
                      <p className="text-sm text-muted-foreground mb-6">
                        Upload a .txt, .md, or .pdf file with your product/brand information
                      </p>
                      <Button variant={state.productContext ? "default" : "outline"} size="sm" className="shadow-md">
                        <Upload className="w-4 h-4 mr-2" />
                        {state.productContext ? 'Change File' : 'Choose File'}
                      </Button>
                    </div>
                  </div>
                  <input
                    ref={contextFileRef}
                    type="file"
                    accept=".txt,.md,.pdf"
                    onChange={handleContextFileUpload}
                    className="hidden"
                  />
                  {state.productContext && (
                    <div className="p-4 bg-success/10 border border-success/20 rounded-lg animate-slide-up">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-4 h-4 text-success" />
                        <p className="text-sm font-semibold text-success">Context loaded successfully:</p>
                      </div>
                      <p className="text-sm text-muted-foreground bg-background/50 p-2 rounded border">
                        {state.productContext.substring(0, 150)}...
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Platform Selection */}
            <Card className="step-card group hover:shadow-glow transition-all duration-300 border-primary/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  Target Platforms
                  <div className="ml-auto px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full">
                    {state.selectedPlatforms.length} SELECTED
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PLATFORMS.map((platform) => {
                    const isSelected = state.selectedPlatforms.includes(platform.id);
                    return (
                      <div
                        key={platform.id}
                        className={`relative overflow-hidden cursor-pointer transition-all duration-300 border-2 rounded-xl p-4 hover:scale-[1.02] hover:shadow-lg ${
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-glow'
                            : 'border-border/50 bg-card hover:border-primary/30 hover:bg-primary/5'
                        }`}
                        onClick={() => togglePlatform(platform.id)}
                      >
                        <div className="flex items-center space-x-3 relative z-10">
                          <Checkbox
                            checked={isSelected}
                            onChange={() => {}}
                            className="pointer-events-none"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xl">{platform.icon}</span>
                              <span className="font-semibold">{platform.name}</span>
                              {isSelected && (
                                <Check className="w-4 h-4 text-primary ml-auto" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {platform.description}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
                        )}
                      </div>
                    );
                  })}
                </div>
                {state.selectedPlatforms.length === 0 && (
                  <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-warning" />
                      <p className="text-sm text-warning font-medium">
                        Please select at least one platform to continue
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Core Idea Input */}
            <Card className="step-card group hover:shadow-glow transition-all duration-300 border-primary/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Wand2 className="w-5 h-5 text-primary" />
                  </div>
                  Core Idea
                  <span className="text-destructive text-lg">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label htmlFor="coreIdea" className="text-sm font-medium">
                    Describe your product, campaign, or content idea
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="coreIdea"
                      placeholder="Enter your raw thoughts, keywords, or basic draft for the post... 

Example: 'I am launching a productivity app that helps remote workers stay focused. It has features like time blocking, distraction blocking, and team collaboration tools. I want to target young professionals who work from home.'"
                      value={state.coreIdea}
                      onChange={(e) => setState(prev => ({ ...prev, coreIdea: e.target.value }))}
                      rows={8}
                      className="resize-none border-border/50 focus:border-primary/50 transition-colors text-sm leading-relaxed"
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                      {state.coreIdea.length} characters
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-primary">Pro tip:</span> Be as detailed or as brief as you like - our AI will help refine your ideas into compelling captions that resonate with your audience.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media Upload */}
            <Card className="step-card group hover:shadow-glow transition-all duration-300 border-primary/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Image className="w-5 h-5 text-primary" />
                  </div>
                  Media Context
                  <div className="ml-auto px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full">
                    OPTIONAL
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div
                    className={`upload-zone relative overflow-hidden group/upload transition-all duration-300 ${
                      state.mediaFiles.length > 0 ? 'upload-zone-active border-success' : ''
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover/upload:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        {state.mediaFiles.length > 0 ? (
                          <Check className="w-12 h-12 text-success" />
                        ) : (
                          <>
                            <div className="p-3 bg-primary/10 rounded-full">
                              <Image className="w-8 h-8 text-primary" />
                            </div>
                            <div className="p-3 bg-accent/10 rounded-full">
                              <Video className="w-8 h-8 text-accent" />
                            </div>
                          </>
                        )}
                      </div>
                      <p className="text-lg font-semibold mb-2">
                        {state.mediaFiles.length > 0 
                          ? `${state.mediaFiles.length} Files Uploaded!` 
                          : 'Upload Visual Context'
                        }
                      </p>
                      <p className="text-sm text-muted-foreground mb-6">
                        Add up to 5 images or 1 video to provide visual context (Max 10MB each)
                      </p>
                      <Button 
                        variant={state.mediaFiles.length > 0 ? "default" : "outline"} 
                        size="sm" 
                        className="shadow-md"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {state.mediaFiles.length > 0 ? 'Change Files' : 'Choose Files'}
                      </Button>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                  {state.mediaFiles.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-slide-up">
                      {state.mediaFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-secondary/50 border border-border/50 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-secondary/70 transition-colors">
                            <div className="p-2 bg-primary/10 rounded-lg mb-2">
                              {file.type.startsWith('image/') ? (
                                <Image className="w-6 h-6 text-primary" />
                              ) : (
                                <Video className="w-6 h-6 text-accent" />
                              )}
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-medium text-foreground/80 mb-1">
                                {file.type.startsWith('image/') ? 'Image' : 'Video'}
                              </p>
                              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)}MB</p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeMediaFile(index);
                            }}
                            className="absolute -top-2 -right-2 w-7 h-7 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg"
                          >
                            ×
                          </button>
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground truncate font-medium">
                              {file.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="text-center py-8">
              <div className="relative inline-block">
                <Button
                  onClick={generateRefinedPrompts}
                  disabled={!state.coreIdea.trim() || state.isLoading}
                  size="lg"
                  className="px-12 py-4 text-lg font-semibold bg-gradient-primary hover:opacity-90 border-0 shadow-glow relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {state.isLoading ? (
                    <>
                      <div className="loading-dots mr-3">
                        <span style={{ '--i': 0 } as React.CSSProperties}></span>
                        <span style={{ '--i': 1 } as React.CSSProperties}></span>
                        <span style={{ '--i': 2 } as React.CSSProperties}></span>
                      </div>
                      Generating Refined Prompts...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 mr-3" />
                      Generate Refined Prompts
                    </>
                  )}
                </Button>
                {!state.isLoading && (
                  <div className="absolute -inset-1 bg-gradient-primary rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity -z-10"></div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-4 max-w-md mx-auto">
                Click to start the AI refinement process. This will analyze your input and create optimized prompts.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Prompt Refinement */}
        {state.step === 'refinement' && (
          <div className="space-y-8 animate-fade-in">
            <Card className="step-card border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary"></div>
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  Select Your Refined Prompt
                  <div className="ml-auto px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full">
                    STEP 2 OF 4
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-8">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Our AI has refined your idea into three optimized prompts. Choose the one that best captures your vision:
                  </p>
                </div>
                <div className="space-y-6">
                  {state.refinedPrompts.map((prompt, index) => (
                    <Card
                      key={prompt.id}
                      className={`cursor-pointer transition-all duration-300 hover:scale-[1.01] border-2 relative overflow-hidden group ${
                        state.selectedPrompt === prompt.text
                          ? 'border-primary bg-primary/5 shadow-glow'
                          : 'border-border/50 hover:border-primary/30 hover:shadow-lg'
                      }`}
                      onClick={() => selectRefinedPrompt(prompt.id)}
                    >
                      {state.selectedPrompt === prompt.text && (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
                      )}
                      <CardContent className="p-6 relative z-10">
                        <div className="flex items-start space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg border-2 transition-colors ${
                            state.selectedPrompt === prompt.text
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-secondary border-border text-muted-foreground group-hover:border-primary/50'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-sm font-semibold text-primary">Refined Prompt {index + 1}</span>
                              {state.selectedPrompt === prompt.text && (
                                <Check className="w-4 h-4 text-primary animate-scale-in" />
                              )}
                            </div>
                            <p className="text-sm leading-relaxed text-foreground/90">{prompt.text}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {state.selectedPrompt && (
                  <div className="mt-8 text-center animate-slide-up">
                    <Button
                      onClick={() => setState(prev => ({ ...prev, step: 'generation' }))}
                      size="lg"
                      className="px-8 py-3 bg-gradient-primary hover:opacity-90 shadow-lg"
                    >
                      <Wand2 className="w-5 h-5 mr-2" />
                      Continue to Generation
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Generation */}
        {state.step === 'generation' && (
          <div className="space-y-8 animate-fade-in">
            <Card className="step-card border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary"></div>
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Wand2 className="w-6 h-6 text-primary" />
                  </div>
                  Ready to Generate Captions
                  <div className="ml-auto px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full">
                    STEP 3 OF 4
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <p className="text-sm font-semibold text-primary">Selected Prompt:</p>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed bg-background/50 p-3 rounded-lg border">
                          {state.selectedPrompt}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                          <Check className="w-4 h-4 text-accent" />
                          <p className="text-sm font-semibold text-accent">Target Platforms:</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {state.selectedPlatforms.map(platformId => {
                            const platform = PLATFORMS.find(p => p.id === platformId);
                            return (
                              <span
                                key={platformId}
                                className="px-3 py-1.5 bg-background/70 border border-border/50 text-foreground rounded-lg text-sm font-medium flex items-center gap-1.5"
                              >
                                <span>{platform?.icon}</span>
                                {platform?.name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center pt-6">
                    <div className="relative inline-block">
                      <Button
                        onClick={generateCaptions}
                        disabled={state.isLoading}
                        size="lg"
                        className="px-12 py-4 text-lg font-semibold bg-gradient-primary hover:opacity-90 border-0 shadow-glow relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        {state.isLoading ? (
                          <>
                            <div className="loading-dots mr-3">
                              <span style={{ '--i': 0 } as React.CSSProperties}></span>
                              <span style={{ '--i': 1 } as React.CSSProperties}></span>
                              <span style={{ '--i': 2 } as React.CSSProperties}></span>
                            </div>
                            Generating Captions...
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-6 h-6 mr-3" />
                            Generate Captions
                          </>
                        )}
                      </Button>
                      {!state.isLoading && (
                        <div className="absolute -inset-1 bg-gradient-primary rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity -z-10"></div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 max-w-md mx-auto">
                      This will generate 5 unique captions for each selected platform using your refined prompt.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Output */}
        {state.step === 'output' && (
          <div className="space-y-8 animate-fade-in">
            {/* Controls */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/20">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  Generated Captions
                </h2>
                <p className="text-muted-foreground">
                  Your AI-generated captions are ready! Copy individual captions or download all at once.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={regenerateCaptions}
                  disabled={state.isLoading}
                  variant="outline"
                  className="border-primary/30 hover:bg-primary/10"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${state.isLoading ? 'animate-spin' : ''}`} />
                  Regenerate
                </Button>
                <Button 
                  onClick={downloadCaptions} 
                  className="bg-gradient-primary hover:opacity-90 shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              </div>
            </div>

            {/* Caption Output */}
            <div className="space-y-8">
              {state.generatedCaptions.map((platformOutput, platformIndex) => (
                <Card key={platformOutput.platform} className="step-card border-primary/20 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent"></div>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <span className="text-2xl">
                          {PLATFORMS.find(p => p.name === platformOutput.platform)?.icon}
                        </span>
                      </div>
                      {platformOutput.platform} Captions
                      <div className="ml-auto px-3 py-1 bg-success/20 text-success text-xs font-semibold rounded-full">
                        {platformOutput.captions.length} CAPTIONS
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {platformOutput.captions.map((caption, index) => (
                        <div key={index} className="group/caption relative overflow-hidden border border-border/50 rounded-xl p-5 bg-gradient-to-br from-background to-secondary/20 hover:shadow-lg transition-all duration-300 hover:border-primary/30">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <span className="text-sm font-bold text-primary">{index + 1}</span>
                                </div>
                                <span className="text-sm font-semibold text-primary">
                                  Caption {index + 1}
                                </span>
                                <div className="flex-1 h-px bg-border/30"></div>
                              </div>
                              <p className="text-sm leading-relaxed text-foreground/90 font-medium">
                                {caption}
                              </p>
                            </div>
                            <Button
                              onClick={() => copyCaption(caption, `${platformOutput.platform}-${index}`)}
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover/caption:opacity-100 transition-all duration-200 hover:bg-primary/10 hover:scale-110"
                            >
                              {copiedCaption === `${platformOutput.platform}-${index}` ? (
                                <Check className="w-4 h-4 text-success" />
                              ) : (
                                <Copy className="w-4 h-4 text-primary" />
                              )}
                            </Button>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover/caption:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptionCraft;