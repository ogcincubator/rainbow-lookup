const queries: Record<string, string> = {
    FETCH_CONCEPT_SCHEMES: `
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        SELECT DISTINCT ?cs (MIN(?lbl) as ?label) WHERE { ?cs a skos:ConceptScheme ; skos:prefLabel ?lbl }
        GROUP BY ?cs
        ORDER BY ?label
    `,
    FETCH_CONCEPT_SCHEME_CONCEPTS: `
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        SELECT DISTINCT ?c (MIN(?lbl) as ?label) WHERE { ?c a skos:Concept ; skos:prefLabel ?lbl ; skos:inScheme <@@CS_URI@@> }
        GROUP BY ?c
        ORDER BY ?label
    `,
}
export default queries;