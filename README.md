# Fundos Para Letras no SPresenter

Plugin que aplica uma caixa de fundo independente em cada quebra explícita da letra de uma música ao vivo.

**Versão atual:** 0.3.54

Desenvolvido por **Zosma Labs**.

## Instalação e uso

1. Instale o ZIP em **Configurações → Plugins → Instalar**.
2. Coloque uma música ao vivo normalmente.
3. Abra **Fundo por Linha**, escolha a aparência e clique em **Ativar fundo**.
4. Use **Desativar fundo** antes de fechar ou remover o plugin.

Saída, camada e elemento da letra são detectados automaticamente. O plugin nunca coloca nem remove conteúdo do ar.

> Ao atualizar a partir da versão 0.3.53 ou anterior, remova primeiro o plugin antigo identificado como `com.multitracktools.lyrics-background`. A partir da versão 0.3.54, o identificador oficial é `com.zosmalabs.lyrics-background`.

## Funcionamento

O plugin identifica uma apresentação musical e o elemento TEXT com marcador {letra}. Quando ativo, lê props.text em cada evento live, escapa o conteúdo e renderiza cada linha em um elemento inline próprio, separado por quebra de linha. Assim, o padding aumenta somente o fundo pintado e não altera a distância original entre as linhas. A caixa do tema conserva posição, tamanho, fonte e alinhamento, com fundo, padding e bordas explicitamente neutralizados.

O controle **Distância entre linhas** acrescenta espaço independente entre cada linha da letra, sem modificar a espessura do fundo e sem exigir alterações no tema do SPresenter.

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
