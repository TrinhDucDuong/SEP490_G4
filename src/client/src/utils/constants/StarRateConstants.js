export const STAR_RATE_CONSTANTS = {
    SORT_OPTIONS: {
        STAR_RATE_ASC: 'starRate_asc',
        STAR_RATE_DESC: 'starRate_desc',
        CREATED_AT_ASC: 'createdAt_asc',
        CREATED_AT_DESC: 'createdAt_desc',
        STAR_RATE_ID_ASC: 'starRateId_asc',
        STAR_RATE_ID_DESC: 'starRateId_desc'
    },
    FILTER_OPTIONS: {
        ALL: 'all',
        ONE_STAR: 1,
        TWO_STAR: 2,
        THREE_STAR: 3,
        FOUR_STAR: 4,
        FIVE_STAR: 5
    },
    VISIBILITY_FILTER: {
        ALL: 'all',
        VISIBLE: 'visible',
        HIDDEN: 'hidden'
    },
    REPLY_STATUS_FILTER: {
        ALL: 'all',
        REPLIED: 'replied',
        NOT_REPLIED: 'not_replied'
    },
    SEARCH_TYPES: {
        USERNAME: 'username',
        STAR_RATE_ID: 'starRateId'
    },
    MAX_STARS: 5,
    ITEMS_PER_PAGE: 10,
    API_ENDPOINTS: {
        BASE: '/staff/star-rate',
        GET_ALL: '/staff/star-rate',
        GET_BY_ID: (id) => `/staff/star-rate/${id}`,
        REPLY: '/staff/star-rate',
        UPDATE: (id) => `/staff/star-rate/${id}`,
        DELETE: (id) => `/staff/star-rate/${id}`,
        RESTORE: (id) => `/staff/star-rate/${id}`
    }
};
