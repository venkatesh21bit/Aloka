/**
 * Minimal directed graph — TypeScript port of kassi/graphrag/digraph.py
 *
 * Zero external dependencies. Implements only what CIPipelineGraph and
 * CISubgraphRetriever need: addNode, addEdge, hasNode, getNode,
 * nodesWithData, edgesFrom, numberOfNodes, numberOfEdges.
 */
export declare class DiGraph {
    private _nodes;
    private _adj;
    addNode(id: string, attrs?: Record<string, unknown>): void;
    addEdge(source: string, target: string, attrs?: Record<string, unknown>): void;
    hasNode(id: string): boolean;
    hasEdge(source: string, target: string): boolean;
    getNode(id: string): Record<string, unknown> | undefined;
    /** Iterate all nodes with their attribute dict — equivalent to G.nodes(data=True) in kassi. */
    nodesWithData(): [string, Record<string, unknown>][];
    /** Outgoing edges from a node — equivalent to G.edges(node, data=True) in kassi. */
    edgesFrom(node: string): {
        target: string;
        attrs: Record<string, unknown>;
    }[];
    numberOfNodes(): number;
    numberOfEdges(): number;
    /** Return node IDs filtered by type attribute. */
    nodesByType(type: string): string[];
}
//# sourceMappingURL=digraph.d.ts.map