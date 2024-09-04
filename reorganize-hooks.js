module.exports = function (fileInfo, api) {
  const j = api.jscodeshift
  const root = j(fileInfo.source)

  // Ordem personalizada dos hooks: useSelector, useState, useRef
  const hookPriorities = {
    useSelector: 0,
    useState: 1,
    useRef: 2,
  }

  // Função para verificar se o identificador é um hook
  function isHook(identifier) {
    return hookPriorities.hasOwnProperty(identifier.name)
  }

  // Função para reorganizar os hooks dentro do corpo da função do componente
  function organizeHooksInComponentFunction(path) {
    const body = path.node.body.body
    const hookGroups = {
      useSelector: [],
      useState: [],
      useRef: [],
      other: [],
    }

    // Separar hooks por tipo (useSelector, useState, useRef) e outros statements
    body.forEach((statement) => {
      if (j.VariableDeclaration.check(statement)) {
        const hookName = statement.declarations[0]?.init?.callee?.name
        if (hookName && isHook(statement.declarations[0].init.callee)) {
          hookGroups[hookName].push(statement)
        } else {
          hookGroups.other.push(statement)
        }
      } else {
        hookGroups.other.push(statement)
      }
    })

    // Reorganizar os hooks e adicionar espaços entre os grupos (usando comentários ou agrupamentos)
    const organizedHooks = [
      ...hookGroups.useSelector,
      ...(hookGroups.useSelector.length && hookGroups.useState.length
        ? [j.emptyStatement()]
        : []),
      ...hookGroups.useState,
      ...(hookGroups.useState.length && hookGroups.useRef.length
        ? [j.emptyStatement()]
        : []),
      ...hookGroups.useRef,
    ]

    // Atualizar o corpo da função com hooks reorganizados seguidos pelos outros statements
    path.node.body.body = [...organizedHooks, ...hookGroups.other]
  }

  // Função principal para encontrar componentes e organizar os hooks dentro de cada componente
  function transform() {
    root
      .find(j.FunctionDeclaration) // Encontra todas as funções declaradas
      .forEach((path) => {
        organizeHooksInComponentFunction(path) // Reorganiza os hooks dentro da função do componente
      })

    root
      .find(j.ArrowFunctionExpression) // Encontra todas as funções arrow
      .filter((path) => j.VariableDeclarator.check(path.parent.node)) // Certifica-se de que é uma função arrow em um componente
      .forEach((path) => {
        organizeHooksInComponentFunction(path) // Reorganiza os hooks dentro da função do componente
      })
  }

  transform()

  return root.toSource()
}
