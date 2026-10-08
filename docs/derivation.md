# Derivação e limites

## Origem observada

Em 08/10/2026, foram inspecionados os exports locais dos workflows de atendimento WhatsApp/Evolution e Instagram DM da Neovian. Em ambos, o Set node chamado `Dados` contém expressões para transformar campos de conteúdo recebidos em um contrato usado pelo roteamento posterior.

Os exemplos públicos derivam exclusivamente das expressões destes campos:

```text
event_type
is_status_event
text
message_type
message_status
```

O código das expressões foi preservado; a referência ao contexto n8n `$json.body` foi substituída pelo argumento local `body`, e os delimitadores de expressão foram removidos. As expressões foram agrupadas em duas funções puras. Os wrappers de módulo, exemplos, fixtures e testes foram preparados para esta demonstração.

As entradas dos testes foram escritas do zero, marcadas com `synthetic: true` e não incluem nomes, contatos, identificadores de contas, endereços ou mensagens de usuários reais. Nenhum payload operacional foi copiado.

## Comportamento que vale estudar

- No WhatsApp, o texto tem uma ordem de precedência explícita entre campos alternativos. Um status de entrega acompanhado de conteúdo não é descartado apenas pelo nome do status; já um evento de atualização é classificado como status pela regra do export.
- No Instagram, anexos de áudio e imagem recebem classificação própria. Exclusões e echoes possuem tipos distintos. Texto com espaços nas extremidades passa por `trim`.
- Ambos mantêm uma saída desconhecida quando não conseguem reconhecer o conteúdo.

## Fora do recorte

Não foram extraídos resolução de identidade, telefone, IDs externos, estado de conversa, gate `should_continue`, prompts, memória, subworkflows, autenticação, URLs, headers, ingestão de documentos, credenciais ou persistência.

Uma classificação de conteúdo não autoriza resposta automática. Validação da origem, interpretação de todos os eventos de um envelope, identidade, deduplicação durável e autorização de efeitos são responsabilidades do sistema completo.

## Limites mantidos

O processamento apenas do primeiro evento Instagram e o reconhecimento parcial de mídia WhatsApp são limites confirmados na expressão original. Estes exemplos registram o comportamento existente e não se apresentam como SDK completo dos provedores.

As funções representam o valor produzido pelas expressões JavaScript. Elas não emulam a conversão de valores feita pelo Set node do n8n nem outras configurações do export original.

## Direitos e publicação

Este recorte não publica os workflows privados nem atribui uma licença aos seus exports ou a componentes de terceiros. Nenhuma licença de distribuição foi adicionada nesta preparação.
