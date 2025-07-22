import {ConceptScheme, loadConcepts, loadConceptSchemes, SKOSResource} from "./lib.ts";
import autocomplete from "@tarekraafat/autocomplete.js";

import './style.css';

export type AutocompleteOptions = {
    onConceptSchemesLoaded?: (conceptSchemes: ConceptScheme[]) => void;
    onConceptSchemeSelected?: (conceptScheme: ConceptScheme | null) => void;
    onConceptSelected?: (concept: SKOSResource | null) => void;
    onConceptSchemeLoaded?: (conceptScheme: ConceptScheme, concepts: SKOSResource[]) => void;
    onError?: (action: string, error: any) => void;
    loading?: {
        conceptSchemes?: string;
        concepts?: string;
    };
    noResults?: {
        conceptSchemes?: string;
        concepts?: string;
    };
    placeholder?: {
        conceptScheme?: string;
        concept?: string;
    };
    errorMessages: {
        conceptSchemes?: string;
        concepts?: string;
    };
    inputClasses?: string | {
        conceptScheme?: string;
        concept?: string;
    };
    conceptSchemeFilter?: (conceptScheme: ConceptScheme) => boolean;
    conceptFilter?: (concept: SKOSResource, conceptScheme: ConceptScheme) => boolean;
};

export type AutocompleteInstance = {
    reset: () => void,
}

export function create(element: HTMLElement, sparqlEndpoint: string, options?: AutocompleteOptions): AutocompleteInstance {
    const noConceptSchemesFoundLabel = document.createElement("div");
    noConceptSchemesFoundLabel.className = 'no-results no-results-concept-schemes';
    noConceptSchemesFoundLabel.innerHTML = options?.noResults?.concepts || 'No concept schemes found';

    const conceptSchemesErrorLabel = document.createElement("div");
    conceptSchemesErrorLabel.className = 'error error-concept-schemes';
    conceptSchemesErrorLabel.innerHTML = options?.errorMessages?.conceptSchemes || 'Error retrieving concept schemes';

    const conceptSchemeInput = document.createElement("input");
    const conceptInput = document.createElement("input");
    const noConceptsFoundLabel = document.createElement("div");
    const loadingConceptSchemesLabel = document.createElement("div");
    const loadingConceptsLabel = document.createElement("div");
    const conceptsErrorLabel = document.createElement("div");

    let selectedConceptScheme: ConceptScheme | null = null;
    let concepts: SKOSResource[] | null = null;
    let selectedConcept: SKOSResource | null = null;

    let conceptSchemeInputClasses, conceptInputClasses;
    if (typeof options?.inputClasses === 'string') {
        conceptSchemeInputClasses = conceptInputClasses = options?.inputClasses;
    } else {
        conceptSchemeInputClasses = options?.inputClasses?.conceptScheme || '';
        conceptInputClasses = options?.inputClasses?.concept || '';
    }

    conceptSchemeInput.className = 'concept-scheme-input ' + conceptSchemeInputClasses;
    conceptInput.className = 'concept-input ' + conceptInputClasses;
    noConceptsFoundLabel.className = 'no-results no-results-concepts';
    loadingConceptSchemesLabel.className = 'loading loading-concept-schemes';
    loadingConceptSchemesLabel.innerHTML = options?.loading?.conceptSchemes || 'Loading...';
    element.append(loadingConceptSchemesLabel);
    loadingConceptsLabel.style.display = "none";
    loadingConceptsLabel.className = 'loading loading-concepts';
    loadingConceptsLabel.innerHTML = options?.loading?.concepts || 'Loading concepts...';
    conceptsErrorLabel.style.display = "none";
    conceptsErrorLabel.className = 'error error-concepts';
    conceptsErrorLabel.innerHTML = options?.errorMessages?.concepts || 'Error retrieving concepts';

    loadConceptSchemes(sparqlEndpoint)
        .then((conceptSchemes) => {

            if (options?.conceptSchemeFilter) {
                conceptSchemes = conceptSchemes.filter(options.conceptSchemeFilter);
            }

            options?.onConceptSchemesLoaded?.(conceptSchemes);

            if (!conceptSchemes.length) {
                element.append(noConceptSchemesFoundLabel);
                return;
            }

            noConceptsFoundLabel.style.display = "none";
            noConceptsFoundLabel.innerHTML = options?.noResults?.concepts || 'No concepts found';
            conceptInput.style.display = "none";
            element.append(conceptSchemeInput);
            element.append(noConceptsFoundLabel);
            element.append(loadingConceptsLabel);
            element.append(conceptsErrorLabel);
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
                            if (selectedConceptScheme && newConceptScheme?.uri === selectedConceptScheme.uri) {
                                return;
                            }
                            selectedConceptScheme = newConceptScheme;
                            conceptInput.style.display = 'none';
                            conceptInput.value = '';
                            noConceptsFoundLabel.style.display = 'none';
                            conceptsErrorLabel.style.display = 'none';
                            if (selectedConceptScheme != null) {
                                conceptSchemeInput.value = selectedConceptScheme.label;
                                options?.onConceptSchemeSelected?.(selectedConceptScheme);
                                loadingConceptsLabel.style.display = "";
                                try {
                                    concepts = await loadConcepts(sparqlEndpoint, selectedConceptScheme!.uri);

                                    if (options?.conceptFilter) {
                                        concepts = concepts.filter(c => options?.conceptFilter?.(c, selectedConceptScheme!));
                                    }

                                    options?.onConceptSchemeLoaded?.(selectedConceptScheme, concepts);
                                    if (concepts.length) {
                                        conceptInput.style.display = '';
                                        conceptInput.focus();
                                        conceptAutocomplete.start();
                                    } else {
                                        noConceptsFoundLabel.style.display = '';
                                    }
                                } catch (err) {
                                    conceptsErrorLabel.style.display = '';
                                    options?.onError?.('loadConcepts', err);
                                } finally {
                                    loadingConceptsLabel.style.display = "none";
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
                            selectedConcept = ev.detail.selection.value;
                            conceptInput.value = selectedConcept!.label;
                            options?.onConceptSelected?.(selectedConcept);
                        }
                    },
                },
            });
        })
        .catch(err => {
            element.append(conceptSchemesErrorLabel);
            options?.onError?.('loadConceptSchemes', err);
        })
        .finally(() => {
            element.removeChild(loadingConceptSchemesLabel);
        });

    const reset = () => {
        conceptSchemeInput.value = '';
        selectedConceptScheme = null;
        conceptInput.style.display = 'none';
        conceptInput.value = '';
        noConceptsFoundLabel.style.display = 'none';
        options?.onConceptSchemeSelected?.(null);
        options?.onConceptSelected?.(null);
    };

    const getSelection = () => ({
        conceptScheme: selectedConceptScheme ? JSON.parse(JSON.stringify(selectedConceptScheme)) : null,
        concept: selectedConcept ? JSON.parse(JSON.stringify(selectedConcept)) : null,
    });

    return {
        reset,
        getSelection,
    } as AutocompleteInstance;
}