// Componente de testes de acessibilidade para validação com usuários reais
import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Eye, EyeOff, Volume2, VolumeX } from 'lucide-react';

const AccessibilityTests = () => {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [currentTest, setCurrentTest] = useState<string>('');

  const tests = [
    {
      id: 'keyboard-navigation',
      title: 'Navegação por Teclado',
      description: 'Teste se todos os elementos podem ser acessados usando apenas o teclado',
      instructions: 'Use Tab para navegar, Enter/Espaço para ativar elementos',
      testElements: [
        { id: 'test-button-1', label: 'Botão de Teste 1', type: 'button' },
        { id: 'test-link-1', label: 'Link de Teste 1', type: 'link' },
        { id: 'test-input-1', label: 'Campo de Entrada', type: 'input' },
        { id: 'test-checkbox-1', label: 'Checkbox de Teste', type: 'checkbox' }
      ]
    },
    {
      id: 'screen-reader',
      title: 'Compatibilidade com Screen Reader',
      description: 'Teste se o conteúdo é adequadamente lido por leitores de tela',
      instructions: 'Ative seu screen reader e navegue pelos elementos',
      testElements: [
        { id: 'heading-structure', label: 'Estrutura de Cabeçalhos', type: 'heading' },
        { id: 'aria-labels', label: 'Labels ARIA', type: 'aria' },
        { id: 'alt-text', label: 'Texto Alternativo', type: 'image' },
        { id: 'live-regions', label: 'Regiões Dinâmicas', type: 'live' }
      ]
    },
    {
      id: 'color-contrast',
      title: 'Contraste de Cores',
      description: 'Teste se as cores têm contraste adequado para leitura',
      instructions: 'Verifique se consegue ler todos os textos claramente',
      testElements: [
        { id: 'normal-text', label: 'Texto Normal', type: 'text' },
        { id: 'small-text', label: 'Texto Pequeno', type: 'text' },
        { id: 'link-text', label: 'Texto de Link', type: 'link' },
        { id: 'button-text', label: 'Texto de Botão', type: 'button' }
      ]
    },
    {
      id: 'focus-management',
      title: 'Gerenciamento de Foco',
      description: 'Teste se o foco é visível e gerenciado adequadamente',
      instructions: 'Observe se o foco é claramente visível ao navegar',
      testElements: [
        { id: 'focus-visible', label: 'Foco Visível', type: 'focus' },
        { id: 'focus-order', label: 'Ordem de Foco', type: 'order' },
        { id: 'focus-trap', label: 'Armadilha de Foco', type: 'trap' },
        { id: 'focus-return', label: 'Retorno de Foco', type: 'return' }
      ]
    }
  ];

  const handleTestResult = (testId: string, result: boolean) => {
    setTestResults(prev => ({ ...prev, [testId]: result }));
  };

  const renderTestElements = (test: any) => {
    switch (test.id) {
      case 'keyboard-navigation':
        return (
          <div className="space-y-4">
            <button
              id="test-button-1"
              className="px-4 py-2 bg-primary text-primary-foreground rounded accessible-focus"
              onClick={() => handleTestResult('test-button-1', true)}
            >
              Botão de Teste 1
            </button>
            <a
              id="test-link-1"
              href="#"
              className="text-primary hover:underline accessible-focus"
              onClick={(e) => {
                e.preventDefault();
                handleTestResult('test-link-1', true);
              }}
            >
              Link de Teste 1
            </a>
            <input
              id="test-input-1"
              type="text"
              placeholder="Digite algo aqui"
              className="w-full p-2 border border-border rounded accessible-focus"
              onChange={() => handleTestResult('test-input-1', true)}
            />
            <label className="flex items-center gap-2">
              <input
                id="test-checkbox-1"
                type="checkbox"
                className="accessible-focus"
                onChange={() => handleTestResult('test-checkbox-1', true)}
              />
              <span>Checkbox de Teste</span>
            </label>
          </div>
        );

      case 'screen-reader':
        return (
          <div className="space-y-4">
            <div>
              <h3 id="heading-structure" className="text-lg font-semibold">Estrutura de Cabeçalhos</h3>
              <p>Este é um parágrafo com estrutura semântica adequada.</p>
            </div>
            <button
              id="aria-labels"
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded accessible-focus"
              aria-label="Botão com label ARIA para screen readers"
            >
              Botão Acessível
            </button>
            <img
              id="alt-text"
              src="/placeholder.svg"
              alt="Imagem de exemplo com texto alternativo descritivo para screen readers"
              className="w-32 h-32 object-cover rounded"
            />
            <div
              id="live-regions"
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="p-2 bg-muted rounded"
            >
              Região dinâmica que será anunciada por screen readers
            </div>
          </div>
        );

      case 'color-contrast':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-background border border-border rounded">
              <p id="normal-text" className="text-base text-foreground">
                Texto normal com contraste adequado (4.5:1+)
              </p>
            </div>
            <div className="p-4 bg-background border border-border rounded">
              <p id="small-text" className="text-sm text-foreground">
                Texto pequeno com contraste adequado (4.5:1+)
              </p>
            </div>
            <div className="p-4 bg-background border border-border rounded">
              <a
                id="link-text"
                href="#"
                className="text-primary hover:underline"
                onClick={(e) => e.preventDefault()}
              >
                Link com contraste adequado (4.5:1+)
              </a>
            </div>
            <div className="p-4 bg-background border border-border rounded">
              <button
                id="button-text"
                className="px-4 py-2 bg-primary text-primary-foreground rounded"
              >
                Botão com contraste adequado (7:1+)
              </button>
            </div>
          </div>
        );

      case 'focus-management':
        return (
          <div className="space-y-4">
            <div className="p-4 border border-border rounded">
              <h4 id="focus-visible" className="text-base font-medium mb-2">
                Foco Visível
              </h4>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded accessible-focus">
                Botão com foco visível
              </button>
            </div>
            <div className="p-4 border border-border rounded">
              <h4 id="focus-order" className="text-base font-medium mb-2">
                Ordem de Foco
              </h4>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded accessible-focus">
                  Primeiro
                </button>
                <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded accessible-focus">
                  Segundo
                </button>
                <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded accessible-focus">
                  Terceiro
                </button>
              </div>
            </div>
            <div className="p-4 border border-border rounded">
              <h4 id="focus-trap" className="text-base font-medium mb-2">
                Armadilha de Foco
              </h4>
              <button className="px-4 py-2 bg-accent text-accent-foreground rounded accessible-focus">
                Botão com armadilha de foco
              </button>
            </div>
            <div className="p-4 border border-border rounded">
              <h4 id="focus-return" className="text-base font-medium mb-2">
                Retorno de Foco
              </h4>
              <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded accessible-focus">
                Botão com retorno de foco
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="stat-card p-6 rounded-lg mb-6" aria-labelledby="accessibility-tests-heading">
      <h2 id="accessibility-tests-heading" className="text-lg font-bold nav-text mb-6">
        Testes de Acessibilidade
      </h2>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-4">
          Esta seção contém testes específicos para validar a acessibilidade com usuários reais.
          Cada teste simula diferentes cenários de uso e deficiências.
        </p>
      </div>

      <div className="space-y-6">
        {tests.map((test) => (
          <div key={test.id} className="border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold nav-text mb-2">{test.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{test.description}</p>
                <p className="text-sm font-medium text-primary">{test.instructions}</p>
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
              {renderTestElements(test)}
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
    </section>
  );
};

export default AccessibilityTests;
