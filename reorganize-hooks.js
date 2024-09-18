module.exports = function (fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Defina o conjunto de nomes de hooks que você deseja reorganizar
  const hookNames = new Set([
    "useSelector",
    "useDispatch",
    "useLocale",
    "useState",
    "useRef",
    // Adicione outros hooks se necessário
  ]);

  function isHookCall(expression) {
    return (
      expression && expression.callee && hookNames.has(expression.callee.name)
    );
  }

  function getDeclaredVariables(statement) {
    const declared = new Set();
    if (j.VariableDeclaration.check(statement)) {
      statement.declarations.forEach((declarator) => {
        const id = declarator.id;
        if (j.Identifier.check(id)) {
          declared.add(id.name);
        } else if (j.ArrayPattern.check(id)) {
          id.elements.forEach((elem) => {
            if (elem && elem.name) {
              declared.add(elem.name);
            }
          });
        } else if (j.ObjectPattern.check(id)) {
          id.properties.forEach((prop) => {
            if (prop.value && prop.value.name) {
              declared.add(prop.value.name);
            }
          });
        }
      });
    }
    return declared;
  }

  function getUsedVariables(init) {
    const used = new Set();
    j(init)
      .find(j.Identifier)
      .filter((path) => path.node !== init.callee)
      .forEach((path) => {
        used.add(path.node.name);
      });
    return used;
  }

  function organizeHooksInComponentFunction(path) {
    const bodyStatements = path.node.body.body;
    const declaredVariables = new Set();
    const statementsWithIndex = bodyStatements.map((stmt, index) => ({
      stmt,
      index,
    }));

    const hooks = [];
    const others = [];

    for (let i = 0; i < statementsWithIndex.length; i++) {
      const { stmt, index } = statementsWithIndex[i];
      if (
        j.VariableDeclaration.check(stmt) &&
        stmt.declarations.some((declarator) => isHookCall(declarator.init))
      ) {
        // Verificar se o hook depende apenas de variáveis já declaradas
        const hookDeclarators = stmt.declarations.filter((declarator) =>
          isHookCall(declarator.init)
        );
        let canMove = true;
        for (const declarator of hookDeclarators) {
          const usedVars = getUsedVariables(declarator.init);
          for (const usedVar of usedVars) {
            if (!declaredVariables.has(usedVar)) {
              // Variável usada ainda não foi declarada, não pode mover
              canMove = false;
              break;
            }
          }
          if (!canMove) {
            break;
          }
        }
        if (canMove) {
          hooks.push({ stmt, index });
        } else {
          others.push({ stmt, index });
        }
        // Adicionar variáveis declaradas
        const vars = getDeclaredVariables(stmt);
        vars.forEach((v) => declaredVariables.add(v));
      } else {
        others.push({ stmt, index });
        // Adicionar variáveis declaradas
        const vars = getDeclaredVariables(stmt);
        vars.forEach((v) => declaredVariables.add(v));
      }
    }

    // Reconstruir o corpo da função
    const sortedHooks = hooks
      .sort((a, b) => a.index - b.index)
      .map((item) => item.stmt);
    const sortedOthers = others
      .sort((a, b) => a.index - b.index)
      .map((item) => item.stmt);
    path.node.body.body = [...sortedHooks, ...sortedOthers];
  }

  function transform() {
    root.find(j.FunctionDeclaration).forEach((path) => {
      organizeHooksInComponentFunction(path);
    });

    root
      .find(j.VariableDeclarator)
      .filter(
        (path) =>
          j.FunctionExpression.check(path.node.init) ||
          j.ArrowFunctionExpression.check(path.node.init)
      )
      .forEach((path) => {
        organizeHooksInComponentFunction(path.get("init"));
      });
  }

  transform();

  return root.toSource();
};
