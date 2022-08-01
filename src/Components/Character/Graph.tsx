import React, { useEffect, useCallback, useMemo } from "react";

import dagre from "dagre";

import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  ConnectionLineType,
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
} from "react-flow-renderer";

import { EventI } from "../../Slices/DataSlice";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutGraph = (eventListInput: EventI[]) => {
  let eventList = JSON.parse(JSON.stringify(eventListInput)) as EventI[];

  eventList.sort((a, b) => {
    return a.temporalRank - b.temporalRank;
  });

  // Get Salient Event using salientInfoMap

  dagreGraph.setGraph({ rankdir: "LR" });

  const nodes: any[] = [];
  const edges: any[] = [];

  const ROW_COUNT_LIMIT = 10;
  const X_INIT_POS = 10;
  const Y_INIT_POS = 10;
  const X_SPACE = 200;
  const Y_SPACE = 100;

  let currentX = X_INIT_POS;
  let currentY = Y_INIT_POS;

  eventList.forEach((item, index) => {
    const nodeToBeAdded = {
      id: `${index}`,

      data: {
        label: (
          <span
            style={{
              backgroundColor: "transparent",
              fontSize: "32px",
              color: "white",
            }}
          >{`${item.event}`}</span>
        ),
      },
      style: {
        backgroundColor:
          item.gender === "male"
            ? "blue"
            : item.gender === "female"
            ? "red"
            : "silver",
      },
      position: { x: currentX, y: currentY },
    };
    nodes.push(nodeToBeAdded);

    currentX = currentX + X_SPACE;
    if (currentX > X_SPACE * ROW_COUNT_LIMIT) {
      currentX = X_INIT_POS;
      currentY = currentY + Y_SPACE;
    }
    if (index < eventList.length - 1) {
      const edgeToBeAdded = {
        id: `e${index}-${index + 1}`,
        source: `${index}`,
        target: `${index + 1}`,
        animated: false,

        type: "straight",
        markerEnd: {
          type: MarkerType.Arrow,
        },
      };
      edges.push(edgeToBeAdded);
    }
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  //dagre.layout(dagreGraph);

  return { nextNodes: nodes, nextEdges: edges };
};

const onInit = (reactFlowInstance: any) =>
  console.log("flow loaded:", reactFlowInstance);

const ReactiveGraph = ({ eventList }: { eventList: EventI[] }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  useEffect(() => {
    const { nextNodes, nextEdges } = getLayoutGraph(eventList);
    setNodes(nextNodes);
    setEdges(nextEdges);
  }, [eventList, setNodes, setEdges]);
  useEffect(() => {
    fitView();
  }, [nodes, fitView]);

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.Straight, animated: true },
          eds
        )
      ),
    [setEdges]
  );

  return (
    <div className="directed--graph">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={onInit}
        onConnect={onConnect}
        connectionLineType={ConnectionLineType.Straight}
        fitView
        attributionPosition="top-right"
      >
        <Background color="#aaa" gap={16} />
        <Controls></Controls>
      </ReactFlow>
    </div>
  );
};

const Graph = ({ eventList }: { eventList: EventI[] }) => {
  return (
    <ReactFlowProvider>
      <ReactiveGraph eventList={eventList}></ReactiveGraph>
    </ReactFlowProvider>
  );
};

export default Graph;
