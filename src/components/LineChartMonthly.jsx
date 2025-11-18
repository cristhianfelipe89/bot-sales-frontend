import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

/**
 * data: { labels: [], values: [] }
 */
export default function LineChartMonthly({ data = { labels: [], values: [] } }) {
    const chartData = {
        labels: data.labels,
        datasets: [{ label: 'Ventas', data: data.values, fill: false }]
    };
    return (
        <div className="card p-3 mb-3">
            <h6>Ventas mensuales</h6>
            <Line data={chartData} />
        </div>
    );
}
