// Accessible contact form with proper structure and WCAG compliance
import React, { useState } from 'react';
import { Shield, RefreshCw } from 'lucide-react';

const FormSection = () => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [securityCode, setSecurityCode] = useState('AB7K9');
  const [userSecurityInput, setUserSecurityInput] = useState('');

  const generateNewCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const newCode = Array.from({length: 5}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setSecurityCode(newCode);
    setUserSecurityInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const errors: Record<string, string> = {};

    // Validate required fields
    if (!formData.get('name')) errors.name = 'Nome é obrigatório';
    if (!formData.get('email')) errors.email = 'Email é obrigatório';
    if (!formData.get('department')) errors.department = 'Por favor selecione um departamento';
    if (!formData.get('priority')) errors.priority = 'Por favor selecione um nível de prioridade';
    if (!formData.get('message')) errors.message = 'Mensagem é obrigatória';
    if (userSecurityInput !== securityCode) errors.security = 'Código de segurança está incorreto';

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      alert('Formulário enviado com sucesso!');
    }
  };

  return (
    <section className="stat-card p-6 rounded-lg mb-6 mt-8">
      <h2 className="text-lg font-bold nav-text mb-4">Formulário de Contato</h2>

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        {/* Name field with proper label */}
        <div>
          <label
            htmlFor="contact-name"
            className="block text-sm font-medium nav-text mb-2"
          >
            Nome Completo <span className="text-danger-low" aria-label="obrigatório">*</span>
          </label>
          <input
            type="text"
            id="contact-name"
            name="name"
            className={`w-full p-3 bg-input border rounded-lg nav-text accessible-focus ${
              formErrors.name ? 'border-danger-low' : 'border-border'
            }`}
            required
            aria-describedby={formErrors.name ? 'name-error' : undefined}
            aria-invalid={!!formErrors.name}
          />
          {formErrors.name && (
            <p id="name-error" className="mt-1 text-sm text-danger-low" role="alert">
              {formErrors.name}
            </p>
          )}
        </div>

        {/* Email field with proper validation */}
        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium nav-text mb-2"
          >
            Endereço de Email <span className="text-danger-low" aria-label="obrigatório">*</span>
          </label>
          <input
            type="email"
            id="contact-email"
            name="email"
            className={`w-full p-3 bg-input border rounded-lg nav-text accessible-focus ${
              formErrors.email ? 'border-danger-low' : 'border-border'
            }`}
            required
            aria-describedby={formErrors.email ? 'email-error' : undefined}
            aria-invalid={!!formErrors.email}
          />
          {formErrors.email && (
            <p id="email-error" className="mt-1 text-sm text-danger-low" role="alert">
              {formErrors.email}
            </p>
          )}
        </div>

        {/* Department select with proper label */}
        <div>
          <label
            htmlFor="contact-department"
            className="block text-sm font-medium nav-text mb-2"
          >
            Departamento <span className="text-danger-low" aria-label="obrigatório">*</span>
          </label>
          <select
            id="contact-department"
            name="department"
            className={`w-full p-3 bg-input border rounded-lg nav-text accessible-focus ${
              formErrors.department ? 'border-danger-low' : 'border-border'
            }`}
            required
            aria-describedby={formErrors.department ? 'department-error' : undefined}
            aria-invalid={!!formErrors.department}
          >
            <option value="">Selecione um departamento</option>
            <option value="sales">Vendas</option>
            <option value="support">Suporte Técnico</option>
            <option value="billing">Faturamento e Contas</option>
          </select>
          {formErrors.department && (
            <p id="department-error" className="mt-1 text-sm text-danger-low" role="alert">
              {formErrors.department}
            </p>
          )}
        </div>

        {/* Radio buttons with proper fieldset/legend */}
        <fieldset>
          <legend className="block text-sm font-medium nav-text mb-3">
            Nível de Prioridade <span className="text-danger-low" aria-label="obrigatório">*</span>
          </legend>
          <div className="space-y-3">
            {[
              { value: 'low', label: 'Baixa - Consulta geral' },
              { value: 'medium', label: 'Média - Pergunta comercial' },
              { value: 'high', label: 'Alta - Problema urgente' }
            ].map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="priority"
                  value={option.value}
                  id={`priority-${option.value}`}
                  className="accessible-focus"
                />
                <label
                  htmlFor={`priority-${option.value}`}
                  className="ml-3 text-sm nav-text cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          {formErrors.priority && (
            <p className="mt-2 text-sm text-danger-low" role="alert">
              {formErrors.priority}
            </p>
          )}
        </fieldset>

        {/* Message textarea with proper label */}
        <div>
          <label
            htmlFor="contact-message"
            className="block text-sm font-medium nav-text mb-2"
          >
            Mensagem <span className="text-danger-low" aria-label="obrigatório">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            className={`w-full p-3 bg-input border rounded-lg nav-text accessible-focus resize-none ${
              formErrors.message ? 'border-danger-low' : 'border-border'
            }`}
            required
            aria-describedby={formErrors.message ? 'message-error' : 'message-hint'}
            aria-invalid={!!formErrors.message}
          />
          <p id="message-hint" className="mt-1 text-sm text-muted-foreground">
            Por favor descreva sua consulta em detalhes (mínimo 10 caracteres)
          </p>
          {formErrors.message && (
            <p id="message-error" className="mt-1 text-sm text-danger-low" role="alert">
              {formErrors.message}
            </p>
          )}
        </div>

        {/* Newsletter checkbox with proper label association */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="newsletter-subscription"
            name="newsletter"
            className="mt-1 accessible-focus"
          />
          <label
            htmlFor="newsletter-subscription"
            className="ml-3 text-sm nav-text cursor-pointer"
          >
            Inscrever-se em nossa newsletter para atualizações e ofertas especiais
          </label>
        </div>

        {/* File upload with proper instructions */}
        <div>
          <label
            htmlFor="contact-attachment"
            className="block text-sm font-medium nav-text mb-2"
          >
            Anexo (Opcional)
          </label>
          <input
            type="file"
            id="contact-attachment"
            name="attachment"
            className="w-full p-3 bg-input border border-border rounded-lg nav-text accessible-focus"
            accept=".pdf,.doc,.docx,.txt"
            aria-describedby="file-instructions"
          />
          <p id="file-instructions" className="mt-1 text-sm text-muted-foreground">
            Formatos aceitos: PDF, DOC, DOCX, TXT (máx 5MB)
          </p>
        </div>

        {/* Accessible security check */}
        <div className="p-4 border border-border rounded-lg bg-muted/50">
          <h3 className="text-sm font-medium nav-text mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4" aria-hidden="true" />
            Verificação de Segurança
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="px-4 py-2 bg-background border border-border rounded font-mono text-lg tracking-widest nav-text"
                aria-label={`Security code: ${securityCode.split('').join(' ')}`}
              >
                {securityCode}
              </div>
              <button
                type="button"
                onClick={generateNewCode}
                className="p-2 bg-secondary hover:bg-secondary/80 rounded accessible-focus transition-colors"
                aria-label="Gerar novo código de segurança"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div>
              <label
                htmlFor="security-code"
                className="block text-sm font-medium nav-text mb-2"
              >
                Digite o código acima <span className="text-danger-low" aria-label="obrigatório">*</span>
              </label>
              <input
                type="text"
                id="security-code"
                value={userSecurityInput}
                onChange={(e) => setUserSecurityInput(e.target.value.toUpperCase())}
                className={`w-full p-2 bg-input border rounded nav-text accessible-focus ${
                  formErrors.security ? 'border-danger-low' : 'border-border'
                }`}
                placeholder="Digite o código de segurança"
                required
                aria-describedby={formErrors.security ? 'security-error' : 'security-hint'}
                aria-invalid={!!formErrors.security}
              />
              <p id="security-hint" className="mt-1 text-sm text-muted-foreground">
                Isso nos ajuda a prevenir envios automatizados
              </p>
              {formErrors.security && (
                <p id="security-error" className="mt-1 text-sm text-danger-low" role="alert">
                  {formErrors.security}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit button with proper contrast */}
        <button
          type="submit"
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 accessible-focus transition-colors font-medium"
        >
          Enviar Solicitação
        </button>

        {/* General form status */}
        {Object.keys(formErrors).length > 0 && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg" role="alert">
            <p className="text-sm text-destructive font-medium">
              Por favor corrija os erros acima antes de enviar
            </p>
          </div>
        )}
      </form>
    </section>
  );
};

export default FormSection;