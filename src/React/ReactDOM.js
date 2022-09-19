        function createElement(type, props = {}, ...children) {
            return {
                type,
                props: {
                  ...props,
                  children: children.map(child =>
                    typeof child === "object"
                      ? child
                      : createTextElement(child)
                  )
                }
            }
        }

        function createTextElement(value) {
            return {
                type: "TEXT_ELEMENT",
                props: {
                  value,
                  children: [],
                }
              }
        }


// CREATE ELEMENTS




        // CREATE DOM

        function createDom(fiber) {
            const dom =
              fiber.type == "TEXT_ELEMENT"
                ? document.createTextNode("")
                : document.createElement(fiber.type)
          
            const isProperty = key => key !== "children"
            Object.keys(fiber.props)
              .filter(isProperty)
              .forEach(name => {
                dom[name] = fiber.props[name]
              })
            return dom
          }

          // END CREATE DOM

// requestIdleCallback

// nextUnitOfWork хранит fiber element || null

let nextUnitOfWork = null;
let wipRoot = null;

function render(element, container) {
    wipRoot = {
        dom: container, // <div id="root"></div>
        props: {
          children: [element]
        }
    }
    nextUnitOfWork = wipRoot;
  requestIdleCallback(workLoop);
}

function workLoop(deadline) {
  let shouldWork = true;
  while (nextUnitOfWork && shouldWork) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldWork = deadline.timeRemaining() > 0;
  }

  // если закончили рендерить фибер дерево, performUnitOfWork возвратит undefined, то вызываем commitWork

  if(!nextUnitOfWork && wipRoot) {
    commitRoot(wipRoot);
  }

  requestIdleCallback(workLoop);
}

function commitRoot() {
  commitWork(wipRoot.child);
  wipRoot = null;
}

// TODO: закончили тут

function commitWork(fiber) {
  if(fiber) {
    const domParent = fiber.dom.parent;
    domParent.append(fiber.dom);
    commitWork(fiber.child);
    commitWork(fiber.sibling);
  }
}

// requestIdleCallback

// заготовка следующего фибер объекта

// fiber
// {
//  dom: domELEMENT | null;
//  parent:  domELEMENT | null;  
//  child: domElement | null;
//  sibling: domElement | null;
//  props: {[key: string]: any, children: [] | any[]}
//  type: div | a | h1 | any 
//}

// Функция для создания Fiber
function performUnitOfWork(fiber) {
  // создаем элемент дом для каждого фибер объекта (чтобы потом аппендить)
  if(!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  const elements = fiber.props.children;
  // индекс нужен чтобы далее смотреть является ли элемент потомком или чайлдом (в данном случае h1 потомок потомучто под индексом 1, h2 будет сиблингом);
  // let index = 0;
  let prevSibling = null;

  // проходимся по всему массиву nested элементов

  elements.forEach((reactElement, index) => {
    // Условно создали фибер объект для h1 его {dom: это его родитель <div className="div-hello"></div>, parent: (fiber элемента див), type: h1, props: {что угодно + children}} 

    const newFiber = {
      dom: null,
      parent: fiber,
      type: reactElement.type,
      props: reactElement.props,
      sibling: null,
    }

    if(index === 0) {
      fiber.child = newFiber;
    } else {
      // prevSibling был h1 поэтому его sibling'ом является h2 newFiber {type: h2,}
      prevSibling.sibling = newFiber
    }

    // h1 пройдет проверку index === 0 и prevSibling станет равным = newFiber {type: h1, dom: dom, props: {}, parent: {type: div, props: {className: "div-hello"}}}

    prevSibling = newFiber;
  });

  // После того как создали фибер tree новое ищем следующую единицу работы
  // fiber = {type: div, child: {type: h1}, props: {className: div-hello}};

  if(fiber.child) {
    return fiber.child;
  }
  // в данном случае проверку не прошел fiber {type: h1, sibling: {type: h2, sibling: null}} потомучто у него нет child, поэтому nextFiber = fiber;
  let nextFiber = fiber;

  while(nextFiber) {
    // если у фибера есть сиблинг (а мы не рендерим сиблинги пока есть child); то мы вернем его
    if(nextFiber.sibling) {
      return nextFiber.sibling;
    }
    // если сиблингов больше нету мы пойдем смотреть сиблингов у родителя и создавать фибер для них
    nextFiber = nextFiber.parent;
  }
}

export default {
    createElement,
    render
};