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
const ROW_COUNT_LIMIT = 6;
const X_INIT_POS = 10;
const Y_INIT_POS = 10;
const X_SPACE = 200;
const Y_SPACE = 100;

const getLayoutGraph = (
  eventListInput: EventI[],
  setSelectedEventVerbStart: React.Dispatch<
    React.SetStateAction<number | null>
  >,
  color: string
) => {
  let eventList = JSON.parse(JSON.stringify(eventListInput)) as EventI[];

  eventList.sort((a, b) => {
    return a.temporalRank - b.temporalRank;
  });

  // Get Salient Event using salientInfoMap

  dagreGraph.setGraph({ rankdir: "LR" });

  const nodes: any[] = [];
  const edges: any[] = [];

  let currentX = X_INIT_POS;
  let currentY = Y_INIT_POS;

  eventList.forEach((item, index) => {
    const nodeToBeAdded = {
      id: `${index}`,
      data: {
        label: (
          <span
            onClick={() => setSelectedEventVerbStart(item.verbStartByteText)}
            style={{
              backgroundColor: "transparent",
              fontSize: "32px",
              color: "black",
            }}
          >{`${item.event}`}</span>
        ),
      },
      style: {
        backgroundColor: color,
        borderRadius: item.argument === "subject" ? "0%" : "50%",
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

const ReactiveGraph = ({
  eventList,
  setSelectedEventVerbStart,
  color,
}: {
  eventList: EventI[];
  setSelectedEventVerbStart: React.Dispatch<
    React.SetStateAction<number | null>
  >;
  color: string;
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const { nextNodes, nextEdges } = getLayoutGraph(
      eventList,
      setSelectedEventVerbStart,
      color
    );
    setNodes(nextNodes);
    setEdges(nextEdges);
  }, [eventList, setNodes, setEdges]);

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
    <div className="directed--graph--character">
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

const Graph = ({
  eventList,
  setSelectedEventVerbStart,
  color,
}: {
  eventList: EventI[];
  setSelectedEventVerbStart: React.Dispatch<
    React.SetStateAction<number | null>
  >;
  color: string;
}) => {
  return (
    <ReactFlowProvider>
      <ReactiveGraph
        color={color}
        eventList={eventList}
        setSelectedEventVerbStart={setSelectedEventVerbStart}
      ></ReactiveGraph>
    </ReactFlowProvider>
  );
};

export default Graph;
