import React, { useState, Dispatch, SetStateAction } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
} from "react-flow-renderer";

import { OccurrenceI } from "../MockData";

const getNodesFromOccurrences = (
  occurrences: OccurrenceI[],
  requestAnimation: (id: string) => void,
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
            onDoubleClick={() => {
              requestAnimation(`${item.id}`);
            }}
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

const ReactiveGraph = ({
  occurrences,
  occurrenceMap,
  animatedOccurrenceId,
  setAnimatedOccurrenceId,
}: {
  occurrences: OccurrenceI[];
  occurrenceMap: Record<string | number, OccurrenceI>;
  animatedOccurrenceId: Record<string | number, boolean | undefined>;
  setAnimatedOccurrenceId: Dispatch<
    SetStateAction<Record<string | number, boolean | undefined>>
  >;
}) => {
  const [animationType, setAnimationType] = useState("self");
  const requestAnimation = (id: string) => {
    setAnimatedOccurrenceId({ [id]: true });
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(
    getNodesFromOccurrences(occurrences, requestAnimation)
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    getEdgesFromOccurrences(occurrences, occurrenceMap)
  );
  const onConnect = (params: any) => setEdges((eds) => addEdge(params, eds));

  return (
    <React.Fragment>
      <div className="graph--selector">
        <label>
          <input
            type="radio"
            value="self"
            checked={animationType === "self"}
            onChange={(e) => {
              setAnimationType(e.target.value);
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
              setAnimationType(e.target.value);
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
        </ReactFlow>
      </div>
    </React.Fragment>
  );
};

export { getEdgesFromOccurrences, getNodesFromOccurrences };
export default ReactiveGraph;
