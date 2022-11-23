import 'regenerator-runtime/runtime';
import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector';

// @ts-ignore
const connector = new AppSearchAPIConnector({
  /* MH connector */
  searchKey: 'search-snsuo76iiedkkbx5deouk1xk',
  engineName: 'search-qpm-epargne',
  //endpointBase: 'https://entreprise-search-bot.recf.elk.si2m.tec',
  hostIdentifier: 'https://entreprise-search-bot.recf.elk.si2m.tec',
  /*searchKey: 'search-snsuo76iiedkkbx5deouk1xk',
  engineName: 'search-epargne',
  endpointBase: 'https://entreprise-search-bot.recf.elk.si2m.tec', */
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
      author: { type: 'value' },
      extension: { type: 'value' },
      page: { type: 'value' },
      creation_date: {
        type: 'range',
        ranges: [
          {
            from: '2020-01-01T01:01:33.420Z',
            name: 'Les anciens documents',
          },
          {
            from: '2021-01-01T01:01:33.420Z',
            to: '2021-12-31T23:59:33.420Z',
            name: 'Les documents en 2021',
          },
          {
            to: '2022-01-01T01:01:33.420Z',
            name: 'Les documents de 2022',
          },
        ],
      },
      modification_date: {
        type: 'range',
        ranges: [
          {
            from: '2021-01-01T01:01:33.420Z',
            to: '2021-12-31T23:59:33.420Z',
            name: 'Document modifié en 2021',
          },
          {
            to: '2022-01-01T01:01:33.420Z',
            name: 'Document modifié cette année',
          },
        ],
      },
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
