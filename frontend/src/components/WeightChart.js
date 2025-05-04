import React from 'react';
import { Line } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeightChart = ({ weightEntries }) => {
  // Sort entries by date
  const sortedEntries = [...weightEntries].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  // Prepare data for Chart.js
  const chartData = {
    labels: sortedEntries.map(entry => format(parseISO(entry.date), 'MMM d, yyyy')),
    datasets: [
      {
        label: 'Weight (kg)',
        data: sortedEntries.map(entry => entry.weight),
        borderColor: 'rgb(59, 130, 246)', // Blue
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            return `Weight: ${context.parsed.y} kg`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return `${value} kg`;
          }
        },
        title: {
          display: true,
          text: 'Weight (kg)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  // Calculate min and max for better scale
  if (sortedEntries.length > 0) {
    const weights = sortedEntries.map(entry => entry.weight);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const buffer = (maxWeight - minWeight) * 0.1 || 1; // 10% buffer or 1kg if all weights are the same
    
    chartOptions.scales.y.min = Math.max(0, minWeight - buffer);
    chartOptions.scales.y.max = maxWeight + buffer;
  }

  return (
    <div className="h-64 md:h-80">
      {weightEntries.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No data to display</p>
        </div>
      )}
    </div>
  );
};

export default WeightChart;
