import {ConceptScheme, loadConcepts, loadConceptSchemes, SKOSResource} from "./lib.ts";
import autocomplete from "@tarekraafat/autocomplete.js";

import './style.css';

export type AutocompleteOptions = {
    onConceptSchemeSelected?: (conceptScheme: ConceptScheme | null) => void,
    onConceptSelected?: (concept: SKOSResource | null) => void,
    onConceptSchemeLoaded?: (conceptScheme: ConceptScheme, concepts: SKOSResource[]) => void,
    loading?: {
        conceptSchemes?: string,
        concepts?: string,
    },
    noResults?: {
        conceptSchemes?: string,
        concepts?: string,
    },
    placeholder?: {
        conceptScheme?: string,
        concept?: string,
    },
};

export type AutocompleteInstance = {
    reset: () => void,
}

export function create(element: HTMLElement, sparqlEndpoint: string, options?: AutocompleteOptions): AutocompleteInstance {
    const noConceptSchemesFoundLabel = document.createElement("div");
    noConceptSchemesFoundLabel.style.display = "none";
    noConceptSchemesFoundLabel.innerHTML = options?.noResults?.concepts || 'No concept schemes found';

    const conceptSchemeInput = document.createElement("input");
    const conceptInput = document.createElement("input");
    const noConceptsFoundLabel = document.createElement("div");
    const loadingConceptSchemesLabel = document.createElement("div");
    const loadingConceptsLabel = document.createElement("div");

    let conceptScheme: ConceptScheme | null = null;
    let concepts: SKOSResource[] | null = null;

    conceptSchemeInput.className = 'concept-scheme-input';
    conceptInput.className = 'concept-input';
    noConceptsFoundLabel.className = 'no-concepts-found';
    loadingConceptSchemesLabel.className = 'loading loading-concept-schemes';
    loadingConceptSchemesLabel.innerHTML = options?.loading?.conceptSchemes || 'Loading...';
    element.append(loadingConceptSchemesLabel);
    loadingConceptsLabel.style.display = "none";
    loadingConceptsLabel.className = 'loading loading-concepts';
    loadingConceptsLabel.innerHTML = options?.loading?.concepts || 'Loading concepts...';

    loadConceptSchemes(sparqlEndpoint).then((conceptSchemes) => {

        element.removeChild(loadingConceptSchemesLabel);
        if (!conceptSchemes.length) {
            element.append(noConceptSchemesFoundLabel);
            return {
                reset: () => null,
            };
        }

        noConceptsFoundLabel.style.display = "none";
        noConceptsFoundLabel.innerHTML = options?.noResults?.concepts || 'No concepts found';
        conceptInput.style.display = "none";
        element.append(conceptSchemeInput);
        element.append(noConceptsFoundLabel);
        element.append(loadingConceptsLabel);
        element.append(conceptInput);

        const query = (q: string) => q.toLowerCase();
        const searchEngine = (query: string, record: SKOSResource) => {
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
                src: () => {
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
                    async selection(ev: any) {
                        const newConceptScheme = ev.detail.selection.value;
                        if (conceptScheme && newConceptScheme?.uri === conceptScheme.uri) {
                            return;
                        }
                        conceptScheme = newConceptScheme;
                        conceptInput.style.display = 'none';
                        conceptInput.value = '';
                        noConceptsFoundLabel.style.display = 'none';
                        if (conceptScheme != null) {
                            conceptSchemeInput.value = conceptScheme.label;
                            options?.onConceptSchemeSelected?.(conceptScheme);
                            loadingConceptsLabel.style.display = "";
                            concepts = await loadConcepts(sparqlEndpoint, conceptScheme!.uri);
                            loadingConceptsLabel.style.display = "none";
                            options?.onConceptSchemeLoaded?.(conceptScheme, concepts);
                            if (concepts.length) {
                                conceptInput.style.display = '';
                                conceptInput.focus();
                                conceptAutocomplete.start();
                            } else {
                                noConceptsFoundLabel.style.display = '';
                            }
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
                src: () => {
                    return concepts || [];
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
                    selection(ev: any) {
                        const concept = ev.detail.selection.value;
                        conceptInput.value = concept.label;
                        options?.onConceptSelected?.(concept);
                    }
                },
            },
        });
    });

    const reset = () => {
        conceptSchemeInput.value = '';
        conceptScheme = null;
        conceptInput.style.display = 'none';
        conceptInput.value = '';
        noConceptsFoundLabel.style.display = 'none';
        options?.onConceptSchemeSelected?.(null);
        options?.onConceptSelected?.(null);
    };

    return {
        reset,
    } as AutocompleteInstance;
}