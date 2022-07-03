const ReactDOM = (function() {
    return {
        createElement: function(type, props = {}, ...children) {
            return {
                type,
                props: {
                  ...props,
                  children: children.map(child =>
                    typeof child === "object"
                      ? child
                      : this.createTextElement(child)
                  )
                }
            }
        },

        createTextElement: function(value) {
            return {
                type: "TEXT_ELEMENT",
                props: {
                  value,
                  children: [],
                }
              }
        },

        render: function(element, container) {
            let node;
            if(typeof element === "function") {
                element = element();
            }
            if(element.type === "TEXT_ELEMENT") {
                node = document.createTextNode(element.props.value);
            } else {
                node = document.createElement(element.type)
            }

            const isPropNotChildren = key => key !== "children";
            const setPropToNode = prop => {
                node[prop] = element.props[prop]
            };

            Object.keys(element.props)
                .filter(isPropNotChildren)
                .forEach(setPropToNode)

            container.append(node);

            element.props.children.forEach(item => {
                this.render(item, node);
            })
            
            return node;
        },
    
    }
})();

export default ReactDOM;