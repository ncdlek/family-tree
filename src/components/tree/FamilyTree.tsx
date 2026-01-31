"use client";

import React, { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { Person } from "@/types";
import { PersonCard } from "./PersonCard";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface FamilyTreeProps {
  people: Person[];
  onPersonClick: (person: Person) => void;
  className?: string;
}

const nodeTypes: NodeTypes = {
  person: PersonCard,
};

export function FamilyTree({ people, onPersonClick, className }: FamilyTreeProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Build tree layout from people data
  const { layoutNodes, layoutEdges } = useMemo(() => {
    if (people.length === 0) return { layoutNodes: [], layoutEdges: [] };

    const personMap = new Map(people.map((p) => [p.id, p]));
    const processedNodes = new Set<string>();
    const nodesArr: Node[] = [];
    const edgesArr: Edge[] = [];

    // Helper to get generation level
    const getGeneration = (personId: string, visited = new Set<string>()): number => {
      if (visited.has(personId)) return 0;
      visited.add(personId);

      const person = personMap.get(personId);
      if (!person) return 0;

      if (person.fatherId) {
        return 1 + getGeneration(person.fatherId, visited);
      }
      if (person.motherId) {
        return 1 + getGeneration(person.motherId, visited);
      }
      return 0;
    };

    // Group people by generation
    const generations = new Map<number, Person[]>();
    people.forEach((person) => {
      if (!processedNodes.has(person.id)) {
        const gen = getGeneration(person.id);
        if (!generations.has(gen)) generations.set(gen, []);
        generations.get(gen)!.push(person);
        processedNodes.add(person.id);
      }
    });

    // Calculate node positions
    const generationHeight = 200;
    const nodeWidth = 200;
    const horizontalGap = 50;

    const sortedGenerations = Array.from(generations.entries()).sort((a, b) => a[0] - b[0]);

    sortedGenerations.forEach(([gen, genPeople]) => {
      const rowWidth = genPeople.length * nodeWidth + (genPeople.length - 1) * horizontalGap;
      const startX = -rowWidth / 2;

      genPeople.forEach((person, idx) => {
        const x = startX + idx * (nodeWidth + horizontalGap) + nodeWidth / 2;
        const y = gen * generationHeight;

        nodesArr.push({
          id: person.id,
          type: "person",
          position: { x, y },
          data: {
            person,
            onPersonClick,
          },
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        });
      });
    });

    // Create edges for parent-child relationships
    people.forEach((person) => {
      if (person.fatherId && personMap.has(person.fatherId)) {
        edgesArr.push({
          id: `${person.fatherId}-${person.id}`,
          source: person.fatherId,
          target: person.id,
          type: "smoothstep",
          animated: false,
          style: { stroke: "#3b82f6", strokeWidth: 2 },
        });
      }
      if (person.motherId && personMap.has(person.motherId)) {
        edgesArr.push({
          id: `${person.motherId}-${person.id}`,
          source: person.motherId,
          target: person.id,
          type: "smoothstep",
          animated: false,
          style: { stroke: "#ec4899", strokeWidth: 2 },
        });
      }
    });

    return { layoutNodes: nodesArr, layoutEdges: edgesArr };
  }, [people, onPersonClick]);

  // Update nodes and edges when layout changes
  React.useEffect(() => {
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [layoutNodes, layoutEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleZoomIn = () => {
    // Zoom in functionality
    const event = new KeyboardEvent("keydown", { key: "+" });
    window.dispatchEvent(event);
  };

  const handleZoomOut = () => {
    // Zoom out functionality
    const event = new KeyboardEvent("keydown", { key: "-" });
    window.dispatchEvent(event);
  };

  const handleFitView = () => {
    // Fit view to show all nodes
    const event = new KeyboardEvent("keydown", { key: "f" });
    window.dispatchEvent(event);
  };

  const handleExport = () => {
    // Export as image
    const element = document.querySelector(".react-flow");
    if (element) {
      // Simple export - in production use html-to-image
      console.log("Export tree as image");
    }
  };

  return (
    <div className={cn("w-full h-full", className)}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const person = node.data.person as Person;
            if (person.gender === "MALE") return "#3b82f6";
            if (person.gender === "FEMALE") return "#ec4899";
            return "#8b5cf6";
          }}
        />
      </ReactFlow>

      {/* Custom toolbar */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button size="icon" variant="secondary" onClick={handleZoomIn} title="Zoom In">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" onClick={handleZoomOut} title="Zoom Out">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" onClick={handleFitView} title="Fit View">
          <Maximize className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" onClick={handleExport} title="Export">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
