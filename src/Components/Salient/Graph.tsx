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

import { EventI, EventSalientInfoI } from "../../Slices/DataSlice";
import { RootStoreI, useAppDispatch } from "../../Store";
import { updateAnimationOccurrences } from "../../Slices/AnimationSlice";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutGraph = (
  eventListInput: EventI[],
  eventSalientInfo: EventSalientInfoI[]
) => {
  let eventList = JSON.parse(JSON.stringify(eventListInput)) as EventI[];

  const salientInfoMap: any = {};
  eventSalientInfo.forEach(
    (info) =>
      (salientInfoMap[info.sentenceId] = { [info.eventId]: info.temporalRank })
  );
  console.log(eventList.filter((item) => item.sentenceId === "2"));
  // Get Salient Event using salientInfoMap
  eventList = eventList
    .filter((event) => {
      return (
        salientInfoMap[event.sentenceId] &&
        salientInfoMap[event.sentenceId][event.eventId] &&
        event.argument === "subject"
      );
    })
    .map((event) => {
      return {
        ...event,
        temporalRank: salientInfoMap[event.sentenceId][event.eventId],
      };
    });
  eventList.sort((a, b) => a.temporalRank - b.temporalRank);

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
      id: `${item.temporalRank}`,

      data: {
        label: (
          <span
            style={{ backgroundColor: "transparent", fontSize: "32px" }}
          >{`${item.event}`}</span>
        ),
      },
      style: { backgroundColor: item.gender === "male" ? "blue" : "red" },
      position: { x: currentX, y: currentY },
    };
    nodes.push(nodeToBeAdded);
    currentX = currentX + X_SPACE;
    if (currentX > X_SPACE * ROW_COUNT_LIMIT) {
      currentX = X_INIT_POS;
      currentY = currentY + Y_SPACE;
    }

    if (index > 0) {
      const edgeToBeAdded = {
        id: `e${item.temporalRank}-${item.temporalRank - 1}`,
        source: `${item.temporalRank}`,
        target: `${item.temporalRank - 1}`,
        animated: false,
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

  return { nodes, edges };
};

const onInit = (reactFlowInstance: any) =>
  console.log("flow loaded:", reactFlowInstance);

const ReactiveGraph = () => {
  const appDispatchAction = useAppDispatch();

  const { eventList, eventSalientInfo } = useSelector(
    (store: RootStoreI) => store.dataReducer
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(
    getLayoutGraph(eventList, eventSalientInfo).nodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    getLayoutGraph(eventList, eventSalientInfo).edges
  );

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
