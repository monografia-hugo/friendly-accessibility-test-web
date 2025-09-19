// Componente de navegação por teclado para teste com usuários com deficiência
import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';

const KeyboardNavigation = () => {
  const [currentFocus, setCurrentFocus] = useState<string>('');
  const [keyPressed, setKeyPressed] = useState<string>('');
  const [navigationLog, setNavigationLog] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');

  const modalRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  // Log de navegação
  const logNavigation = (action: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setNavigationLog(prev => [...prev.slice(-9), `${timestamp}: ${action}`]);
  };

  // Gerenciar foco
  const handleFocus = (elementId: string) => {
    setCurrentFocus(elementId);
    logNavigation(`Foco em: ${elementId}`);
  };

  // Gerenciar teclas pressionadas
  const handleKeyDown = (e: React.KeyboardEvent, elementId: string) => {
    setKeyPressed(e.key);
    logNavigation(`Tecla ${e.key} pressionada em: ${elementId}`);

    // Comportamentos específicos por tecla
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        logNavigation(`Ativação com ${e.key} em: ${elementId}`);
        break;
      case 'Escape':
        if (isModalOpen) {
          setIsModalOpen(false);
          logNavigation('Modal fechado com Escape');
        }
        if (isMenuOpen) {
          setIsMenuOpen(false);
          logNavigation('Menu fechado com Escape');
        }
        break;
      case 'ArrowDown':
        if (isMenuOpen) {
          e.preventDefault();
          logNavigation('Navegação para baixo no menu');
        }
        break;
      case 'ArrowUp':
        if (isMenuOpen) {
          e.preventDefault();
          logNavigation('Navegação para cima no menu');
        }
        break;
    }
  };

  // Gerenciar armadilha de foco no modal
  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => {
        document.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isModalOpen]);

  // Gerenciar foco no menu
  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      const menuItems = menuRef.current.querySelectorAll('[role="menuitem"]');
      let currentIndex = 0;

      const handleMenuKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            currentIndex = (currentIndex + 1) % menuItems.length;
            (menuItems[currentIndex] as HTMLElement).focus();
            break;
          case 'ArrowUp':
            e.preventDefault();
            currentIndex = currentIndex === 0 ? menuItems.length - 1 : currentIndex - 1;
            (menuItems[currentIndex] as HTMLElement).focus();
            break;
          case 'Home':
            e.preventDefault();
            currentIndex = 0;
            (menuItems[currentIndex] as HTMLElement).focus();
            break;
          case 'End':
            e.preventDefault();
            currentIndex = menuItems.length - 1;
            (menuItems[currentIndex] as HTMLElement).focus();
            break;
        }
      };

      document.addEventListener('keydown', handleMenuKeyDown);
      (menuItems[0] as HTMLElement)?.focus();

      return () => {
        document.removeEventListener('keydown', handleMenuKeyDown);
      };
    }
  }, [isMenuOpen]);

  const menuOptions = [
    { id: 'option1', label: 'Opção 1' },
    { id: 'option2', label: 'Opção 2' },
    { id: 'option3', label: 'Opção 3' },
    { id: 'option4', label: 'Opção 4' }
  ];

  return (
    <section className="stat-card p-6 rounded-lg mb-6" aria-labelledby="keyboard-navigation-heading">
      <h2 id="keyboard-navigation-heading" className="text-lg font-bold nav-text mb-6">
        Navegação por Teclado
      </h2>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-4">
          Esta seção demonstra navegação por teclado para usuários com deficiência.
          Use Tab para navegar, Enter/Espaço para ativar, e setas para menus.
        </p>
      </div>

      {/* Status de navegação */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <h3 className="text-base font-semibold nav-text mb-2">Status da Navegação</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Elemento com foco:</span>
            <span className="ml-2 text-primary">{currentFocus || 'Nenhum'}</span>
          </div>
          <div>
            <span className="font-medium">Última tecla:</span>
            <span className="ml-2 text-primary">{keyPressed || 'Nenhuma'}</span>
          </div>
        </div>
      </div>

      {/* Elementos de teste */}
      <div className="space-y-6">
        {/* Botões básicos */}
        <div>
          <h3 className="text-base font-semibold nav-text mb-3">Botões de Teste</h3>
          <div className="flex gap-3 flex-wrap">
            <button
              ref={firstButtonRef}
              className="px-4 py-2 bg-primary text-primary-foreground rounded accessible-focus"
              onFocus={() => handleFocus('botao-1')}
              onKeyDown={(e) => handleKeyDown(e, 'botao-1')}
              onClick={() => logNavigation('Botão 1 clicado')}
            >
              Botão 1
            </button>
            <button
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded accessible-focus"
              onFocus={() => handleFocus('botao-2')}
              onKeyDown={(e) => handleKeyDown(e, 'botao-2')}
              onClick={() => logNavigation('Botão 2 clicado')}
            >
              Botão 2
            </button>
            <button
              className="px-4 py-2 bg-accent text-accent-foreground rounded accessible-focus"
              onFocus={() => handleFocus('botao-3')}
              onKeyDown={(e) => handleKeyDown(e, 'botao-3')}
              onClick={() => logNavigation('Botão 3 clicado')}
            >
              Botão 3
            </button>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-base font-semibold nav-text mb-3">Links de Teste</h3>
          <div className="flex gap-3 flex-wrap">
            <a
              href="#"
              className="text-primary hover:underline accessible-focus"
              onFocus={() => handleFocus('link-1')}
              onKeyDown={(e) => handleKeyDown(e, 'link-1')}
              onClick={(e) => {
                e.preventDefault();
                logNavigation('Link 1 ativado');
              }}
            >
              Link 1
            </a>
            <a
              href="#"
              className="text-primary hover:underline accessible-focus"
              onFocus={() => handleFocus('link-2')}
              onKeyDown={(e) => handleKeyDown(e, 'link-2')}
              onClick={(e) => {
                e.preventDefault();
                logNavigation('Link 2 ativado');
              }}
            >
              Link 2
            </a>
          </div>
        </div>

        {/* Menu dropdown */}
        <div>
          <h3 className="text-base font-semibold nav-text mb-3">Menu Dropdown</h3>
          <div className="relative">
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded accessible-focus"
              onFocus={() => handleFocus('menu-trigger')}
              onKeyDown={(e) => handleKeyDown(e, 'menu-trigger')}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
            >
              Abrir Menu
            </button>
            {isMenuOpen && (
              <div
                ref={menuRef}
                role="menu"
                className="absolute top-full left-0 mt-1 bg-background border border-border rounded shadow-lg z-10"
                aria-label="Menu de opções"
              >
                {menuOptions.map((option) => (
                  <button
                    key={option.id}
                    role="menuitem"
                    className="w-full px-4 py-2 text-left hover:bg-muted accessible-focus"
                    onFocus={() => handleFocus(`menu-${option.id}`)}
                    onKeyDown={(e) => handleKeyDown(e, `menu-${option.id}`)}
                    onClick={() => {
                      setSelectedOption(option.label);
                      setIsMenuOpen(false);
                      logNavigation(`Opção selecionada: ${option.label}`);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedOption && (
            <p className="mt-2 text-sm text-muted-foreground">
              Opção selecionada: <span className="font-medium">{selectedOption}</span>
            </p>
          )}
        </div>

        {/* Modal */}
        <div>
          <h3 className="text-base font-semibold nav-text mb-3">Modal com Armadilha de Foco</h3>
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded accessible-focus"
            onFocus={() => handleFocus('modal-trigger')}
            onKeyDown={(e) => handleKeyDown(e, 'modal-trigger')}
            onClick={() => setIsModalOpen(true)}
          >
            Abrir Modal
          </button>
        </div>

        {/* Campos de entrada */}
        <div>
          <h3 className="text-base font-semibold nav-text mb-3">Campos de Entrada</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Campo de texto"
              className="w-full p-3 border border-border rounded accessible-focus"
              onFocus={() => handleFocus('input-texto')}
              onKeyDown={(e) => handleKeyDown(e, 'input-texto')}
            />
            <select
              className="w-full p-3 border border-border rounded accessible-focus"
              onFocus={() => handleFocus('select')}
              onKeyDown={(e) => handleKeyDown(e, 'select')}
            >
              <option value="">Selecione uma opção</option>
              <option value="1">Opção 1</option>
              <option value="2">Opção 2</option>
              <option value="3">Opção 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Log de navegação */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="text-base font-semibold nav-text mb-3">Log de Navegação</h3>
        <div className="max-h-40 overflow-y-auto">
          {navigationLog.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma ação registrada ainda</p>
          ) : (
            <ul className="space-y-1">
              {navigationLog.map((log, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {log}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Instruções de teclado */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-base font-semibold text-blue-900 mb-2">Instruções de Teclado</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p><strong>Tab:</strong> Navegar para o próximo elemento</p>
            <p><strong>Shift + Tab:</strong> Navegar para o elemento anterior</p>
            <p><strong>Enter/Espaço:</strong> Ativar elemento</p>
          </div>
          <div>
            <p><strong>Setas:</strong> Navegar em menus</p>
            <p><strong>Escape:</strong> Fechar modal/menu</p>
            <p><strong>Home/End:</strong> Primeiro/último item do menu</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            ref={modalRef}
            className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <h3 id="modal-title" className="text-lg font-semibold nav-text mb-4">
              Modal de Teste
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Este modal demonstra armadilha de foco. Use Tab para navegar entre os elementos.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded accessible-focus"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-primary text-primary-foreground rounded accessible-focus"
                onClick={() => setIsModalOpen(false)}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default KeyboardNavigation;
