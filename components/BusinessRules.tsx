import React from 'react';

export const BusinessRules: React.FC = () => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg prose max-w-none prose-li:my-1 prose-p:my-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Regras de Negócio - Cálculo de Maturidade</h2>
      <p>
        O posicionamento de cada país no gráfico de jornada é determinado dinamicamente com base nas respostas fornecidas na aba "Diagnóstico". As seguintes premissas são utilizadas para calcular o nível de maturidade:
      </p>
      
      <ol className="list-decimal list-inside space-y-4">
        <li>
          <strong>Ponto de Partida:</strong>
          <p>Todos os países partem de um score base de <strong>1.0</strong> (início do Nível 1). O progresso em cada nível avança a partir deste ponto. Completar uma prática do Nível 1 fará com que o país avance proporcionalmente dentro da faixa de maturidade do Nível 1 (entre 1.0 e 2.0).</p>
        </li>
        <li>
          <strong>Cálculo Percentual por Nível:</strong>
          <p>Para cada país, calculamos o percentual de conclusão para cada um dos 5 níveis de maturidade. Este cálculo é baseado na soma dos pesos das práticas marcadas como "Sim" dentro de cada nível, dividido pelo peso total de todas as práticas daquele nível.</p>
        </li>
        <li>
          <strong>Regra de Prioridade (100% Concluído):</strong>
          <p>Se um país atinge <strong>100% de conclusão em um ou mais níveis</strong>, sua maturidade será definida pelo nível <strong>mais alto</strong> que foi 100% concluído. O score final será o número desse nível mais um (ex: 100% do Nível 2 resulta em uma maturidade de <strong>3.0</strong>), posicionando o país exatamente na transição para o próximo nível. Se 100% do nível 4 for atingido, o score será 5.0. Esta regra tem precedência sobre a regra do maior percentual.</p>
        </li>
        <li>
          <strong>Regra do Maior Percentual de Conclusão:</strong>
           <p>Caso nenhum nível tenha sido 100% concluído, a maturidade do país será determinada pelo nível onde ele obteve o <strong>maior percentual de conclusão</strong>. O score final será calculado como <code>Nível + (Percentual / 100)</code>. Por exemplo, se um país tem 75% de progresso no Nível 3 (e este é o maior percentual), seu score será <strong>3.75</strong>, indicando um avanço de 75% dentro da faixa do Nível 3 (de 3.0 a 4.0).</p>
        </li>
        <li>
          <strong>Exibição de Níveis Incompletos:</strong>
          <p>Para fornecer um contexto sobre "débitos" de maturidade, o gráfico exibe os percentuais de conclusão de quaisquer níveis anteriores ao nível de maturidade efetivo que não foram 100% concluídos. Por exemplo, se um país está posicionado no Nível 4 (por ter 100% no Nível 3) mas só completou 85% do Nível 2, a informação <code>85% N2</code> aparecerá abaixo da bandeira do país no gráfico.</p>
        </li>
      </ol>

      <p className="mt-6 italic text-gray-600">
        Esta abordagem garante que a maturidade reflita não apenas o avanço em práticas complexas, mas também a consolidação dos fundamentos dos níveis anteriores, incentivando um desenvolvimento equilibrado e estratégico.
      </p>
    </div>
  );
};
