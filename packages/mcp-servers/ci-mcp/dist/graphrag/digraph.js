/**
 * Minimal directed graph — TypeScript port of kassi/graphrag/digraph.py
 *
 * Zero external dependencies. Implements only what CIPipelineGraph and
 * CISubgraphRetriever need: addNode, addEdge, hasNode, getNode,
 * nodesWithData, edgesFrom, numberOfNodes, numberOfEdges.
 */
export class DiGraph {
    _nodes = new Map();
    _adj = new Map();
    addNode(id, attrs = {}) {
        if (this._nodes.has(id)) {
            // Merge new attrs into existing node (same as kassi: update on duplicate)
            const existing = this._nodes.get(id);
            this._nodes.set(id, { ...existing, ...attrs });
        }
        else {
            this._nodes.set(id, { ...attrs });
            this._adj.set(id, new Map());
        }
    }
    addEdge(source, target, attrs = {}) {
        // Auto-create nodes if absent (mirrors kassi's setdefault behaviour)
        if (!this._nodes.has(source))
            this._nodes.set(source, {});
        if (!this._nodes.has(target))
            this._nodes.set(target, {});
        if (!this._adj.has(source))
            this._adj.set(source, new Map());
        if (!this._adj.has(target))
            this._adj.set(target, new Map());
        this._adj.get(source).set(target, { ...attrs });
    }
    hasNode(id) {
        return this._nodes.has(id);
    }
    hasEdge(source, target) {
        return this._adj.get(source)?.has(target) ?? false;
    }
    getNode(id) {
        return this._nodes.get(id);
    }
    /** Iterate all nodes with their attribute dict — equivalent to G.nodes(data=True) in kassi. */
    nodesWithData() {
        return Array.from(this._nodes.entries());
    }
    /** Outgoing edges from a node — equivalent to G.edges(node, data=True) in kassi. */
    edgesFrom(node) {
        const adj = this._adj.get(node);
        if (!adj)
            return [];
        return Array.from(adj.entries()).map(([target, attrs]) => ({ target, attrs }));
    }
    numberOfNodes() {
        return this._nodes.size;
    }
    numberOfEdges() {
        let count = 0;
        for (const targets of this._adj.values())
            count += targets.size;
        return count;
    }
    /** Return node IDs filtered by type attribute. */
    nodesByType(type) {
        const result = [];
        for (const [id, attrs] of this._nodes.entries()) {
            if (attrs['type'] === type)
                result.push(id);
        }
        return result;
    }
}
//# sourceMappingURL=digraph.js.map