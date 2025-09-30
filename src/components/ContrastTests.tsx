// Componente de testes de contraste para validação com usuários com deficiência visual
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ContrastResult {
  id: string;
  created_at: string;
  test_type: string;
  color1: string;
  color2: string | null;
  contrast_ratio: number;
  wcag_level: string;
  passes_aa: boolean;
  passes_aaa: boolean;
}

const ContrastTests = () => {
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [allResults, setAllResults] = useState<ContrastResult[]>([]);
  const { toast } = useToast();

  const contrastTests = [
    {
      id: 'normal-text',
      title: 'Texto Normal',
      description: 'Teste de contraste para texto normal (mínimo 4.5:1)',
      examples: [
        { text: 'Texto com contraste adequado', contrast: '4.5:1', status: 'pass' },
        { text: 'Texto com contraste insuficiente', contrast: '2.1:1', status: 'fail' },
        { text: 'Texto com contraste excelente', contrast: '7.1:1', status: 'pass' }
      ]
    },
    {
      id: 'large-text',
      title: 'Texto Grande',
      description: 'Teste de contraste para texto grande (mínimo 3:1)',
      examples: [
        { text: 'Texto grande com contraste adequado', contrast: '3.1:1', status: 'pass' },
        { text: 'Texto grande com contraste insuficiente', contrast: '2.5:1', status: 'fail' },
        { text: 'Texto grande com contraste excelente', contrast: '6.8:1', status: 'pass' }
      ]
    },
    {
      id: 'ui-elements',
      title: 'Elementos de Interface',
      description: 'Teste de contraste para botões, links e elementos interativos',
      examples: [
        { text: 'Botão com contraste adequado', contrast: '4.5:1', status: 'pass' },
        { text: 'Link com contraste insuficiente', contrast: '2.8:1', status: 'fail' },
        { text: 'Elemento com contraste excelente', contrast: '8.2:1', status: 'pass' }
      ]
    },
    {
      id: 'color-blindness',
      title: 'Daltonismo',
      description: 'Teste de acessibilidade para usuários com daltonismo',
      examples: [
        { text: 'Informação por cor apenas', contrast: 'N/A', status: 'fail' },
        { text: 'Informação por cor + ícone', contrast: 'N/A', status: 'pass' },
        { text: 'Informação por cor + texto', contrast: 'N/A', status: 'pass' }
      ]
    }
  ];

  // Load initial results and subscribe to real-time updates
  useEffect(() => {
    loadResults();
    
    const channel = supabase
      .channel('contrast_results_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contrast_results'
        },
        (payload) => {
          setAllResults(prev => [payload.new as ContrastResult, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadResults = async () => {
    const { data, error } = await supabase
      .from('contrast_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error loading results:', error);
    } else if (data) {
      setAllResults(data);
    }
  };

  const handleTestResult = async (testId: string, result: boolean) => {
    setTestResults(prev => ({ ...prev, [testId]: result }));
    
    // Find the test to get details
    const test = contrastTests.find(t => t.id === testId);
    if (!test) return;

    // Calculate average contrast ratio from examples
    const avgContrast = test.examples
      .filter(ex => ex.contrast !== 'N/A')
      .reduce((sum, ex) => sum + parseFloat(ex.contrast.split(':')[0]), 0) / 
      test.examples.filter(ex => ex.contrast !== 'N/A').length || 0;

    // Determine WCAG level
    let wcagLevel = 'Fail';
    let passesAA = false;
    let passesAAA = false;

    if (result) {
      if (test.id === 'normal-text') {
        passesAA = avgContrast >= 4.5;
        passesAAA = avgContrast >= 7;
      } else if (test.id === 'large-text') {
        passesAA = avgContrast >= 3;
        passesAAA = avgContrast >= 4.5;
      } else if (test.id === 'ui-elements') {
        passesAA = avgContrast >= 3;
        passesAAA = avgContrast >= 4.5;
      } else {
        passesAA = result;
        passesAAA = result;
      }

      if (passesAAA) wcagLevel = 'AAA';
      else if (passesAA) wcagLevel = 'AA';
    }

    // Save to database
    const { error } = await supabase
      .from('contrast_results')
      .insert({
        test_type: test.title,
        color1: testId,
        color2: null,
        contrast_ratio: avgContrast || 0,
        wcag_level: wcagLevel,
        passes_aa: passesAA,
        passes_aaa: passesAAA
      });

    if (error) {
      console.error('Error saving result:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar o resultado',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Resultado salvo',
        description: 'O resultado do teste foi salvo com sucesso'
      });
    }
  };

  const getResultsText = () => {
    const resultsSummary = contrastTests.map(test => {
      const result = testResults[test.id];
      const status = result === true ? 'Passou' : result === false ? 'Falhou' : 'Não testado';
      return `${test.title}: ${status}`;
    }).join('\n');

    const totalPassed = Object.values(testResults).filter(r => r === true).length;
    const totalFailed = Object.values(testResults).filter(r => r === false).length;
    const totalTests = contrastTests.length;
    const totalCompleted = totalPassed + totalFailed;

    return `Resultados dos Testes de Contraste - ${new Date().toLocaleString()}

Resumo:
- Total de testes: ${totalTests}
- Testes completados: ${totalCompleted}
- Testes que passaram: ${totalPassed}
- Testes que falharam: ${totalFailed}

Detalhes por teste:
${resultsSummary}

---
Enviado automaticamente pelo sistema de testes de contraste.`;
  };

  const sendResultsByEmail = () => {
    const emailBody = getResultsText();
    const emailSubject = `Resultados dos Testes de Contraste - ${new Date().toLocaleDateString()}`;
    const emailUrl = `mailto:hugorc10@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    window.open(emailUrl);
  };

  const copyResultsToClipboard = async () => {
    try {
      const resultsText = getResultsText();
      await navigator.clipboard.writeText(resultsText);
      alert('Resultados copiados para a área de transferência! Cole no seu email ou documento.');
    } catch (err) {
      console.error('Erro ao copiar para área de transferência:', err);
      alert('Erro ao copiar. Tente novamente.');
    }
  };

  const downloadResults = () => {
    const resultsText = getResultsText();
    const blob = new Blob([resultsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resultados-testes-contraste-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" aria-label="Passou" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" aria-label="Falhou" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" aria-label="Atenção" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pass':
        return 'text-green-800 bg-green-50 border-green-200';
      case 'fail':
        return 'text-red-800 bg-red-50 border-red-200';
      default:
        return 'text-yellow-800 bg-yellow-50 border-yellow-200';
    }
  };

  const renderTestExamples = (test: { id: string; title: string; description: string; examples: Array<{ text: string; contrast: string; status: string }> }) => {
    switch (test.id) {
      case 'normal-text':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-white border border-gray-300 rounded">
              <p className="text-base text-gray-900">
                Texto com contraste adequado (4.5:1)
              </p>
            </div>
            <div className="p-4 bg-white border border-gray-300 rounded">
              <p className="text-base text-gray-400">
                Texto com contraste insuficiente (2.1:1)
              </p>
            </div>
            <div className="p-4 bg-white border border-gray-300 rounded">
              <p className="text-base text-black">
                Texto com contraste excelente (7.1:1)
              </p>
            </div>
          </div>
        );

      case 'large-text':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-white border border-gray-300 rounded">
              <p className="text-xl text-gray-700">
                Texto grande com contraste adequado (3.1:1)
              </p>
            </div>
            <div className="p-4 bg-white border border-gray-300 rounded">
              <p className="text-xl text-gray-400">
                Texto grande com contraste insuficiente (2.5:1)
              </p>
            </div>
            <div className="p-4 bg-white border border-gray-300 rounded">
              <p className="text-xl text-black">
                Texto grande com contraste excelente (6.8:1)
              </p>
            </div>
          </div>
        );

      case 'ui-elements':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-white border border-gray-300 rounded">
              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                Botão com contraste adequado (4.5:1)
              </button>
            </div>
            <div className="p-4 bg-white border border-gray-300 rounded">
              <a href="#" className="text-blue-300 hover:underline">
                Link com contraste insuficiente (2.8:1)
              </a>
            </div>
            <div className="p-4 bg-white border border-gray-300 rounded">
              <button className="px-4 py-2 bg-blue-900 text-white rounded">
                Elemento com contraste excelente (8.2:1)
              </button>
            </div>
          </div>
        );

      case 'color-blindness':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-white border border-gray-300 rounded">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600">
                  Apenas cor vermelha (inacessível para daltônicos)
                </span>
              </div>
            </div>
            <div className="p-4 bg-white border border-gray-300 rounded">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600">●</span>
                <span className="text-sm text-gray-600">
                  Cor vermelha + ícone (acessível)
                </span>
              </div>
            </div>
            <div className="p-4 bg-white border border-gray-300 rounded">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600">
                  Cor vermelha + texto "Erro" (acessível)
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="stat-card p-6 rounded-lg mb-6" aria-labelledby="contrast-tests-heading">
      <h2 id="contrast-tests-heading" className="text-lg font-bold nav-text mb-6">
        Testes de Contraste
      </h2>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-4">
          Esta seção demonstra diferentes níveis de contraste para teste com usuários
          com deficiência visual. Avalie a legibilidade de cada exemplo.
        </p>
      </div>

      <div className="space-y-6">
        {contrastTests.map((test) => (
          <div key={test.id} className="border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold nav-text mb-2">{test.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{test.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {testResults[test.id] === true && (
                  <CheckCircle className="h-5 w-5 text-green-600" aria-label="Teste passou" />
                )}
                {testResults[test.id] === false && (
                  <XCircle className="h-5 w-5 text-red-600" aria-label="Teste falhou" />
                )}
                {testResults[test.id] === undefined && (
                  <AlertTriangle className="h-5 w-5 text-yellow-600" aria-label="Teste pendente" />
                )}
              </div>
            </div>

            <div className="mb-4">
              {renderTestExamples(test)}
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium nav-text mb-2">Exemplos de Teste:</h4>
              <div className="space-y-2">
                {test.examples.map((example, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded border ${getStatusClass(example.status)}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{example.text}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono">{example.contrast}</span>
                        {getStatusIcon(example.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className={`px-3 py-1 text-white text-sm rounded accessible-focus border-2 ${
                  testResults[test.id] === true
                    ? 'bg-green-800 text-gray-600 border-green-900 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 border-transparent'
                }`}
                onClick={() => testResults[test.id] === true ? null : handleTestResult(test.id, true)}
                disabled={testResults[test.id] === true}
              >
                Passou
              </button>
              <button
                className={`px-3 py-1 text-white text-sm rounded accessible-focus border-2 ${
                  testResults[test.id] === false
                    ? 'bg-red-800 text-gray-600 border-red-900 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 border-transparent'
                }`}
                onClick={() => testResults[test.id] === false ? null : handleTestResult(test.id, false)}
                disabled={testResults[test.id] === false}
              >
                Falhou
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Resultados dos testes */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="text-base font-semibold nav-text mb-4">Resultados dos Testes</h3>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <span className="font-medium">Testes Passaram:</span>
            <span className="ml-2 text-green-600">
              {Object.values(testResults).filter(r => r === true).length}
            </span>
          </div>
          <div>
            <span className="font-medium">Testes Falharam:</span>
            <span className="ml-2 text-red-600">
              {Object.values(testResults).filter(r => r === false).length}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={copyResultsToClipboard}
            className="px-3 py-2 bg-green-600 text-white text-sm rounded accessible-focus hover:bg-green-700 border-2 border-transparent hover:border-green-800 transition-colors"
          >
            📋 Copiar Resultados
          </button>
          <button
            onClick={downloadResults}
            className="px-3 py-2 bg-purple-600 text-white text-sm rounded accessible-focus hover:bg-purple-700 border-2 border-transparent hover:border-purple-800 transition-colors"
          >
            💾 Baixar Arquivo
          </button>
          <button
            onClick={sendResultsByEmail}
            className="px-3 py-2 bg-blue-600 text-white text-sm rounded accessible-focus hover:bg-blue-700 border-2 border-transparent hover:border-blue-800 transition-colors"
          >
            📧 Enviar por Email
          </button>
        </div>
      </div>

      {/* Instruções de contraste */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-base font-semibold text-blue-900 mb-2">
          Critérios de Contraste WCAG
        </h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>WCAG AA:</strong> Texto normal 4.5:1, texto grande 3:1</p>
          <p><strong>WCAG AAA:</strong> Texto normal 7:1, texto grande 4.5:1</p>
          <p><strong>Elementos UI:</strong> Mínimo 3:1 para elementos interativos</p>
          <p><strong>Daltonismo:</strong> Não dependa apenas da cor para transmitir informação</p>
        </div>
      </div>

      {/* Feed de resultados em tempo real */}
      <div className="mt-8 p-6 bg-muted rounded-lg">
        <h3 className="text-lg font-semibold nav-text mb-4">
          📊 Resultados em Tempo Real
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Veja todos os testes de contraste realizados por usuários em tempo real
        </p>
        
        {allResults.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum teste realizado ainda. Seja o primeiro!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {allResults.map((result) => (
              <div
                key={result.id}
                className={`p-4 rounded-lg border-2 ${
                  result.wcag_level === 'AAA'
                    ? 'bg-green-50 border-green-300'
                    : result.wcag_level === 'AA'
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-red-50 border-red-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm">{result.test_type}</h4>
                      <span
                        className={`px-2 py-1 text-xs font-bold rounded ${
                          result.wcag_level === 'AAA'
                            ? 'bg-green-600 text-white'
                            : result.wcag_level === 'AA'
                            ? 'bg-blue-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {result.wcag_level}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>
                        Contraste: {result.contrast_ratio.toFixed(1)}:1
                      </p>
                      <p>
                        {result.passes_aa && '✓ WCAG AA '}
                        {result.passes_aaa && '✓ WCAG AAA'}
                        {!result.passes_aa && !result.passes_aaa && '✗ Não passou'}
                      </p>
                      <p className="text-xs opacity-70">
                        {new Date(result.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  {result.wcag_level === 'AAA' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  ) : result.wcag_level === 'AA' ? (
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ContrastTests;

