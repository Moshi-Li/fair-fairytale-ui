import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
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
  Panel,
} from "reactflow";

import { RootStoreI } from "../../Store";
import { setSelectedEventVerbStart } from "../../Slices/TabSlice";
import { EventI } from "../../Slices/DataSlice";

import "reactflow/dist/style.css";

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
  color: string,
  setVerbStart: (targetSelectedEventVerbStart: number | null) => {
    payload: number | null;
    type: string;
  }
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
            tabIndex={0}
            onFocus={() => setVerbStart(item.verbStartByteText)}
            onBlur={() => setVerbStart(null)}
            style={{
              backgroundColor: "transparent",
              fontSize: "24px",
              color: "black",
            }}
          >{`${item.event}`}</span>
        ),
        eventVerbStart: item.verbStartByteText,
      },
      style: {
        backgroundColor: color,
        borderRadius:
          color === "grey" ? "0%" : item.argument === "subject" ? "0%" : "50%",
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

const GraphLegend = () => {
  return (
    <div className="graph--legend--container">
      <div className="graph--legend--row">
        <span>Agent:</span>
        <div></div>
      </div>
      <div className="graph--legend--row">
        <span>Patient:</span>
        <div style={{ borderRadius: "50%" }}></div>
      </div>
    </div>
  );
};

const onInit = (reactFlowInstance: any) =>
  console.log("flow loaded:", reactFlowInstance);

const ReactiveGraph = ({
  eventList,
  color,
}: {
  eventList: EventI[];
  color: string;
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<{
    label: JSX.Element;
    eventVerbStart: number;
  }>([]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { selectedEventVerbStart } = useSelector(
    (store: RootStoreI) => store.tabReducer
  );

  const dispatch = useDispatch();

  const reactFlowInstance = useReactFlow();

  useEffect(() => {
    setTimeout(() => {
      reactFlowInstance.fitView();
    }, 100);
  }, [color, reactFlowInstance]);

  useEffect(() => {
    const { nextNodes, nextEdges } = getLayoutGraph(
      eventList,
      color,
      (targetSelectedEventVerbStart: number | null) =>
        dispatch(setSelectedEventVerbStart(targetSelectedEventVerbStart))
    );
    setNodes(nextNodes);
    setEdges(nextEdges);
  }, [eventList, setNodes, setEdges, color, dispatch]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        node.selected = node.data.eventVerbStart === selectedEventVerbStart;
        return node;
      })
    );
    reactFlowInstance.fitView();
  }, [selectedEventVerbStart, setNodes, reactFlowInstance]);

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
        <Panel position="bottom-right" className="graph-legend">
          <GraphLegend></GraphLegend>
        </Panel>
      </ReactFlow>
    </div>
  );
};

const Graph = ({
  eventList,
  color,
}: {
  eventList: EventI[];
  color: string;
}) => {
  return (
    <ReactFlowProvider>
      <ReactiveGraph color={color} eventList={eventList}></ReactiveGraph>
    </ReactFlowProvider>
  );
};

export default Graph;
