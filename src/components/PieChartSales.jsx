import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

/**
 * recibe prop data = [{ label, value }]
 */
export default function PieChartSales({ data = [] }) {
    const labels = data.map(d => d.label);
    const values = data.map(d => d.value);
    const chartData = { labels, datasets: [{ data: values }] };

    return (
        <div className="card p-3 mb-3">
            <h6>Ventas por categoría</h6>
            <Pie data={chartData} />
        </div>
    );
}
