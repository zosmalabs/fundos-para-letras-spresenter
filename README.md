# Fundos Para Letras no SPresenter

Plugin que aplica uma caixa de fundo independente em cada quebra explícita da letra de uma música ao vivo.

**Versão atual:** 0.3.61

Desenvolvido por **Zosma Labs**.

## Instalação e uso

1. Instale o ZIP em **Configurações → Plugins → Instalar**.
2. Coloque uma música ao vivo normalmente.
3. Abra **Fundo por Linha**, escolha a aparência e clique em **Salvar configuração**.
4. Use **Desativar fundo** antes de fechar ou remover o plugin.

Saída, camada e elemento da letra são detectados automaticamente. O plugin nunca coloca nem remove conteúdo do ar.

Na primeira instalação, o plugin começa ativado. Depois disso, o botão **Salvar configuração** também grava se o plugin está ativado ou desativado. Assim, ele volta exatamente nesse estado quando o SPresenter for aberto novamente.

Os controles alteram a aparência imediatamente para facilitar a prévia. O botão **Salvar configuração** grava o estado do plugin, cor, opacidade, espaçamentos, distância entre linhas, cantos e borda. Na próxima abertura, o plugin restaura essa configuração salva em vez dos valores padrão.

Depois da gravação, o botão muda temporariamente para **Configuração salva ✓** e uma confirmação verde aparece na tela. Se houver falha, o plugin também informa o erro e permite tentar novamente.

> Ao atualizar a partir da versão 0.3.53 ou anterior, remova primeiro o plugin antigo identificado como `com.multitracktools.lyrics-background`. A partir da versão 0.3.54, o identificador oficial é `com.zosmalabs.lyrics-background`.

## Funcionamento

O plugin identifica uma apresentação musical e o elemento TEXT com marcador {letra}. Quando ativo, lê props.text em cada evento live, escapa o conteúdo e renderiza cada linha em um elemento inline próprio, separado por quebra de linha. Assim, o padding aumenta somente o fundo pintado e não altera a distância original entre as linhas. A caixa do tema conserva posição, tamanho, fonte e alinhamento, com fundo, padding e bordas explicitamente neutralizados.

O controle **Distância entre linhas** altera a altura das linhas renderizadas. Por isso funciona tanto nas quebras gravadas na letra quanto nas quebras automáticas criadas quando o texto não cabe na largura, sem modificar a espessura do fundo e sem exigir alterações no tema do SPresenter.

As mudanças rápidas de estrofe são processadas em fila. Se uma nova letra chegar enquanto o fundo anterior ainda estiver sendo aplicado, a atualização fica pendente e é executada em seguida, evitando estrofes sem fundo.

Após cada mudança ao vivo, o plugin faz uma reaplicação final controlada. Isso corrige os casos em que o SPresenter redesenha a letra depois da primeira aplicação e remove o fundo, sem gerar um ciclo entre o evento ao vivo e a alteração feita pelo próprio plugin.

## Permissões

- outputs:read
- live:read
- live:write

## Desenvolvimento

```bash
npm install
npm run build
npm run package
```

O ZIP instalável é gerado na pasta `release`.

## Licença

Distribuído sob a licença MIT. Consulte [LICENSE](LICENSE).

## Limitações

- O fundo acompanha apenas quebras explícitas existentes no verso. Quebras automáticas causadas pela falta de largura não podem ser identificadas pela API.
- A renderização HTML substitui temporariamente o pipeline normal de texto. Acordes, comentários, Markdown e autoscale ainda precisam de testes específicos.
- A validação inicial deve ser feita com o tema Padrão — Música, cujo elemento letra usa autoScale desativado.
- Não foi possível executar o SPresenter neste ambiente.

## Validações realizadas

- Estrutura do renderizador real examinada no app.asar fornecido pelo usuário.
- Compilação TypeScript e produção.
- Integridade do pacote ZIP.
