import 'regenerator-runtime/runtime';
import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector';

// @ts-ignore
const connector = new AppSearchAPIConnector({
  /* MH connector */
  searchKey: 'search-gpt7wpsxo5sp8js4q2e6tzth',
  engineName: 'search-epargne',
  endpointBase: 'https://entreprise-search-bot.recf.elk.si2m.tec',
});

const config = {
  debug: true,
  alwaysSearchOnInitialLoad: true,
  apiConnector: connector,
  hasA11yNotifications: true,
  searchQuery: {
    search_fields: {
      title: { weight: 7 },
      content: { weight: 3 },
    },
    result_fields: {
      title: { snippet: { fallback: true } },
      nps_link: { raw: {} },
      content: { snippet: { size: 1000, fallback: true } },
      page: { raw: {} },
      origine: { raw: {} },
      grand_compte: { raw: {} },
    },
    disjunctiveFacets: ['grand_compte', 'origine'],
    facets: {
      grand_compte: { type: 'value' },
      origine: { type: 'value' },
      page: { type: 'value' },
      creation_date: { type: 'value' },
      modification_date: { type: 'value' },
    },
  },
  autocompleteQuery: {
    // Customize the query for autocompleteResults
    results: {
      resultsPerPage: 2,
      search_fields: {
        'title.suggest': {
          weight: 3,
        },
      },
      result_fields: {
        title: {
          snippet: {
            size: 100,
            fallback: true,
          },
        },
        url: {
          raw: {},
        },
      },
    },
    suggestions: {
      types: {
        results: { fields: ['movie_completion'] },
      },
      size: 4,
    },
  },
};

export default config;
