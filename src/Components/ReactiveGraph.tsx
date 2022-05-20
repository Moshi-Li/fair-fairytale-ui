import React, { useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import dagre from "dagre";

import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  ConnectionLineType,
} from "react-flow-renderer";

import { OccurrenceI } from "../Slices/DataSlice";
import { RootStoreI, useAppDispatch } from "../Store";
import { updateAnimationOccurrences } from "../Slices/AnimationSlice";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutGraph = (
  occurrences: OccurrenceI[],
  occurrenceMap: Record<string | number, OccurrenceI>,
  dispatchAction: any
) => {
  dagreGraph.setGraph({ rankdir: "LR" });

  const nodes: any[] = [];
  occurrences.forEach((item: OccurrenceI, index: number) => {
    const nodeToBeAdded = {
      id: `${item.id}`,

      data: {
        label: (
          <span
            style={{ backgroundColor: "transparent" }}
            onDoubleClick={() => dispatchAction(item.id)}
          >{`${item.occurrenceText}`}</span>
        ),
      },
      position: { x: 0, y: 0 },
    };
    nodes.push(nodeToBeAdded);
  });

  const edges: any[] = [];
  const visitedOccurrences: Record<string | number, boolean> = {};
  const occurrenceBuffer: number[] = occurrences.map((item) => item.id);

  while (occurrenceBuffer.length) {
    const parentId = occurrenceBuffer.pop();

    if (
      parentId !== undefined &&
      visitedOccurrences[parentId] === undefined &&
      occurrenceMap[parentId] !== undefined
    ) {
      occurrenceMap[parentId].nextOccurrenceId.forEach((childId: number) => {
        let edgeToBeAdded = {
          id: `e${parentId}-${childId}`,
          source: `${parentId}`,
          target: `${childId}`,
          animated: true,
          //label: `${occurrenceMap[parentId].occurrenceText}=>${occurrenceMap[childId].occurrenceText}`,
        };
        edges.push(edgeToBeAdded);

        if (visitedOccurrences[childId] === undefined) {
          occurrenceBuffer.push(childId);
        }
      });
      visitedOccurrences[parentId] = true;
    }
  }

  // Dagre Operation

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = "left";
    node.sourcePosition = "right";

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

const onInit = (reactFlowInstance: any) =>
  console.log("flow loaded:", reactFlowInstance);

const ReactiveGraph = () => {
  const appDispatchAction = useAppDispatch();

  const { animatedOccurrence } = useSelector(
    (store: RootStoreI) => store.animationReducer
  );

  const { occurrenceMap } = useSelector(
    (store: RootStoreI) => store.dataReducer
  );

  const { occurrences } = useSelector(
    (store: RootStoreI) => store.dataReducer.characters
  );

  const { occurrenceHighlightColor } = useSelector(
    (store: RootStoreI) => store.filterReducer
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(
    getLayoutGraph(occurrences, occurrenceMap, (id: string | number) =>
      appDispatchAction(updateAnimationOccurrences(id))
    ).nodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    getLayoutGraph(occurrences, occurrenceMap, (id: string | number) =>
      appDispatchAction(updateAnimationOccurrences(id))
    ).edges
  );

  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) => {
        node.style = {
          ...node.style,
          backgroundColor: animatedOccurrence[node.id]
            ? occurrenceHighlightColor[node.id]
            : "white",
        };
        return node;
      })
    );
  }, [animatedOccurrence, setNodes, occurrenceHighlightColor]);

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds
        )
      ),
    [setEdges]
  );

  return (
    <React.Fragment>
      <div className="directed--graph">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={onInit}
          onConnect={onConnect}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          attributionPosition="top-right"
        >
          <Background color="#aaa" gap={16} />
          <Controls></Controls>
        </ReactFlow>
      </div>
    </React.Fragment>
  );
};

export default ReactiveGraph;
