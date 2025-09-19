// Componente de testes de contraste para validação com usuários com deficiência visual
import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const ContrastTests = () => {
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

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

  const handleTestResult = (testId: string, result: boolean) => {
    setTestResults(prev => ({ ...prev, [testId]: result }));
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

  const renderTestExamples = (test: any) => {
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
                className="px-3 py-1 bg-green-600 text-white text-sm rounded accessible-focus"
                onClick={() => handleTestResult(test.id, true)}
              >
                Passou
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white text-sm rounded accessible-focus"
                onClick={() => handleTestResult(test.id, false)}
              >
                Falhou
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Resultados dos testes */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="text-base font-semibold nav-text mb-2">Resultados dos Testes</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
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
    </section>
  );
};

export default ContrastTests;

