import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

        <div className="space-y-8">
          {/* Tabela: Tamanhos de Texto */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-primary">Mapa de Tamanhos de Texto</h3>
            <Table aria-describedby="text-table-desc">
              <TableCaption id="text-table-desc" className="text-left">
                Tabela com exemplos visuais e recomendações de uso para diferentes tamanhos de texto.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col" className="w-44">Tamanho</TableHead>
                  <TableHead scope="col">Exemplo</TableHead>
                  <TableHead scope="col" className="w-[35%]">Uso recomendado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* XL */}
                <TableRow>
                  <TableHead scope="row" className="align-top font-semibold text-slate-900 dark:text-slate-100">
                    Texto Extra Grande (XL)
                  </TableHead>
                  <TableCell className="align-top">
                    <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-50 drop-shadow-lg cursor-default">
                      Acessibilidade Digital
                    </p>
                  </TableCell>
                  <TableCell className="align-top text-sm text-slate-700 dark:text-slate-300">
                    Títulos principais que capturam a atenção e estabelecem hierarquia visual clara.
                  </TableCell>
                </TableRow>
                {/* L */}
                <TableRow>
                  <TableHead scope="row" className="align-top font-semibold text-slate-900 dark:text-slate-100">
                    Texto Grande (L)
                  </TableHead>
                  <TableCell className="align-top">
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-800 dark:text-slate-100 drop-shadow-sm bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 cursor-default">
                      Inclusão para Todos
                    </p>
                  </TableCell>
                  <TableCell className="align-top text-sm text-slate-700 dark:text-slate-300">
                    Subtítulos que organizam o conteúdo e facilitam a navegação.
                  </TableCell>
                </TableRow>
                {/* ML */}
                <TableRow>
                  <TableHead scope="row" className="align-top font-semibold text-slate-900 dark:text-slate-100">
                    Texto Médio-Grande (ML)
                  </TableHead>
                  <TableCell className="align-top">
                    <p className="text-xl sm:text-2xl lg:text-3xl text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 py-3 rounded cursor-default">
                      Tecnologia que Conecta Pessoas
                    </p>
                  </TableCell>
                  <TableCell className="align-top text-sm text-slate-700 dark:text-slate-300">
                    Conteúdo principal que mantém o foco e a legibilidade.
                  </TableCell>
                </TableRow>
                {/* M */}
                <TableRow>
                  <TableHead scope="row" className="align-top font-semibold text-slate-900 dark:text-slate-100">
                    Texto Médio (M)
                  </TableHead>
                  <TableCell className="align-top">
                    <p className="text-lg sm:text-xl text-slate-800 dark:text-slate-100 leading-relaxed cursor-default">
                      A acessibilidade digital não é apenas uma obrigação legal, mas uma oportunidade de criar experiências mais ricas e inclusivas para todos os usuários, independentemente de suas habilidades ou limitações.
                    </p>
                  </TableCell>
                  <TableCell className="align-top text-sm text-slate-700 dark:text-slate-300">
                    Parágrafos de conteúdo que equilibram legibilidade e densidade de informação.
                  </TableCell>
                </TableRow>
                {/* S */}
                <TableRow>
                  <TableHead scope="row" className="align-top font-semibold text-slate-900 dark:text-slate-100">
                    Texto Pequeno (S)
                  </TableHead>
                  <TableCell className="align-top">
                    <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-slate-300 dark:border-slate-600 pl-4 bg-slate-50 dark:bg-slate-800 cursor-default">
                      Implementar padrões como WCAG 2.1, usar contraste adequado, fornecer alternativas textuais para mídia e garantir navegação por teclado são fundamentais para uma web verdadeiramente acessível.
                    </p>
                  </TableCell>
                  <TableCell className="align-top text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    Informações complementares e detalhes técnicos importantes.
                  </TableCell>
                </TableRow>
                {/* XS */}
                <TableRow>
                  <TableHead scope="row" className="align-top font-semibold text-slate-900 dark:text-slate-100">
                    Texto Extra Pequeno (XS)
                  </TableHead>
                  <TableCell className="align-top">
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed cursor-default">
                      WCAG 2.1 AA • Contraste mínimo 4.5:1 • Navegação por teclado • Leitores de tela • Alt text obrigatório
                    </p>
                  </TableCell>
                  <TableCell className="align-top text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    Metadados, legendas e informações técnicas essenciais.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Tabela: Princípios e Benefícios (resumo do conteúdo misturado) */}
          <div className="pt-2">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-primary">Resumo de Princípios e Benefícios</h3>
            <Table aria-describedby="mixed-content-desc">
              <TableCaption id="mixed-content-desc" className="text-left">
                Tabela resumo do exemplo de conteúdo misturado apresentado anteriormente.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col" className="w-52">Item</TableHead>
                  <TableHead scope="col">Conteúdo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableHead scope="row">Princípios</TableHead>
                  <TableCell>
                    <span className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100">🎯 Princípios da Acessibilidade Web</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead scope="row">Benefício Geral</TableHead>
                  <TableCell className="text-slate-700 dark:text-slate-300">
                    A criação de interfaces acessíveis beneficia não apenas usuários com deficiências, mas também melhora a experiência geral para todos, incluindo usuários móveis, idosos e pessoas em ambientes com limitações.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead scope="row">SEO e Engajamento</TableHead>
                  <TableCell className="text-slate-700 dark:text-slate-300">
                    Estudos mostram que sites acessíveis têm melhor SEO, maior engajamento e menor taxa de rejeição.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead scope="row">Citação</TableHead>
                  <TableCell>
                    <blockquote className="text-base sm:text-lg italic text-slate-700 dark:text-slate-300 border-l-4 border-blue-600 dark:border-blue-400 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      "A acessibilidade é sobre remover barreiras, não sobre criar experiências separadas."
                    </blockquote>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead scope="row">Tags</TableHead>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 bg-blue-600 text-white text-xs rounded-full">#Acessibilidade</span>
                      <span className="px-2.5 py-1 bg-purple-600 text-white text-xs rounded-full">#Inclusão</span>
                      <span className="px-2.5 py-1 bg-green-600 text-white text-xs rounded-full">#UX</span>
                      <span className="px-2.5 py-1 bg-orange-600 text-white text-xs rounded-full">#Design</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </>
  );
}

export default TextSection;