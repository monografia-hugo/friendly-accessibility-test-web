// Componente de formulários acessíveis para teste com usuários com deficiência
import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const AccessibleForms = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    message: '',
    newsletter: false,
    terms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro quando usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email deve ter um formato válido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Mensagem deve ter pelo menos 10 caracteres';
    }

    if (!formData.terms) {
      newErrors.terms = 'Você deve aceitar os termos de uso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    if (validateForm()) {
      try {
        // Simular envio
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          birthDate: '',
          address: '',
          message: '',
          newsletter: false,
          terms: false
        });
      } catch (error) {
        setSubmitStatus('error');
      }
    } else {
      setSubmitStatus('error');
    }
    setIsSubmitting(false);
  };

  return (
    <section className="stat-card p-6 rounded-lg mb-6" aria-labelledby="accessible-forms-heading">
      <h2 id="accessible-forms-heading" className="text-lg font-bold nav-text mb-6">
        Formulários Acessíveis
      </h2>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-4">
          Este formulário demonstra práticas de acessibilidade para usuários com deficiência,
          incluindo validação em tempo real, feedback claro e navegação por teclado.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Nome */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium nav-text mb-2">
            <User className="inline h-4 w-4 mr-2" aria-hidden="true" />
            Nome Completo <span className="text-red-600" aria-label="obrigatório">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full p-3 border rounded-lg accessible-focus ${
              errors.name ? 'border-red-600' : 'border-border'
            }`}
            aria-describedby={errors.name ? 'name-error' : 'name-hint'}
            aria-invalid={!!errors.name}
            required
          />
          {errors.name ? (
            <p id="name-error" className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              {errors.name}
            </p>
          ) : (
            <p id="name-hint" className="mt-1 text-sm text-muted-foreground">
              Digite seu nome completo
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium nav-text mb-2">
            <Mail className="inline h-4 w-4 mr-2" aria-hidden="true" />
            Endereço de Email <span className="text-red-600" aria-label="obrigatório">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full p-3 border rounded-lg accessible-focus ${
              errors.email ? 'border-red-600' : 'border-border'
            }`}
            aria-describedby={errors.email ? 'email-error' : 'email-hint'}
            aria-invalid={!!errors.email}
            required
          />
          {errors.email ? (
            <p id="email-error" className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              {errors.email}
            </p>
          ) : (
            <p id="email-hint" className="mt-1 text-sm text-muted-foreground">
              Digite um endereço de email válido
            </p>
          )}
        </div>

        {/* Telefone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium nav-text mb-2">
            <Phone className="inline h-4 w-4 mr-2" aria-hidden="true" />
            Telefone <span className="text-red-600" aria-label="obrigatório">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full p-3 border rounded-lg accessible-focus ${
              errors.phone ? 'border-red-600' : 'border-border'
            }`}
            aria-describedby={errors.phone ? 'phone-error' : 'phone-hint'}
            aria-invalid={!!errors.phone}
            required
          />
          {errors.phone ? (
            <p id="phone-error" className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              {errors.phone}
            </p>
          ) : (
            <p id="phone-hint" className="mt-1 text-sm text-muted-foreground">
              Digite seu número de telefone
            </p>
          )}
        </div>

        {/* Data de Nascimento */}
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium nav-text mb-2">
            <Calendar className="inline h-4 w-4 mr-2" aria-hidden="true" />
            Data de Nascimento <span className="text-red-600" aria-label="obrigatório">*</span>
          </label>
          <input
            type="date"
            id="birthDate"
            value={formData.birthDate}
            onChange={(e) => handleInputChange('birthDate', e.target.value)}
            className={`w-full p-3 border rounded-lg accessible-focus ${
              errors.birthDate ? 'border-red-600' : 'border-border'
            }`}
            aria-describedby={errors.birthDate ? 'birthDate-error' : 'birthDate-hint'}
            aria-invalid={!!errors.birthDate}
            required
          />
          {errors.birthDate ? (
            <p id="birthDate-error" className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              {errors.birthDate}
            </p>
          ) : (
            <p id="birthDate-hint" className="mt-1 text-sm text-muted-foreground">
              Selecione sua data de nascimento
            </p>
          )}
        </div>

        {/* Endereço */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium nav-text mb-2">
            <MapPin className="inline h-4 w-4 mr-2" aria-hidden="true" />
            Endereço <span className="text-red-600" aria-label="obrigatório">*</span>
          </label>
          <textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            rows={3}
            className={`w-full p-3 border rounded-lg accessible-focus resize-none ${
              errors.address ? 'border-red-600' : 'border-border'
            }`}
            aria-describedby={errors.address ? 'address-error' : 'address-hint'}
            aria-invalid={!!errors.address}
            required
          />
          {errors.address ? (
            <p id="address-error" className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              {errors.address}
            </p>
          ) : (
            <p id="address-hint" className="mt-1 text-sm text-muted-foreground">
              Digite seu endereço completo
            </p>
          )}
        </div>

        {/* Mensagem */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium nav-text mb-2">
            <FileText className="inline h-4 w-4 mr-2" aria-hidden="true" />
            Mensagem <span className="text-red-600" aria-label="obrigatório">*</span>
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            rows={4}
            className={`w-full p-3 border rounded-lg accessible-focus resize-none ${
              errors.message ? 'border-red-600' : 'border-border'
            }`}
            aria-describedby={errors.message ? 'message-error' : 'message-hint'}
            aria-invalid={!!errors.message}
            required
          />
          {errors.message ? (
            <p id="message-error" className="mt-1 text-sm text-red-600 flex items-center gap-1" role="alert">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              {errors.message}
            </p>
          ) : (
            <p id="message-hint" className="mt-1 text-sm text-muted-foreground">
              Digite sua mensagem (mínimo 10 caracteres)
            </p>
          )}
        </div>

        {/* Checkboxes */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="newsletter"
              checked={formData.newsletter}
              onChange={(e) => handleInputChange('newsletter', e.target.checked)}
              className="mt-1 accessible-focus"
            />
            <label htmlFor="newsletter" className="text-sm nav-text cursor-pointer">
              Desejo receber newsletters e atualizações por email
            </label>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={formData.terms}
              onChange={(e) => handleInputChange('terms', e.target.checked)}
              className={`mt-1 accessible-focus ${errors.terms ? 'border-red-600' : ''}`}
              aria-describedby={errors.terms ? 'terms-error' : 'terms-hint'}
              aria-invalid={!!errors.terms}
              required
            />
            <label htmlFor="terms" className="text-sm nav-text cursor-pointer">
              Aceito os <a href="#" className="text-primary hover:underline">termos de uso</a> e
              <a href="#" className="text-primary hover:underline"> política de privacidade</a>
              <span className="text-red-600" aria-label="obrigatório"> *</span>
            </label>
          </div>
          {errors.terms && (
            <p id="terms-error" className="text-sm text-red-600 flex items-center gap-1" role="alert">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              {errors.terms}
            </p>
          )}
        </div>

        {/* Status de envio */}
        {submitStatus === 'success' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg" role="alert">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" aria-hidden="true" />
              <p className="text-sm text-green-800">
                Formulário enviado com sucesso! Obrigado pelo seu contato.
              </p>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" aria-hidden="true" />
              <p className="text-sm text-red-800">
                Erro ao enviar formulário. Verifique os campos e tente novamente.
              </p>
            </div>
          </div>
        )}

        {/* Botão de envio */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-6 rounded-lg font-medium accessible-focus transition-colors ${
            isSubmitting
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
          aria-describedby="submit-hint"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Formulário'}
        </button>
        <p id="submit-hint" className="text-sm text-muted-foreground text-center">
          Pressione Enter ou clique no botão para enviar
        </p>
      </form>
    </section>
  );
};

export default AccessibleForms;
