# Fundos Para Letras — Zosma Labs

**Fundos independentes para cada linha das letras no SPresenter.**

Plugin gratuito da [Zosma Labs](https://zosma.com.br) que aplica uma caixa de fundo independente em cada quebra explícita da letra de uma música ao vivo, preservando a posição, o tamanho, a fonte e o alinhamento do tema.

> **Versão atual: 0.3.53**

[Baixar a versão mais recente](https://github.com/zosmalabs/fundos-para-letras-spresenter/releases/latest) · [Site da Zosma](https://zosma.com.br)

## Principais recursos

- Fundo independente para cada linha da letra;
- controle de cor e opacidade;
- espaçamento horizontal e vertical;
- distância independente entre as linhas;
- cantos arredondados;
- borda opcional;
- detecção automática da música, saída, camada e elemento da letra;
- ativação e desativação pelo painel do plugin.

## Instalação e uso

1. Baixe o ZIP na página de [Releases](https://github.com/zosmalabs/fundos-para-letras-spresenter/releases/latest).
2. No SPresenter, acesse **Configurações → Plugins → Instalar**.
3. Selecione o ZIP sem descompactá-lo.
4. Coloque uma música ao vivo normalmente.
5. Abra **Fundo por Linha**, escolha a aparência e clique em **Ativar fundo**.

Use **Desativar fundo** antes de fechar ou remover o plugin.

O plugin detecta automaticamente a saída, a camada e o elemento da letra. Ele não coloca nem remove conteúdo do ar.

## Funcionamento

O plugin identifica uma apresentação musical e o elemento de texto com marcador `{letra}`. Quando ativo, lê o texto recebido nos eventos ao vivo, preserva a estrutura da letra e renderiza cada linha em um elemento próprio.

Isso permite aumentar o fundo de cada linha sem alterar a distância original entre elas. O controle **Distância entre linhas** acrescenta espaço independente entre as linhas sem modificar a espessura do fundo e sem exigir alterações no tema do SPresenter.

## Permissões

- `outputs:read`
- `live:read`
- `live:write`

## Limitações conhecidas

- O fundo acompanha apenas quebras explícitas existentes no verso. Quebras automáticas causadas pela falta de largura não podem ser identificadas pela API;
- acordes, comentários, Markdown e autoscale ainda precisam de validação adicional em combinações específicas de tema e conteúdo.

## Desenvolvimento

```bash
npm install
npm run build
npm run package
```

O ZIP instalável é gerado na pasta `release`.

## Zosma Labs

**Ideias transformadas em software.**

[zosma.com.br](https://zosma.com.br)

## Licença

Distribuído sob a licença MIT. Consulte [LICENSE](LICENSE).
