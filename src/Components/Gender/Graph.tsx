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
import "reactflow/dist/style.css";

import { RootStoreI } from "../../Store";
import { setSelectedEventVerbStart } from "../../Slices/TabSlice";
import { EventI } from "../../Slices/DataSlice";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 0;
const nodeHeight = 0;

const getLayoutGraph = (
  eventListInput: EventI[],
  setVerbStart: (targetSelectedEventVerbStart: number | null) => {
    payload: number | null;
    type: string;
  }
) => {
  let eventList = JSON.parse(JSON.stringify(eventListInput)) as EventI[];

  const eventsMap: Record<number, boolean> = {};
  eventList.sort((a, b) => {
    return a.temporalRank - b.temporalRank;
  });

  eventList = eventList
    .map((event) => {
      if (event && eventsMap[event.temporalRank]) {
        return undefined;
      } else if (event) {
        eventsMap[event.temporalRank] = true;
        return event;
      } else {
        return undefined;
      }
    })
    .filter((event) => {
      return event !== undefined;
    }) as EventI[];

  // Get Salient Event using salientInfoMap

  dagreGraph.setGraph({ rankdir: "LR" });

  const nodes: any[] = [];
  const edges: any[] = [];

  const ROW_COUNT_LIMIT = 6;
  const X_INIT_POS = 10;
  const Y_INIT_POS = 10;
  const X_SPACE = 200;
  const Y_SPACE = 100;

  let currentX = X_INIT_POS;
  let currentY = Y_INIT_POS;

  eventList.forEach((item, index) => {
    const nodeToBeAdded = {
      id: `${index}`,
      targetPosition: "left",
      sourcePosition: "right",
      data: {
        label: (
          <span
            tabIndex={0}
            onFocus={() => setVerbStart(item.verbStartByteText)}
            onBlur={() => setVerbStart(null)}
            style={{
              backgroundColor: "transparent",
              fontSize: "24px",
              color: "white",
            }}
          >{`${item.event}-${item.temporalRank}`}</span>
        ),
        eventVerbStart: item.verbStartByteText,
      },

      style: {
        backgroundColor:
          item.gender === "male"
            ? "silver"
            : item.gender === "female"
            ? "silver"
            : "silver",
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
        //label: `${occurrenceMap[parentId].occurrenceText}=>${occurrenceMap[childId].occurrenceText}`,
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

const ReactiveGraph = ({ eventList }: { eventList: EventI[] }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);

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
  }, [nodes.length, reactFlowInstance]);

  useEffect(() => {
    const { nextNodes, nextEdges } = getLayoutGraph(
      eventList,
      (targetSelectedEventVerbStart: number | null) =>
        dispatch(setSelectedEventVerbStart(targetSelectedEventVerbStart))
    );
    setNodes(nextNodes);
    setEdges(nextEdges);
  }, [eventList, setNodes, setEdges, dispatch]);

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
    <React.Fragment>
      <div className="directed--graph--gender">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={onInit}
          onConnect={onConnect}
          connectionLineType={ConnectionLineType.Straight}
          attributionPosition="top-right"
          fitView
        >
          <Background color="#aaa" gap={16} />
          <Controls></Controls>
          <Panel position="bottom-right" className="graph-legend">
            <GraphLegend></GraphLegend>
          </Panel>
        </ReactFlow>
      </div>
    </React.Fragment>
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
