import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2, Eye, Lightbulb, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AIAccessibilityAssistant = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');
  const [question, setQuestion] = useState('');
  const { toast } = useToast();

  const getPageContent = () => {
    const mainContent = document.querySelector('main');
    if (!mainContent) return '';
    
    // Get a clean version of the HTML without scripts and styles
    const clone = mainContent.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('script, style').forEach(el => el.remove());
    
    return clone.innerHTML;
  };

  const analyzeAccessibility = async (action: 'analyze' | 'suggest') => {
    setIsAnalyzing(true);
    setAnalysis('');

    try {
      const htmlContent = getPageContent();
      
      if (!htmlContent) {
        throw new Error('No content found to analyze');
      }

      const { data, error } = await supabase.functions.invoke('accessibility-analyzer', {
        body: { htmlContent, action }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setAnalysis(data.result);
      
      toast({
        title: action === 'analyze' ? 'Análise concluída' : 'Sugestões prontas',
        description: 'A IA terminou de analisar sua página',
      });
    } catch (error) {
      console.error('Error analyzing accessibility:', error);
      toast({
        title: 'Análise falhou',
        description: error instanceof Error ? error.message : 'Falha ao analisar acessibilidade',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) {
      toast({
        title: 'Nenhuma pergunta',
        description: 'Por favor, insira uma pergunta sobre acessibilidade',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis('');

    try {
      const { data, error } = await supabase.functions.invoke('accessibility-analyzer', {
        body: { htmlContent: question, action: 'chat' }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setAnalysis(data.result);
    } catch (error) {
      console.error('Error asking question:', error);
      toast({
        title: 'Falha ao obter resposta',
        description: error instanceof Error ? error.message : 'Falha ao processar pergunta',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Assistente de Acessibilidade com IA
        </CardTitle>
        <CardDescription>
          Obtenha análise e recomendações de acessibilidade instantâneas com IA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="analyze" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analyze">
              <Eye className="h-4 w-4 mr-2" />
              Analisar
            </TabsTrigger>
            <TabsTrigger value="suggest">
              <Lightbulb className="h-4 w-4 mr-2" />
              Sugestões
            </TabsTrigger>
            <TabsTrigger value="chat">
              <MessageSquare className="h-4 w-4 mr-2" />
              Perguntar à IA
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                A IA analisará a página atual quanto à conformidade WCAG e problemas de acessibilidade.
              </p>
              <Button
                onClick={() => analyzeAccessibility('analyze')}
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Analisar Página Atual
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="suggest" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Obtenha sugestões com IA para melhorar a acessibilidade com exemplos de código.
              </p>
              <Button
                onClick={() => analyzeAccessibility('suggest')}
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Obter Sugestões
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <div className="space-y-4">
              <Textarea
                placeholder="Pergunte-me qualquer coisa sobre acessibilidade web, diretrizes WCAG ou melhores práticas..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[100px]"
                disabled={isAnalyzing}
              />
              <Button
                onClick={askQuestion}
                disabled={isAnalyzing || !question.trim()}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Pensando...
                  </>
                ) : (
                  <>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Fazer Pergunta
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {analysis && (
          <div className="mt-6 p-4 rounded-lg bg-muted">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Resultados da Análise da IA
            </h3>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <pre className="whitespace-pre-wrap text-sm">{analysis}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAccessibilityAssistant;
