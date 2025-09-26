
const TextSection = () => {
  return (
    <>
      {/* Text Section with Different Sizes */}
      <section
        className="stat-card p-4 sm:p-6 lg:p-8 rounded-lg mb-4 sm:mb-6 mx-2 sm:mx-0"
        aria-labelledby="text-section-heading"
      >
        <h2 id="text-section-heading" className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
          Tipografia e Tamanhos de Texto
        </h2>

        <div className="space-y-4 sm:space-y-6">
          {/* Extra Large Text */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-primary">
              Texto Extra Grande (XL)
            </h3>
            <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
              Título Principal
            </p>
          </div>

          {/* Large Text */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-primary">
              Texto Grande (L)
            </h3>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground">
              Subtítulo Importante
            </p>
          </div>

          {/* Medium Large Text */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-primary">
              Texto Médio-Grande (ML)
            </h3>
            <p className="text-xl sm:text-2xl lg:text-3xl text-foreground">
              Seção de Conteúdo Principal
            </p>
          </div>

          {/* Medium Text */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-primary">
              Texto Médio (M)
            </h3>
            <p className="text-lg sm:text-xl text-foreground">
              Parágrafo de conteúdo regular com informações importantes sobre o sistema.
            </p>
          </div>

          {/* Small Text */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-primary">
              Texto Pequeno (S)
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Texto secundário com detalhes adicionais e informações complementares.
            </p>
          </div>

          {/* Extra Small Text */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-primary">
              Texto Extra Pequeno (XS)
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Texto de rodapé, legendas ou informações técnicas detalhadas.
            </p>
          </div>

          {/* Mixed Content Example */}
          <div className="mt-6 pt-4 border-t border-border">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-primary">
              Exemplo de Conteúdo Misturado
            </h3>
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-foreground">Título da Seção</h4>
              <p className="text-base text-foreground">
                Este é um parágrafo com texto normal que contém informações importantes.
              </p>
              <p className="text-sm text-muted-foreground">
                E aqui temos um texto menor com detalhes complementares.
              </p>
              <blockquote className="text-lg italic text-primary pl-4 border-l-4 border-primary">
                "Citação importante destacada em tamanho maior."
              </blockquote>
            </div>
          </div>
        </div>
      </section>
            </>
  );
}

export default TextSection;