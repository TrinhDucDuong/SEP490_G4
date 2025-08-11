export const DASHBOARD_CONSTANTS = {
    FILTER_OPTIONS: {
        WEEK: 'week',
        MONTH: 'month',
        YEAR: 'year'
    },
    FILTER_LABELS: {
        week: 'tuần',
        month: 'tháng',
        year: 'năm'
    },
    API_ENDPOINTS: {
        SUMMARY: '/admin/dashboard/summary',
        GRAPH_REVENUE: '/admin/dashboard/graph-revenue',
        CATEGORIES_SALES: '/admin/dashboard/categories-sales',
        AI_ASSISTANT: '/admin/ai-assistant' // Thêm endpoint mới
    },
    WEBSOCKET_ENDPOINTS: {
        AI_ASSISTANT: 'ws://localhost:9999/admin/ai-assistant'
    },
    CHART_COLORS: [
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#EF4444',
        '#8B5CF6',
        '#06B6D4',
        '#84CC16',
        '#F97316'
    ]
};
