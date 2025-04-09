import queries from "./queries.ts";

export type SKOSResource = {
    uri: string;
    label: string;
};

export type ConceptScheme = SKOSResource & {
    loading: boolean;
    concepts: SKOSResource[] | null;
};

const conceptSchemeCache: Record<string, Array<ConceptScheme>> = {};

export function sparqlQuery(sparqlEndpoint: string, query: string, method = 'POST') {
    return fetch(sparqlEndpoint, {
        method: method,
        body: query,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/sparql-query',
        },
    });
}

export async function loadConceptSchemes(sparqlEndpoint: string) {
    if (!conceptSchemeCache.hasOwnProperty(sparqlEndpoint)) {
        const response = await sparqlQuery(sparqlEndpoint, queries.FETCH_CONCEPT_SCHEMES);
        const data = await response.json();
        if (data?.results?.bindings?.length) {
            conceptSchemeCache[sparqlEndpoint] = data.results.bindings.map((binding: any): ConceptScheme => ({
                label: binding.label.value,
                uri: binding.cs.value,
                loading: false,
                concepts: null,
            }));
        } else {
            conceptSchemeCache[sparqlEndpoint] = [];
        }
    }
    return conceptSchemeCache[sparqlEndpoint];
}

export async function loadConcepts(sparqlEndpoint: string, conceptSchemeUri: string): Promise<SKOSResource[]> {
    const conceptSchemes = await loadConceptSchemes(sparqlEndpoint);
    const conceptScheme = conceptSchemes?.find((s) => s.uri === conceptSchemeUri);
    if (!conceptScheme) {
        return [];
    }
    if (conceptScheme.concepts === null) {
        const response = await sparqlQuery(sparqlEndpoint,
            queries.FETCH_CONCEPT_SCHEME_CONCEPTS.replace('@@CS_URI@@', conceptSchemeUri));
        const data = await response.json();
        if (data?.results?.bindings?.length) {
          conceptScheme.concepts = data.results.bindings.map((b: any): SKOSResource => ({
            label: b.label.value,
            uri: b.c.value,
          }));
        }
    }
    return conceptScheme.concepts || [];
}