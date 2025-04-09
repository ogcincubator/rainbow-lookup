import {ConceptScheme, loadConcepts, loadConceptSchemes, SKOSResource} from "./lib.ts";
import autocomplete from "@tarekraafat/autocomplete.js";

import './style.css';

export type AutocompleteOptions = {
    onConceptScheme?: (conceptScheme: ConceptScheme | null) => void,
    onConcept?: (concept: SKOSResource | null) => void,
    placeholder?: {
        conceptScheme?: string,
        concept?: string,
    },
};

export async function create(element: HTMLElement, sparqlEndpoint: string, options?: AutocompleteOptions) {
    const conceptSchemes = await loadConceptSchemes(sparqlEndpoint);
    const conceptSchemeInput = document.createElement("input");
    const conceptInput = document.createElement("input");

    conceptInput.style.display = "none";
    element.append(conceptSchemeInput);
    element.append(conceptInput);

    let conceptScheme: ConceptScheme | null = null;

    const query = (q: string) => q.toLowerCase();
    const searchEngine = (query: string, record: SKOSResource)=> {
        if (record.label.toLowerCase().includes(query)) {
            return record.label;
        }
    };

    const conceptSchemeAutocomplete: any = new autocomplete({
        name: 'rainbow-concept-schemes',
        selector: () => conceptSchemeInput,
        placeHolder: 'Concept scheme',
        threshold: 0,
        data: {
            src: ()=> {
                return conceptSchemes;
            },
        },
        query,
        searchEngine,
        resultsList: {
            'class': 'rainbow-autocomplete-results concept-schemes',
            maxResults: undefined,
        },
        resultItem: {
            'class': 'rainbow-autocomplete-result concept-scheme',
        },
        events: {
            input: {
                focus() {
                    conceptSchemeAutocomplete.start();
                },
                selection (ev: any) {
                    conceptScheme = ev.detail.selection.value;
                    if (conceptScheme != null) {
                        conceptSchemeInput.value = conceptScheme.label;
                        options?.onConceptScheme?.(conceptScheme);
                        loadConcepts(sparqlEndpoint, conceptScheme!.uri)
                            .then(() => {
                                conceptInput.style.display = '';
                                conceptInput.focus();
                            });
                    }
                }
            },
        },
    });

    const conceptAutocomplete: any = new autocomplete({
        name: 'rainbow-concepts',
        selector: () => conceptInput,
        placeHolder: 'Concept',
        threshold: 0,
        data: {
            src: async ()=> {
                return conceptScheme!.concepts || [];
            },
        },
        query,
        searchEngine,
        resultsList: {
            'class': 'rainbow-autocomplete-results concept-schemes',
            maxResults: undefined,
        },
        resultItem: {
            'class': 'rainbow-autocomplete-result concept-scheme',
        },
        events: {
            input: {
                focus() {
                    conceptAutocomplete.start();
                },
                selection (ev: any) {
                    const concept = ev.detail.selection.value;
                    conceptInput.value = concept.label;
                    options?.onConcept?.(concept);
                }
            },
        },
    });
}