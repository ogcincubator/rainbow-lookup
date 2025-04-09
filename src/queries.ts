const queries: Record<string, string> = {
    FETCH_CONCEPT_SCHEMES: `
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        SELECT DISTINCT ?cs ?label WHERE { ?cs a skos:ConceptScheme ; skos:prefLabel ?label }
        ORDER BY ?label
    `,
    FETCH_CONCEPT_SCHEME_CONCEPTS: `
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        SELECT DISTINCT ?c ?label WHERE { ?c a skos:Concept ; skos:prefLabel ?label ; skos:inScheme <@@CS_URI@@> }
        ORDER BY ?label
    `,
}
export default queries;