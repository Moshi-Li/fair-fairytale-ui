import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
} from "react-flow-renderer";

import { OccurrenceI } from "../Slices/DataSlice";
import { RootStoreI, useAppDispatch } from "../Store";
import {
  updateAnimationOccurrences,
  updateAnimationType,
} from "../Slices/AnimationSlice";

const getNodesFromOccurrences = (
  occurrences: OccurrenceI[],
  dispatchAction: any,
  initialX: number = 0,
  initialY: number = 0
) => {
  const nodes: any[] = [];

  occurrences.forEach((item: OccurrenceI, index: number) => {
    const nodeToBeAdded = {
      id: `${item.id}`,

      data: {
        label: (
          <span
            onDoubleClick={() => dispatchAction(item.id)}
          >{`${item.occurrenceText}`}</span>
        ),
      },
      position: { x: initialX + index * 50, y: initialY + index * 50 },
    };
    nodes.push(nodeToBeAdded);
  });
  return nodes;
};

const getEdgesFromOccurrences = (
  occurrences: OccurrenceI[],
  occurrenceMap: Record<string | number, OccurrenceI>
) => {
  // Generate Edges Using BFS
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
          label: `${occurrenceMap[parentId].occurrenceText}=>${occurrenceMap[childId].occurrenceText}`,
        };
        edges.push(edgeToBeAdded);

        if (visitedOccurrences[childId] === undefined) {
          occurrenceBuffer.push(childId);
        }
      });
      visitedOccurrences[parentId] = true;
    }
  }
  //console.log(edges);
  return edges;
};

const onInit = (reactFlowInstance: any) =>
  console.log("flow loaded:", reactFlowInstance);

const ReactiveGraph = () => {
  const dispatchAction = useDispatch();
  const appDispatchAction = useAppDispatch();

  const { animationType, animatedOccurrence } = useSelector(
    (store: RootStoreI) => store.animationReducer
  );
  const { characters, occurrenceMap } = useSelector(
    (store: RootStoreI) => store.dataReducer
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(
    getNodesFromOccurrences(characters.occurrences, (id: string | number) =>
      appDispatchAction(updateAnimationOccurrences(id))
    )
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    getEdgesFromOccurrences(characters.occurrences, occurrenceMap)
  );
  const onConnect = (params: any) => setEdges((eds) => addEdge(params, eds));

  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) => {
        node.style = {
          ...node.style,
          backgroundColor: animatedOccurrence[node.id] ? "red" : "white",
        };
        return node;
      })
    );
  }, [animatedOccurrence]);

  return (
    <React.Fragment>
      <div className="graph--selector">
        <label>
          <input
            type="radio"
            value="self"
            checked={animationType === "self"}
            onChange={(e) => {
              dispatchAction(updateAnimationType(e.target.value));
            }}
          />
          Color Self
        </label>
        <label>
          <input
            type="radio"
            value="relative"
            checked={animationType === "relative"}
            onChange={(e) => {
              dispatchAction(updateAnimationType(e.target.value));
            }}
          />
          Color Relatives
        </label>
      </div>
      <div className="directed--graph">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={onInit}
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

export { getEdgesFromOccurrences, getNodesFromOccurrences };
export default ReactiveGraph;
