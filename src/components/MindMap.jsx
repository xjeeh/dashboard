import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Icon } from "./Icon";
import css from "./MindMap.module.scss";
import classNames from "classnames";
import store from "store2";
import { useWindow } from "../contexts/WindowContext";
import { useWindowState } from "../hooks/useWindowState";
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const CustomNode = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.label);
  const [isHovered, setIsHovered] = useState(false);
  const [isBoxStyle, setIsBoxStyle] = useState(data.isBoxStyle || false);
  const inputRef = useRef(null);
  const textRef = useRef(null);

  const toggleStyle = (e) => {
    e.stopPropagation();
    setIsBoxStyle(!isBoxStyle);
    if (data.onStyleChange) {
      data.onStyleChange(id, !isBoxStyle);
    }
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Shift+Enter: permitir quebra de linha (comportamento padrão do textarea)
        return;
      } else {
        // Enter sozinho: finalizar edição e criar irmão
        e.preventDefault();
        setIsEditing(false);

        const trimmedText = text.trim();
        if (trimmedText === "") {
          // Deletar o nó apenas se o texto estiver vazio
          if (data.onDeleteNode) {
            data.onDeleteNode(id);
          }
        } else {
          // Se o texto for válido (incluindo "New Node"), salvar e criar irmão
          if (data.onTextChange) {
            data.onTextChange(id, trimmedText);
          }
          // Verificar se este nó é um parent (tem filhos) ou child
          if (data.onCreateChild) {
            data.onCreateChild(id);
          }
        }
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsEditing(false);

      // Sempre restaurar o texto original ao pressionar Escape
      setText(data.label);
    }
  };

  const handleBlur = (e) => {
    // Usar setTimeout para garantir que outros handlers (como clique) sejam processados primeiro
    setTimeout(() => {
      setIsEditing(false);

      const trimmedText = text.trim();
      if (trimmedText === "") {
        // Deletar o nó apenas se o texto estiver vazio
        if (data.onDeleteNode) {
          data.onDeleteNode(id);
        }
      } else {
        // Se o texto for válido (incluindo "New Node"), salvar
        if (data.onTextChange) {
          data.onTextChange(id, trimmedText);
        }
      }

      // Remover flags de edição
      if (data.onRemoveAutoEdit) {
        data.onRemoveAutoEdit(id);
      }
      if (data.onRemoveForceEdit) {
        data.onRemoveForceEdit(id);
      }
    }, 0);
  };

  const handleAddChild = (e) => {
    e.stopPropagation();
    if (data.onAddChild) {
      data.onAddChild(id);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Posicionar o cursor no final do texto
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  // Forçar modo de edição se o nó for marcado para auto-edição ou forceEdit
  useEffect(() => {
    if ((data.autoEdit || data.forceEdit) && !isEditing) {
      // Pequeno delay para evitar problemas de seleção automática
      requestAnimationFrame(() => {
        setIsEditing(true);
        // Remove as flags após ativar a edição
        if (data.autoEdit && data.onRemoveAutoEdit) {
          data.onRemoveAutoEdit(id);
        }
        if (data.forceEdit && data.onRemoveForceEdit) {
          data.onRemoveForceEdit(id);
        }
      });
    }
  }, [data, id, isEditing]);

  // Passar o estado de edição para o componente pai
  useEffect(() => {
    if (data.onEditModeChange) {
      data.onEditModeChange(id, isEditing);
    }
  }, [isEditing, id, data]);

  return (
    <div
      className={`${css.customNode} ${isBoxStyle ? css.boxStyle : css.labelStyle}`}
      style={{
        boxShadow: selected ? "0 0 0 2px rgba(255, 255, 255, 0.3)" : "none",
      }}
      data-id={id}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Mantemos apenas os handles necessários para as conexões automáticas */}
      <Handle type="target" position={Position.Left} id="left" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} id="right" style={{ opacity: 0 }} />

      <div className={css.nodeContent} ref={textRef}>
        {isEditing ? (
          <textarea
            ref={inputRef}
            value={text}
            onChange={handleTextChange}
            // onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={css.nodeInput}
            style={{
              width: textRef.current ? `${textRef.current.offsetWidth}px` : "auto",
              height: textRef.current ? `${textRef.current.offsetHeight}px` : "auto",
              resize: "none",
            }}
          />
        ) : (
          <div className={css.nodeText}>
            {text.split("\n").map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        )}
      </div>

      {/* Botão de adicionar filho - aparece apenas quando hover e não está editando */}
      {(isHovered || selected) && !isEditing && (
        <>
          <button
            className={css.addChildButton}
            onClick={handleAddChild}
            title="Adicionar nó filho"
          >
            +
          </button>
          <button
            className={css.toggleStyleButton}
            onClick={toggleStyle}
            title={isBoxStyle ? "Mudar para label" : "Mudar para caixa"}
          >
            {isBoxStyle ? "L" : "B"}
          </button>
          <button
            className={css.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
              if (data.onDeleteNode) {
                data.onDeleteNode(id);
              }
            }}
            title="Deletar nó"
          >
            -
          </button>
        </>
      )}
    </div>
  );
};

