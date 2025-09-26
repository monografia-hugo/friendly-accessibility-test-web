
const TextSection = () => {
  return (
    <>
      {/* Text Section with Different Sizes */}
      <section
        className="stat-card p-4 sm:p-6 lg:p-8 rounded-lg mb-4 sm:mb-6 mx-2 sm:mx-0"
        aria-labelledby="text-section-heading"
      >
        <h2
          id="text-section-heading"
          className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-slate-800 dark:text-slate-100 animate-pulse"
        >
          ✨ Tipografia e Tamanhos de Texto
        </h2>

        <div className="space-y-6 sm:space-y-8">
          {/* Extra Large Text */}
          <div className="group">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-primary flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></span>
              Texto Extra Grande (XL)
            </h3>
            <p
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-50 hover:scale-105 transition-transform duration-300 cursor-default drop-shadow-lg"
            >
              Acessibilidade Digital
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Títulos principais que capturam a atenção e estabelecem hierarquia visual clara
            </p>
          </div>

          {/* Large Text */}
          <div className="group">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-primary flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse"></span>
              Texto Grande (L)
            </h3>
            <p
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-800 dark:text-slate-100 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300 cursor-default drop-shadow-sm bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              Inclusão para Todos
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Subtítulos que organizam o conteúdo e facilitam a navegação
            </p>
          </div>

          {/* Medium Large Text */}
          <div className="group">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-primary flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></span>
              Texto Médio-Grande (ML)
            </h3>
            <p
              className="text-xl sm:text-2xl lg:text-3xl text-slate-800 dark:text-slate-100 hover:drop-shadow-lg transition-all duration-300 cursor-default bg-slate-50 dark:bg-slate-800 py-3 rounded"
            >
              Tecnologia que Conecta Pessoas
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Conteúdo principal que mantém o foco e a legibilidade
            </p>
          </div>

          {/* Medium Text */}
          <div className="group">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-primary flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse"></span>
              Texto Médio (M)
            </h3>
            <p
              className="text-lg sm:text-xl text-slate-800 dark:text-slate-100 leading-relaxed hover:bg-slate-100 dark:hover:bg-slate-700 hover:px-4 hover:py-2 hover:rounded-lg transition-all duration-300 cursor-default"
            >
              A acessibilidade digital não é apenas uma obrigação legal, mas uma oportunidade de criar experiências mais ricas e inclusivas para todos os usuários, independentemente de suas habilidades ou limitações.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Parágrafos de conteúdo que equilibram legibilidade e densidade de informação
            </p>
          </div>

          {/* Small Text */}
          <div className="group">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-primary flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-pulse"></span>
              Texto Pequeno (S)
            </h3>
            <p
              className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-300 cursor-default border-l-4 border-slate-300 dark:border-slate-600 pl-4 bg-slate-50 dark:bg-slate-800"
            >
              Implementar padrões como WCAG 2.1, usar contraste adequado, fornecer alternativas textuais para mídia e garantir navegação por teclado são fundamentais para uma web verdadeiramente acessível.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
              Informações complementares e detalhes técnicos importantes
            </p>
          </div>

          {/* Extra Small Text */}
          <div className="group">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-primary flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full animate-pulse"></span>
              Texto Extra Pequeno (XS)
            </h3>
            <p
              className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed hover:bg-slate-100 dark:hover:bg-slate-700 hover:px-2 hover:py-1 hover:rounded transition-all duration-300 cursor-default"
            >
              WCAG 2.1 AA • Contraste mínimo 4.5:1 • Navegação por teclado • Leitores de tela • Alt text obrigatório
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
              Metadados, legendas e informações técnicas essenciais
            </p>
          </div>

          {/* Mixed Content Example */}
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-primary flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-pulse"></span>
              Exemplo de Conteúdo Misturado
            </h3>
            <div className="space-y-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <h4
                className="text-xl font-bold text-slate-800 dark:text-slate-100 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 cursor-default"
              >
                🎯 Princípios da Acessibilidade Web
              </h4>
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                A criação de interfaces acessíveis beneficia não apenas usuários com deficiências, mas também melhora a experiência geral para todos, incluindo usuários móveis, idosos e pessoas em ambientes com limitações.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Estudos mostram que sites acessíveis têm melhor SEO, maior engajamento e menor taxa de rejeição.
              </p>
              <blockquote
                className="text-lg italic text-slate-700 dark:text-slate-300 pl-4 border-l-4 border-blue-600 dark:border-blue-400 hover:border-l-8 transition-all duration-300 cursor-default bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4"
              >
                "A acessibilidade é sobre remover barreiras, não sobre criar experiências separadas."
              </blockquote>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors duration-300 cursor-default">
                  #Acessibilidade
                </span>
                <span className="px-3 py-1 bg-purple-600 text-white text-xs rounded-full hover:bg-purple-700 transition-colors duration-300 cursor-default">
                  #Inclusão
                </span>
                <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full hover:bg-green-700 transition-colors duration-300 cursor-default">
                  #UX
                </span>
                <span className="px-3 py-1 bg-orange-600 text-white text-xs rounded-full hover:bg-orange-700 transition-colors duration-300 cursor-default">
                  #Design
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default TextSection;