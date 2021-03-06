import { toIdValue } from 'apollo-utilities'
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

export const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      projectType: (_, { slug }) => {
        // If we already have loaded the list of project types
        // we want to redirect to the corresponding project type
        // instead of doing an unnecessary request to the API
        const { projectTypes } = cache.readQuery({
          query: gql`{
            projectTypes {
              id
              slug
            }
          }`,
        })
        // Lookup for the project type with corresponding slug
        if (projectTypes) {
          const p = projectTypes.find(t => t.slug === slug)
          if (p) {
            // Cache redirect
            return toIdValue(cache.config.dataIdFromObject({ __typename: 'ProjectType', id: p.id }))
          }
        }
      },
    },
  },
})