export const MindMap = () => {
  const storeIndex = "mindmap-daily";

  // Função para gerar cor HSL baseada no índice
  const getEdgeColor = useCallback((index) => {
    // Começar com roxo (hue: 250) e ir diminuindo
    // Cada filho reduz 20 graus no hue
    const baseHue = 250;
    const hue = Math.max(0, baseHue - index * 20);
    // Manter saturação e luminosidade constantes para um degradê mais suave
    return `hsl(${hue}, 80%, 65%)`;
  }, []);

  const defaultNodes = [
    {
      id: "root",
      type: "custom",
      position: { x: 250, y: 100 },
      data: {
        label: "Central Idea",
        isBoxStyle: true,
      },
    },
    {
      id: "child1",
      type: "custom",
      position: { x: 100, y: 200 },
      data: {
        label: "Branch 1",
        isBoxStyle: false,
      },
    },
    {
      id: "child2",
      type: "custom",
      position: { x: 400, y: 200 },
      data: {
        label: "Branch 2",
        isBoxStyle: false,
      },
    },
    {
      id: "child3",
      type: "custom",
      position: { x: 250, y: 300 },
      data: {
        label: "Branch 3",
        isBoxStyle: false,
      },
    },
    {
      id: "child4",
      type: "custom",
      position: { x: 50, y: 100 },
      data: {
        label: "Left Branch",
        isBoxStyle: false,
      },
    },
    {
      id: "child5",
      type: "custom",
      position: { x: 450, y: 100 },
      data: {
        label: "Right Branch",
        isBoxStyle: false,
      },
    },
  ];

  const defaultEdges = useMemo(
    () => [
      { id: "e1-2", source: "root", target: "child1", style: { stroke: getEdgeColor(0) } },
      { id: "e1-3", source: "root", target: "child2", style: { stroke: getEdgeColor(1) } },
      { id: "e1-4", source: "root", target: "child3", style: { stroke: getEdgeColor(2) } },
      { id: "e4-1", source: "child4", target: "root", style: { stroke: getEdgeColor(3) } },
      { id: "e1-5", source: "root", target: "child5", style: { stroke: getEdgeColor(4) } },
    ],
    [getEdgeColor]
  );

  const [mindmap, setMindmap] = useWindowState(storeIndex, {
    x: "100px",
    y: "100px",
    width: "800px",
    height: "600px",
    isMinimized: false,
    isClosed: false,
    zoom: 1,
    viewport: { x: 0, y: 0, zoom: 1 },
    nodes: defaultNodes,
    edges: defaultEdges,
  });

  const ref = useRef(null);
  const offset = useRef({ x: 0, y: 0 });
  const isResizing = useRef(false);
  const resizeStartPos = useRef({ x: 0, y: 0 });
  const resizeStartSize = useRef({ width: 0, height: 0 });
  const setNodesRef = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(mindmap.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(mindmap.edges);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [editingNodes, setEditingNodes] = useState(new Set());
  const [zoom, setZoom] = useState(mindmap.zoom || 1);
  const [viewport, setViewport] = useState({
    x: mindmap.viewport?.x || 0,
    y: mindmap.viewport?.y || 0,
    zoom: mindmap.zoom || 1,
  });

  useEffect(() => {
    setNodesRef.current = setNodes;
  }, [setNodes]);

  const handleTextChange = useCallback((nodeId, newText) => {
    if (setNodesRef.current) {
      setNodesRef.current((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, label: newText } } : node
        )
      );
    }
  }, []);

  const handleEditModeChange = useCallback((nodeId, isEditing) => {
    setEditingNodes((prev) => {
      const newSet = new Set(prev);
      if (isEditing) {
        newSet.add(nodeId);
      } else {
        newSet.delete(nodeId);
      }
      return newSet;
    });
  }, []);

  const handleStyleChange = useCallback(
    (nodeId, isBoxStyle) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, isBoxStyle } } : node
        )
      );
    },
    [setNodes]
  );

  const addChildNode = useCallback(
    (parentId) => {
      const parentNode = nodes.find((node) => node.id === parentId);
      if (!parentNode) return;

      // Encontrar todos os filhos existentes deste nó pai
      const childrenIds = edges
        .filter((edge) => edge.source === parentId)
        .map((edge) => edge.target);

      const children = nodes.filter((node) => childrenIds.includes(node.id));

      // Criar o novo nó
      const newNode = {
        id: `node-${Date.now()}`,
        type: "custom",
        position: { x: 0, y: 0 }, // Posição temporária, será recalculada
        data: {
          label: "New Node",
          onTextChange: handleTextChange,
          onAddChild: addChildNode,
          onEditModeChange: handleEditModeChange,
          autoEdit: true, // Marcar para entrar automaticamente em modo de edição
          isBoxStyle: false, // Child nodes são label por padrão
        },
      };

      // Gerar cor dinâmica baseada no número de filhos
      const edgeColor = getEdgeColor(children.length);

      const newEdge = {
        id: `edge-${parentId}-${newNode.id}`,
        source: parentId,
        target: newNode.id,
        type: "smoothstep",
        sourceHandle: "right",
        targetHandle: "left",
        style: { stroke: edgeColor },
      };

      // Adicionar o novo nó e reposicionar todos os filhos
      setNodes((nds) => {
        const updatedNodes = [...nds, newNode];

        // Recalcular posições de todos os filhos (incluindo o novo)
        const allChildren = [...children, newNode];
        const horizontalOffset = 180; // Distância à direita do nó pai
        const verticalSpacing = 35; // Espaçamento vertical entre nós filhos

        // Calcular posição inicial para centralizar verticalmente
        const totalHeight = (allChildren.length - 1) * verticalSpacing;
        const startY = parentNode.position.y - totalHeight / 2;

        // Reposicionar todos os filhos
        const repositionedNodes = updatedNodes.map((node) => {
          if (allChildren.some((child) => child.id === node.id)) {
            const childIndex = allChildren.findIndex((child) => child.id === node.id);
            return {
              ...node,
              position: {
                x: parentNode.position.x + horizontalOffset,
                y: startY + childIndex * verticalSpacing,
              },
            };
          }
          return node;
        });

        return repositionedNodes;
      });

      setEdges((eds) => [...eds, newEdge]);
    },
    [nodes, edges, handleTextChange, handleEditModeChange, setNodes, setEdges, getEdgeColor]
  );

  const createSiblingNode = useCallback(
    (siblingId) => {
      // Encontrar o nó pai do irmão atual
      const parentEdge = edges.find((edge) => edge.target === siblingId);

      if (parentEdge) {
        // Se tem pai, criar outro filho do mesmo pai usando addChildNode diretamente
        // Forçar re-busca dos dados atualizados
        setNodes((currentNodes) => {
          setEdges((currentEdges) => {
            const currentParentNode = currentNodes.find((node) => node.id === parentEdge.source);
            if (!currentParentNode) return currentEdges;

            // Encontrar filhos existentes com dados atuais
            const currentChildrenIds = currentEdges
              .filter((edge) => edge.source === parentEdge.source)
              .map((edge) => edge.target);

            const currentChildren = currentNodes.filter((node) =>
              currentChildrenIds.includes(node.id)
            );

            // Criar novo nó
            const newNode = {
              id: `node-${Date.now()}`,
              type: "custom",
              position: { x: 0, y: 0 }, // Será recalculado
              data: {
                label: "New Node",
                onTextChange: handleTextChange,
                onAddChild: addChildNode,
                onEditModeChange: handleEditModeChange,
                autoEdit: true,
                isBoxStyle: false, // Child nodes são label por padrão
              },
            };

            // Criar nova edge
            // Encontrar o índice deste filho entre os irmãos
            const childIndex = currentChildren.length;
            const newEdge = {
              id: `edge-${parentEdge.source}-${newNode.id}`,
              source: parentEdge.source,
              target: newNode.id,
              type: "smoothstep",
              sourceHandle: "right",
              targetHandle: "left",
              style: { stroke: getEdgeColor(childIndex) },
            };

            // Reposicionar todos os filhos (incluindo o novo)
            const allChildren = [...currentChildren, newNode];
            const horizontalOffset = 180;
            const verticalSpacing = 35;
            const totalHeight = (allChildren.length - 1) * verticalSpacing;
            const startY = currentParentNode.position.y - totalHeight / 2;

            const repositionedNodes = [
              ...currentNodes.filter((n) => !allChildren.some((c) => c.id === n.id)),
              newNode,
              ...currentChildren.map((child, index) => ({
                ...child,
                position: {
                  x: currentParentNode.position.x + horizontalOffset,
                  y: startY + index * verticalSpacing,
                },
              })),
            ];

            // Posicionar o novo nó
            const newNodeIndex = allChildren.length - 1;
            const finalNodes = repositionedNodes.map((node) =>
              node.id === newNode.id
                ? {
                    ...node,
                    position: {
                      x: currentParentNode.position.x + horizontalOffset,
                      y: startY + newNodeIndex * verticalSpacing,
                    },
                  }
                : node
            );

            setNodes(finalNodes);
            return [...currentEdges, newEdge];
          });
          return currentNodes; // Este return não será usado pois setNodes é chamado dentro
        });
      } else {
        // Se não tem pai (é um nó raiz), criar um novo nó raiz próximo
        const siblingNode = nodes.find((node) => node.id === siblingId);
        if (!siblingNode) return;

        const newNode = {
          id: `node-${Date.now()}`,
          type: "custom",
          position: {
            x: siblingNode.position.x + 150,
            y: siblingNode.position.y + 100,
          },
          data: {
            label: "New Node",
            onTextChange: handleTextChange,
            onAddChild: addChildNode,
            onEditModeChange: handleEditModeChange,
            onCreateSibling: createSiblingNode,
            autoEdit: true,
            isBoxStyle: false,
          },
        };

        setNodes((nds) => [...nds, newNode]);
      }
    },
    [
      edges,
      nodes,
      handleTextChange,
      handleEditModeChange,
      addChildNode,
      setNodes,
      setEdges,
      getEdgeColor,
    ]
  );

  const createChild = useCallback(
    (nodeId) => {
      // Verificar se este nó tem filhos (é um parent)
      const hasChildren = edges.some((edge) => edge.source === nodeId);

      // Verificar se este nó tem pai (é um child)
      const parentEdge = edges.find((edge) => edge.target === nodeId);

      if (hasChildren) {
        // Se tem filhos, criar outro filho
        addChildNode(nodeId);
      } else if (parentEdge) {
        // Se não tem filhos mas tem pai, criar irmão
        addChildNode(parentEdge.source);
      } else {
        // Se não tem filhos nem pai (nó raiz isolado), criar filho
        addChildNode(nodeId);
      }
    },
    [edges, addChildNode]
  );

  const repositionChildren = useCallback((parentId, remainingNodes, allEdges) => {
    const parentNode = remainingNodes.find((node) => node.id === parentId);
    if (!parentNode) return remainingNodes;

    // Encontrar todos os filhos deste nó pai
    const childrenIds = allEdges
      .filter((edge) => edge.source === parentId)
      .map((edge) => edge.target);

    const children = remainingNodes.filter((node) => childrenIds.includes(node.id));

    if (children.length === 0) return remainingNodes;

    const horizontalOffset = 180; // Distância à direita do nó pai
    const verticalSpacing = 35; // Espaçamento vertical entre nós filhos

    // Calcular posição inicial para centralizar verticalmente
    const totalHeight = (children.length - 1) * verticalSpacing;
    const startY = parentNode.position.y - totalHeight / 2;

    // Reposicionar todos os filhos
    return remainingNodes.map((node) => {
      if (children.some((child) => child.id === node.id)) {
        const childIndex = children.findIndex((child) => child.id === node.id);
        return {
          ...node,
          position: {
            x: parentNode.position.x + horizontalOffset,
            y: startY + childIndex * verticalSpacing,
          },
        };
      }
      return node;
    });
  }, []);

  const removeAutoEdit = useCallback(
    (nodeId) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, autoEdit: false } } : node
        )
      );
    },
    [setNodes]
  );

  const enterEditMode = useCallback(
    (nodeId) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, forceEdit: true } } : node
        )
      );
    },
    [setNodes]
  );

  const removeForceEdit = useCallback(
    (nodeId) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, forceEdit: false } } : node
        )
      );
    },
    [setNodes]
  );

  const deleteNode = useCallback(
    (nodeId) => {
      // Função recursiva para coletar todos os IDs dos nós a serem deletados
      const collectNodesToDelete = (currentId, accumulator = new Set()) => {
        accumulator.add(currentId);
        // Encontrar todos os filhos deste nó
        const childEdges = edges.filter((edge) => edge.source === currentId);
        // Recursivamente adicionar os filhos e seus descendentes
        childEdges.forEach((edge) => collectNodesToDelete(edge.target, accumulator));
        return accumulator;
      };

      // Coletar todos os nós que precisam ser deletados
      const nodesToDelete = collectNodesToDelete(nodeId);

      // Encontrar o nó pai se existir
      const parentEdge = edges.find((edge) => edge.target === nodeId);

      // Encontrar nós irmãos para manter foco
      let nodeToSelect = null;
      if (parentEdge) {
        // Se tem pai, encontrar todos os irmãos (incluindo o nó atual)
        const allSiblingEdges = edges.filter((edge) => edge.source === parentEdge.source);

        // Ordenar os irmãos pela posição Y
        const sortedSiblings = allSiblingEdges
          .map((edge) => ({
            id: edge.target,
            position: nodes.find((n) => n.id === edge.target)?.position.y || 0,
          }))
          .sort((a, b) => a.position - b.position);

        // Encontrar o índice do nó atual
        const currentIndex = sortedSiblings.findIndex((sibling) => sibling.id === nodeId);

        if (sortedSiblings.length > 1) {
          // Se há mais de um irmão (incluindo o atual)
          if (currentIndex > 0) {
            // Se não é o primeiro, pegar o anterior
            nodeToSelect = sortedSiblings[currentIndex - 1].id;
          } else {
            // Se é o primeiro, pegar o próximo
            nodeToSelect = sortedSiblings[1].id;
          }
        } else {
          nodeToSelect = parentEdge.source; // Se não há outros irmãos, selecionar o pai
        }
      }

      // Remover todos os nós coletados e suas conexões
      setNodes((nds) => {
        const updatedNodes = nds.filter((node) => !nodesToDelete.has(node.id));

        // Se tinha pai, reposicionar os irmãos restantes
        if (parentEdge) {
          return repositionChildren(parentEdge.source, updatedNodes, edges);
        }

        return updatedNodes;
      });

      setEdges((eds) =>
        eds.filter((edge) => !nodesToDelete.has(edge.source) && !nodesToDelete.has(edge.target))
      );

      // Manter foco em um nó relacionado
      if (nodeToSelect) {
        setSelectedNodes([nodeToSelect]);
      }
    },
    [edges, nodes, repositionChildren, setNodes, setEdges, setSelectedNodes]
  );

  // Memoizar os callbacks uma única vez
  const nodeCallbacks = useMemo(
    () => ({
      onTextChange: handleTextChange,
      onAddChild: addChildNode,
      onEditModeChange: handleEditModeChange,
      onCreateSibling: createSiblingNode,
      onCreateChild: createChild,
      onRemoveAutoEdit: removeAutoEdit,
      onRemoveForceEdit: removeForceEdit,
      onDeleteNode: deleteNode,
      onStyleChange: handleStyleChange,
    }),
    [] // Dependências vazias para memoizar apenas uma vez
  );

  // Atualizar os nós apenas na montagem do componente
  useEffect(() => {
    const updatedNodes = nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        ...nodeCallbacks,
      },
    }));
    setNodes(updatedNodes);
  }, []); // Executar apenas na montagem

  useEffect(() => {
    try {
      const dataToSave = {
        ...mindmap,
        nodes,
        edges,
        zoom,
        viewport,
      };
      store.set(storeIndex, dataToSave);
    } catch (error) {
      console.error("Erro ao salvar dados do mindmap:", error);
    }
  }, [nodes, edges, zoom, viewport, mindmap]);

  const deleteSelectedNodes = useCallback(() => {
    if (selectedNodes.length === 0) return;

    // Não permitir deletar se algum nó estiver em modo de edição
    const hasEditingNode = selectedNodes.some((nodeId) => editingNodes.has(nodeId));
    if (hasEditingNode) {
      return;
    }

    setNodes((nds) => {
      let updatedNodes = nds.filter((node) => !selectedNodes.includes(node.id));

      // Encontrar todos os nós pais que tiveram filhos removidos
      const parentIds = new Set();
      edges.forEach((edge) => {
        if (selectedNodes.includes(edge.target)) {
          parentIds.add(edge.source);
        }
      });

      // Reposicionar filhos de cada pai afetado
      parentIds.forEach((parentId) => {
        updatedNodes = repositionChildren(parentId, updatedNodes, edges);
      });

      return updatedNodes;
    });

    setEdges((eds) =>
      eds.filter(
        (edge) => !selectedNodes.includes(edge.source) && !selectedNodes.includes(edge.target)
      )
    );
    setSelectedNodes([]);
  }, [selectedNodes, editingNodes, edges, repositionChildren, setNodes, setEdges]);

  const handleKeyDown = useCallback(
    (event) => {
      // Se estivermos em modo de edição, não interceptar teclas globais
      if (editingNodes.size > 0) return;

      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        deleteSelectedNodes();
      } else if ((event.key === "Enter" || event.key === "F2") && selectedNodes.length === 1) {
        // Enter ou F2 com um nó selecionado: entrar no modo de edição
        event.preventDefault();
        enterEditMode(selectedNodes[0]);
      }
    },
    [deleteSelectedNodes, editingNodes, selectedNodes, enterEditMode]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const onConnect = useCallback(
    (params) => {
      // Encontrar quantos filhos o nó pai já tem
      const childCount = edges.filter((edge) => edge.source === params.source).length;
      const edgeWithStyle = {
        ...params,
        type: "smoothstep",
        style: { stroke: getEdgeColor(childCount) },
      };
      setEdges((eds) => addEdge(edgeWithStyle, eds));
    },
    [setEdges, edges, getEdgeColor]
  );

  const addNode = useCallback(() => {
    // Encontrar todos os nós que são pais (têm filhos)
    const parentNodeIds = new Set(edges.map((edge) => edge.source));
    const parentNodes = nodes.filter((node) => parentNodeIds.has(node.id));

    let newPosition;

    if (parentNodes.length > 0) {
      // Se existem nós pais, posicionar abaixo do último criado
      const lastParent = parentNodes.reduce((latest, current) => {
        // Assumindo que IDs mais recentes têm timestamps maiores
        const latestTime = latest.id.includes("node-") ? parseInt(latest.id.split("node-")[1]) : 0;
        const currentTime = current.id.includes("node-")
          ? parseInt(current.id.split("node-")[1])
          : 0;
        return currentTime > latestTime ? current : latest;
      });

      newPosition = {
        x: lastParent.position.x,
        y: lastParent.position.y + 150, // 150px abaixo do último pai
      };
    } else {
      // Se não há nós pais, posicionar abaixo de todos os nós existentes
      if (nodes.length > 0) {
        const bottomMostNode = nodes.reduce((lowest, current) =>
          current.position.y > lowest.position.y ? current : lowest
        );
        newPosition = {
          x: bottomMostNode.position.x,
          y: bottomMostNode.position.y + 150,
        };
      } else {
        // Se não há nós, usar posição padrão
        newPosition = { x: 250, y: 100 };
      }
    }

    const newNode = {
      id: `node-${Date.now()}`,
      type: "custom",
      position: newPosition,
      data: {
        label: "New Node",
        onTextChange: handleTextChange,
        onAddChild: addChildNode,
        onEditModeChange: handleEditModeChange,
        onCreateSibling: createSiblingNode,
        autoEdit: true, // Entrar automaticamente em modo de edição
        isBoxStyle: true, // Nós raiz são box por padrão
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [
    setNodes,
    handleTextChange,
    addChildNode,
    handleEditModeChange,
    createSiblingNode,
    nodes,
    edges,
  ]);

  const onSelectionChange = useCallback(({ nodes: selectedNodeObjects }) => {
    setSelectedNodes(selectedNodeObjects.map((node) => node.id));
  }, []);

  const onViewportChange = useCallback((newViewport) => {
    setViewport(newViewport);
    setZoom(newViewport.zoom);
  }, []);

  const onNodeDrag = useCallback(
    (event, node) => {
      // Função recursiva para coletar todos os descendentes de um nó
      const collectDescendants = (nodeId, accumulator = new Map()) => {
        // Encontrar filhos diretos
        const directChildren = edges
          .filter((edge) => edge.source === nodeId)
          .map((edge) => edge.target);

        // Para cada filho direto
        directChildren.forEach((childId) => {
          // Se ainda não processamos este filho
          if (!accumulator.has(childId)) {
            // Calcular nível (distância do nó original)
            const level =
              accumulator.get(nodeId)?.level !== undefined ? accumulator.get(nodeId).level + 1 : 1;

            // Adicionar ao mapa com seu nível
            accumulator.set(childId, {
              id: childId,
              level,
              parentId: nodeId,
            });

            // Recursivamente processar os filhos deste nó
            collectDescendants(childId, accumulator);
          }
        });

        return accumulator;
      };

      // Coletar todos os descendentes com seus níveis
      const descendants = collectDescendants(node.id);
      if (descendants.size === 0) return; // Se não tem descendentes, não fazer nada

      // Configurações de layout
      const horizontalOffset = 180;
      const verticalSpacing = 35;

      // Função para reposicionar um grupo de nós do mesmo nível
      const repositionNodesAtLevel = (parentId, nodesAtLevel) => {
        const parentNode = parentId === node.id ? node : nodes.find((n) => n.id === parentId);

        // Encontrar o nó DOM do pai para obter a altura real
        const parentElement = document.querySelector(`[data-id="${parentId}"]`);
        const parentHeight = parentElement?.getBoundingClientRect().height || 0;

        // Calcular o ponto central vertical do pai
        const parentCenterY = parentNode.position.y + parentHeight / 2;

        // Se há apenas um filho, alinhar diretamente com o centro do pai
        if (nodesAtLevel.length === 1) {
          nodesAtLevel[0].newPosition = {
            x: parentNode.position.x + horizontalOffset,
            y: parentCenterY,
          };
          return;
        }

        // Para múltiplos filhos, calcular o espaçamento
        const totalHeight = (nodesAtLevel.length - 1) * verticalSpacing;
        const startY = parentCenterY - totalHeight / 2;

        nodesAtLevel.forEach((childInfo, index) => {
          const childNode = nodes.find((n) => n.id === childInfo.id);
          if (childNode) {
            childInfo.newPosition = {
              x: parentNode.position.x + horizontalOffset,
              y: startY + index * verticalSpacing,
            };
          }
        });
      };

      // Agrupar descendentes por pai
      const descendantsByParent = new Map();
      descendants.forEach((info) => {
        if (!descendantsByParent.has(info.parentId)) {
          descendantsByParent.set(info.parentId, []);
        }
        descendantsByParent.get(info.parentId).push(info);
      });

      // Reposicionar cada grupo de nós
      descendantsByParent.forEach((children, parentId) => {
        repositionNodesAtLevel(parentId, children);
      });

      // Atualizar as posições de todos os nós
      setNodes((nds) =>
        nds.map((n) => {
          const descendantInfo = descendants.get(n.id);
          if (descendantInfo?.newPosition) {
            return {
              ...n,
              position: descendantInfo.newPosition,
            };
          }
          return n;
        })
      );
    },
    [edges, nodes, setNodes]
  );

  const onNodeDragStop = useCallback(
    (event, node) => {
      // Verificar se este nó é um filho (tem pai)
      const parentEdge = edges.find((edge) => edge.target === node.id);

      if (parentEdge) {
        // É um nó filho, precisa voltar para a posição relativa ao pai
        const parentNode = nodes.find((n) => n.id === parentEdge.source);
        if (!parentNode) return;

        // Encontrar todos os irmãos (outros filhos do mesmo pai)
        const siblingIds = edges
          .filter((edge) => edge.source === parentEdge.source)
          .map((edge) => edge.target);

        const siblings = nodes.filter((n) => siblingIds.includes(n.id));

        // Configurações de layout
        const horizontalOffset = 180; // Distância à direita do pai
        const verticalSpacing = 35; // Espaçamento vertical entre filhos

        // Calcular a nova ordem baseada na posição Y onde foi solto
        const draggedY = node.position.y;

        // Criar lista de irmãos ordenados pela posição Y atual (excluindo o nó arrastado)
        const otherSiblings = siblings.filter((sibling) => sibling.id !== node.id);
        otherSiblings.sort((a, b) => a.position.y - b.position.y);

        // Determinar onde inserir o nó arrastado na nova ordem
        let newIndex = 0;
        for (let i = 0; i < otherSiblings.length; i++) {
          if (draggedY < otherSiblings[i].position.y) {
            break;
          }
          newIndex = i + 1;
        }

        // Criar a nova ordem inserindo o nó arrastado na posição correta
        const reorderedSiblings = [...otherSiblings];
        reorderedSiblings.splice(newIndex, 0, { ...node });

        // Calcular posições para a nova ordem
        const totalHeight = (reorderedSiblings.length - 1) * verticalSpacing;
        const startY = parentNode.position.y - totalHeight / 2;

        // Reposicionar todos os irmãos na nova ordem
        setNodes((nds) =>
          nds.map((n) => {
            const siblingIndex = reorderedSiblings.findIndex((sibling) => sibling.id === n.id);
            if (siblingIndex !== -1) {
              return {
                ...n,
                position: {
                  x: parentNode.position.x + horizontalOffset,
                  y: startY + siblingIndex * verticalSpacing,
                },
              };
            }
            return n;
          })
        );
      }
    },
    [edges, nodes, setNodes]
  );

  const { addMinimizedWindow, removeMinimizedWindow } = useWindow();

  const toggleMinimize = (e) => {
    e.stopPropagation();
    const newIsMinimized = !mindmap.isMinimized;
    setMindmap((prev) => ({ ...prev, isMinimized: newIsMinimized }));

    // Se estiver em tela cheia e minimizar, sai da tela cheia
    if (isFullscreen) {
      setIsFullscreen(false);
    }

    if (newIsMinimized) {
      addMinimizedWindow({
        id: "mindmap",
        type: "mindmap",
        title: "Mind Map",
        isMinimized: true,
      });
    } else {
      removeMinimizedWindow("mindmap");
    }
  };

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    setIsFullscreen(!isFullscreen);
    // Se estiver minimizado e maximizar, desminimiza
    if (isMinimized) {
      setMindmap((prev) => ({ ...prev, isMinimized: false }));
    }
  };

  const close = (e) => {
    e.stopPropagation();
    setMindmap((prev) => ({ ...prev, isClosed: !prev.isClosed }));
  };

  const dragStart = (e) => {
    const rect = ref.current.getBoundingClientRect();
    offset.current.x = e.clientX - rect.left;
    offset.current.y = e.clientY - rect.top;
    e.dataTransfer.setData("text/plain", "");
  };

  const dragNote = (e) => {
    const x = e.pageX;
    const y = e.pageY;
    if (!x || !y) return;

    const newX = `${x - offset.current.x}px`;
    const newY = `${y - offset.current.y}px`;

    setMindmap((prev) => ({ ...prev, x: newX, y: newY }));
  };

  const handleResizeStart = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const edgeSize = 10;

    const isNearRightEdge = e.clientX > rect.right - edgeSize;
    const isNearBottomEdge = e.clientY > rect.bottom - edgeSize;

    if (isNearRightEdge || isNearBottomEdge) {
      isResizing.current = true;
      resizeStartPos.current = { x: e.clientX, y: e.clientY };
      resizeStartSize.current = { width: rect.width, height: rect.height };
      e.preventDefault();
    }
  };

  const handleResizeMove = (e) => {
    if (!isResizing.current) return;

    const deltaX = e.clientX - resizeStartPos.current.x;
    const deltaY = e.clientY - resizeStartPos.current.y;

    const newWidth = Math.max(400, resizeStartSize.current.width + deltaX);
    const newHeight = Math.max(300, resizeStartSize.current.height + deltaY);

    setMindmap((prev) => ({
      ...prev,
      width: `${newWidth}px`,
      height: `${newHeight}px`,
    }));
  };

  const handleResizeEnd = () => {
    isResizing.current = false;
  };

  const [isFullscreen, setIsFullscreen] = useState(false);
  const { x, y, isMinimized, isClosed, width, height } = mindmap;

  return (
    <>
      <div
        ref={ref}
        style={{
          ...(isFullscreen
            ? {
                position: "fixed",
                left: 0,
                top: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 9999,
              }
            : {
                left: x,
                top: y,
                ...(isMinimized ? {} : { width: width, height: height }),
              }),
        }}
        className={classNames(css.wrapper, {
          [css.minimized]: isMinimized,
          [css.closed]: isClosed,
        })}
        draggable="true"
        onDragStart={dragStart}
        onDrag={dragNote}
        onMouseDown={handleResizeStart}
        onMouseMove={handleResizeMove}
        onMouseUp={handleResizeEnd}
        onMouseLeave={handleResizeEnd}
      >
        <div className={css.windowActions}>
          <span className={css.title}>Mind Map</span>
          <div className={css.windowButtons}>
            <Icon name={isMinimized ? "Crop32" : "Remove"} color="white" onClick={toggleMinimize} />
            <Icon
              name={isFullscreen ? "CropDin" : "AspectRatio"}
              color="white"
              onClick={toggleFullscreen}
            />
            <Icon name="Close" color="red" onClick={() => close()} />
          </div>
        </div>
        <div className={css.mindmapWrapper}>
          {!isMinimized && (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onViewportChange={onViewportChange}
              onNodeDrag={onNodeDrag}
              onNodeDragStop={onNodeDragStop}
              defaultViewport={viewport}
              attributionPosition="bottom-left"
              onSelectionChange={onSelectionChange}
              nodeTypes={{ custom: CustomNode }}
              preventScrolling={false}
              onPaneClick={() => {
                setSelectedNodes([]);
                // Encontrar qualquer node em modo de edição e forçar a saída do modo de edição
                nodes.forEach((node) => {
                  if (node.data.forceEdit || node.data.autoEdit) {
                    if (node.data.onRemoveForceEdit) {
                      node.data.onRemoveForceEdit(node.id);
                    }
                    if (node.data.onRemoveAutoEdit) {
                      node.data.onRemoveAutoEdit(node.id);
                    }
                  }
                });
              }}
            >
              <Controls />
              <Background />
              <Panel position="top-right">
                <button className={css.addNodeButton} onClick={addNode}>
                  Add Node
                </button>
              </Panel>
            </ReactFlow>
          )}
        </div>
      </div>
    </>
  );
};
