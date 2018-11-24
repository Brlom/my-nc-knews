exports.apiEndpoints = [
  {
    '/api/topics': {
      methods: {
        GET: {
          description: 'responds with an array of topic objects',
        },
        POST: {
          description: "posts an object with properties 'slug' and 'description'",
        },
      },

    },
  },
  {
    '/api/topics/:topic/articles': {
      methods: {
        GET: {
          description: 'responds with an array of topic objects for a given topic',
          available_queries: {
            limit: 'limits the number of responses',
            sort_by: 'sorts the articles by any valid column',
            p: 'specifies the page at which to start',
            // TODO: fix order to be in sort_ascending
            sort_ascending: "when 'true' returns the results sorted in ascending order",
          },
        },
        POST: {
          description: "posts an object with properties 'title', 'body' and 'user_id",
        },
      },
    },
  },
  {
    '/api/articles': {
      methods: {
        GET: {
          description: 'responds with an array of article objects',
          available_queries: {
            limit: 'limits the number of responses',
            sort_by: 'sorts the articles by any valid column',
            p: 'specifies the page at which to start',
            // TODO: fix order to be in sort_ascending
            sort_ascending: "when 'true' returns the results sorted in ascending order",
          },
        },
      },
    },
  },
  {
    '/api/articles/:article_id': {
      methods: {
        GET: {
          description: 'responds with an article object',
        },
        PATCH: {
          description: 'updates article votes when given an object in the form `{ inc_votes: newVote }`',
        },
        DELETE: {
          description: 'deletes an article by article_id',
        },
      },
    },
  },
  {
    '/api/articles/:article_id/comments': {
      methods: {
        GET: {
          description: 'responds with an array of comments for the given article objects',
          available_queries: {
            limit: 'limits the number of responses',
            sort_by: 'sorts the articles by any valid column',
            p: 'specifies the page at which to start',
            // TODO: fix order to be in sort_ascending
            sort_ascending: "when 'true' returns the results sorted in ascending order",
          },
        },
        POST: {
          description: "posts and object with properties 'user_id' and 'body'",
        },
      },
    },
  },
  {
    '/api/articles/:article_id/comments/:comment_id': {
      methods: {
        PATCH: {
          description: 'updates comment votes when given an object in the form `{ inc_votes: newVote }`',
        },
        DELETE: {
          description: 'deletes a comment by comment_id',
        },
      },
    },
  },
  {
    '/api/users': {
      methods: {
        GET: {
          description: 'responds with an array of user objects',
        },
      },
    },
  },
  {
    '/api/users/:username': {
      methods: {
        GET: {
          description: 'responds with a user object',
        },
      },
    },
  },
];
