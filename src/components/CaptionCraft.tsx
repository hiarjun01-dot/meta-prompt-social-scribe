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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-primary">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <Wand2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">CaptionCraft</h1>
            </div>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              AI-powered social media caption generator with intelligent meta-prompting workflow
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {['Input', 'Refinement', 'Generation', 'Output'].map((step, index) => (
              <div
                key={step}
                className={`flex items-center gap-2 ${
                  ['input', 'refinement', 'generation', 'output'].indexOf(state.step) >= index
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    ['input', 'refinement', 'generation', 'output'].indexOf(state.step) >= index
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="font-medium">{step}</span>
              </div>
            ))}
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((['input', 'refinement', 'generation', 'output'].indexOf(state.step) + 1) / 4) * 100}%`
              }}
            />
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
          <div className="space-y-6 animate-fade-in">
            {/* API Key Input */}
            <Card className="step-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  LLM API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key (OpenAI, Anthropic, or Google)</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="sk-..."
                    value={state.apiKey}
                    onChange={(e) => setState(prev => ({ ...prev, apiKey: e.target.value }))}
                    className="font-mono"
                  />
                  <p className="text-sm text-muted-foreground">
                    Your API key is used securely and never stored permanently
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Product Context Upload */}
            <Card className="step-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Product/Brand Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className="upload-zone"
                    onClick={() => contextFileRef.current?.click()}
                  >
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">Upload Context Document</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a .txt, .md, or .pdf file with your product/brand information
                    </p>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                  <input
                    ref={contextFileRef}
                    type="file"
                    accept=".txt,.md,.pdf"
                    onChange={handleContextFileUpload}
                    className="hidden"
                  />
                  {state.productContext && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">Context loaded:</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {state.productContext.substring(0, 100)}...
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Platform Selection */}
            <Card className="step-card">
              <CardHeader>
                <CardTitle>Target Platforms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PLATFORMS.map((platform) => (
                    <div
                      key={platform.id}
                      className={`platform-card ${
                        state.selectedPlatforms.includes(platform.id)
                          ? 'platform-card-selected'
                          : ''
                      }`}
                      onClick={() => togglePlatform(platform.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={state.selectedPlatforms.includes(platform.id)}
                          onChange={() => {}}
                          className="pointer-events-none"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{platform.icon}</span>
                            <span className="font-medium">{platform.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {platform.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Core Idea Input */}
            <Card className="step-card">
              <CardHeader>
                <CardTitle>Core Idea</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="coreIdea">
                    Describe your product, campaign, or content idea
                  </Label>
                  <Textarea
                    id="coreIdea"
                    placeholder="Enter your raw thoughts, keywords, or basic draft for the post..."
                    value={state.coreIdea}
                    onChange={(e) => setState(prev => ({ ...prev, coreIdea: e.target.value }))}
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    Be as detailed or as brief as you like - our AI will help refine your ideas
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Media Upload */}
            <Card className="step-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Media Context (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className="upload-zone"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Image className="w-8 h-8 text-muted-foreground" />
                      <Video className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium mb-2">Upload Visual Context</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add up to 5 images or 1 video to provide visual context (Max 10MB each)
                    </p>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Files
                    </Button>
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
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {state.mediaFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                            {file.type.startsWith('image/') ? (
                              <Image className="w-8 h-8 text-muted-foreground" />
                            ) : (
                              <Video className="w-8 h-8 text-muted-foreground" />
                            )}
                          </div>
                          <button
                            onClick={() => removeMediaFile(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {file.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="text-center">
              <Button
                onClick={generateRefinedPrompts}
                disabled={!state.coreIdea.trim() || state.isLoading}
                size="lg"
                className="px-8 py-3 text-lg font-medium glow-primary"
              >
                {state.isLoading ? (
                  <>
                    <div className="loading-dots mr-2">
                      <span style={{ '--i': 0 } as React.CSSProperties}></span>
                      <span style={{ '--i': 1 } as React.CSSProperties}></span>
                      <span style={{ '--i': 2 } as React.CSSProperties}></span>
                    </div>
                    Generating Refined Prompts...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Refined Prompts
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Prompt Refinement */}
        {state.step === 'refinement' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="step-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Select Your Refined Prompt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Our AI has refined your idea into three optimized prompts. Choose the one that best captures your vision:
                </p>
                <div className="space-y-4">
                  {state.refinedPrompts.map((prompt) => (
                    <Card
                      key={prompt.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-medium ${
                        state.selectedPrompt === prompt.text
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => selectRefinedPrompt(prompt.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0 mt-1">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                          </div>
                          <p className="text-sm leading-relaxed">{prompt.text}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Generation */}
        {state.step === 'generation' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="step-card">
              <CardHeader>
                <CardTitle>Ready to Generate Captions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-2">Selected Prompt:</p>
                    <p className="text-sm text-muted-foreground">{state.selectedPrompt}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-2">Target Platforms:</p>
                    <div className="flex flex-wrap gap-2">
                      {state.selectedPlatforms.map(platformId => {
                        const platform = PLATFORMS.find(p => p.id === platformId);
                        return (
                          <span
                            key={platformId}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {platform?.icon} {platform?.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="text-center pt-4">
                    <Button
                      onClick={generateCaptions}
                      disabled={state.isLoading}
                      size="lg"
                      className="px-8 py-3 text-lg font-medium glow-primary"
                    >
                      {state.isLoading ? (
                        <>
                          <div className="loading-dots mr-2">
                            <span style={{ '--i': 0 } as React.CSSProperties}></span>
                            <span style={{ '--i': 1 } as React.CSSProperties}></span>
                            <span style={{ '--i': 2 } as React.CSSProperties}></span>
                          </div>
                          Generating Captions...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5 mr-2" />
                          Generate Captions
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Output */}
        {state.step === 'output' && (
          <div className="space-y-6 animate-fade-in">
            {/* Controls */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Generated Captions</h2>
              <div className="flex gap-3">
                <Button
                  onClick={regenerateCaptions}
                  disabled={state.isLoading}
                  variant="outline"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${state.isLoading ? 'animate-spin' : ''}`} />
                  Regenerate
                </Button>
                <Button onClick={downloadCaptions} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              </div>
            </div>

            {/* Caption Output */}
            <div className="space-y-6">
              {state.generatedCaptions.map((platformOutput) => (
                <Card key={platformOutput.platform} className="step-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-lg">
                        {PLATFORMS.find(p => p.name === platformOutput.platform)?.icon}
                      </span>
                      {platformOutput.platform} Captions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {platformOutput.captions.map((caption, index) => (
                        <div key={index} className="caption-card group">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-primary">
                                  Caption {index + 1}
                                </span>
                              </div>
                              <p className="text-sm leading-relaxed">{caption}</p>
                            </div>
                            <Button
                              onClick={() => copyCaption(caption, `${platformOutput.platform}-${index}`)}
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {copiedCaption === `${platformOutput.platform}-${index}` ? (
                                <Check className="w-4 h-4 text-success" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
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