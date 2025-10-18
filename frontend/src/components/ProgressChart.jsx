import { useState } from "react";
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const ProgressChart = (props) => {
    const [progressData, setProgressData] = useState({ labels: [], datasets: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const data = props?.progrep;
    let e = 0;
    let m = 0;
    let h = 0;
    let arr = 0;
    let ll = 0;
    let gr = 0;
    let dynamo = 0;
    let dataarr = [];
    let bardatarr = [];

    if (data && data.length != 0) {
        const easyarr = data.filter(user => user.difficulty == 'easy');
        const medarr = data.filter(user => user.difficulty == 'medium');
        const hardarr = data.filter(user => user.difficulty == 'hard');
        const arrdata = data.filter(user => user.tags == 'array');
        const lldata = data.filter(user => user.tags == 'linkedList');
        const grdata = data.filter(user => user.tags == 'graph');
        const dpdata = data.filter(user => user.tags == 'dp');
        arr = arrdata.length;
        ll = lldata.length;
        gr = grdata.length;
        dynamo = dpdata.length;
        e = easyarr.length;
        m = medarr.length;
        h = hardarr.length;
        dataarr.push(e, m, h);
        bardatarr = [arr, ll, gr, dynamo]; // Fixed the syntax error
        console.log(dataarr);
    }

    // Modern color palette
    const colors = {
        easy: {
            bg: '#10B981', // Emerald-500
            light: '#D1FAE5', // Emerald-100
            border: '#059669' // Emerald-600
        },
        medium: {
            bg: '#F59E0B', // Amber-500
            light: '#FEF3C7', // Amber-100
            border: '#D97706' // Amber-600
        },
        hard: {
            bg: '#EF4444', // Red-500
            light: '#FEE2E2', // Red-100
            border: '#DC2626' // Red-600
        }
    };

    // Modern color palette for tags
    const tagColors = {
        array: {
            bg: 'rgba(59, 130, 246, 0.8)', // Blue-500
            border: '#3B82F6',
            hover: 'rgba(59, 130, 246, 0.9)'
        },
        linkedList: {
            bg: 'rgba(139, 69, 193, 0.8)', // Purple-500
            border: '#8B45C1',
            hover: 'rgba(139, 69, 193, 0.9)'
        },
        graph: {
            bg: 'rgba(16, 185, 129, 0.8)', // Emerald-500
            border: '#10B981',
            hover: 'rgba(16, 185, 129, 0.9)'
        },
        dp: {
            bg: 'rgba(245, 101, 101, 0.8)', // Red-400
            border: '#F56565',
            hover: 'rgba(245, 101, 101, 0.9)'
        }
    };

    // Doughnut chart data configuration
    const doughnutChartData = {
        labels: ['Easy', 'Medium', 'Hard'],
        datasets: [
            {
                label: 'Problems Solved',
                data: dataarr,
                backgroundColor: [
                    colors.easy.bg,
                    colors.medium.bg,
                    colors.hard.bg,
                ],
                borderColor: [
                    colors.easy.border,
                    colors.medium.border,
                    colors.hard.border,
                ],
                borderWidth: 3,
                hoverOffset: 8,
                cutout: '65%',
            },
        ],
    };

    // Bar chart data configuration
    const barChartData = {
        labels: ['Array', 'Linked List', 'Graph', 'Dynamic Programming'],
        datasets: [
            {
                label: 'Problems Solved',
                data: bardatarr,
                backgroundColor: [
                    tagColors.array.bg,
                    tagColors.linkedList.bg,
                    tagColors.graph.bg,
                    tagColors.dp.bg,
                ],
                borderColor: [
                    tagColors.array.border,
                    tagColors.linkedList.border,
                    tagColors.graph.border,
                    tagColors.dp.border,
                ],
                hoverBackgroundColor: [
                    tagColors.array.hover,
                    tagColors.linkedList.hover,
                    tagColors.graph.hover,
                    tagColors.dp.hover,
                ],
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            },
        ],
    };

    // Modern chart options
    const doughnutChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // We'll create custom legend
            },
            title: {
                display: false, // We'll use custom title
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)', // Gray-900 with opacity
                titleColor: '#F9FAFB', // Gray-50
                bodyColor: '#F9FAFB',
                borderColor: '#374151', // Gray-700
                borderWidth: 1,
                cornerRadius: 12,
                displayColors: true,
                titleFont: {
                    size: 14,
                    weight: '600',
                },
                bodyFont: {
                    size: 13,
                },
                padding: 12,
                callbacks: {
                    label: function (context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
                        return `${context.label}: ${context.parsed} (${percentage}%)`;
                    }
                }
            }
        },
        animation: {
            duration: 1200,
            easing: 'easeInOutCubic'
        },
    };

    // Bar chart options
    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                titleColor: '#F9FAFB',
                bodyColor: '#F9FAFB',
                borderColor: '#374151',
                borderWidth: 1,
                cornerRadius: 12,
                displayColors: true,
                titleFont: {
                    size: 14,
                    weight: '600',
                },
                bodyFont: {
                    size: 13,
                },
                padding: 12,
                callbacks: {
                    label: function (context) {
                        return `${context.label}: ${context.parsed.y} problems`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#6B7280',
                    font: {
                        size: 12,
                        weight: '500',
                    },
                    maxRotation: 45,
                    minRotation: 0,
                },
                border: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(107, 114, 128, 0.1)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#6B7280',
                    font: {
                        size: 12,
                        weight: '500',
                    },
                    stepSize: 1,
                },
                border: {
                    display: false,
                },
            },
        },
        animation: {
            duration: 1200,
            easing: 'easeInOutCubic',
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
    };

    const total = e + m + h;
    const totalByTags = bardatarr.reduce((a, b) => a + b, 0);

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '24px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* Difficulty Distribution Chart */}
            <div style={{
                backgroundColor: '#F9FAFB', // Gray-50
                borderRadius: '20px',
                padding: '24px',
            }}>
                {/* Header */}
                <div style={{
                    marginBottom: '24px',
                    textAlign: 'center'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#111827',
                        margin: '0 0 8px 0'
                    }}>
                        Problem Difficulty Distribution
                    </h2>
                    <p style={{
                        fontSize: '14px',
                        color: '#6B7280',
                        margin: 0
                    }}>
                        Your coding progress across different difficulty levels
                    </p>
                </div>

                {/* Chart Section */}
                {dataarr.length > 0 && dataarr.some(val => val > 0) ? (
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        position: 'relative'
                    }}>
                        <div style={{
                            height: '320px',
                            position: 'relative'
                        }}>
                            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />

                            {/* Center content */}
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center',
                                pointerEvents: 'none',
                            }}>
                                <div style={{
                                    fontSize: '36px',
                                    fontWeight: '800',
                                    color: '#111827',
                                    lineHeight: '1'
                                }}>
                                    {total}
                                </div>
                                <div style={{
                                    fontSize: '14px',
                                    color: '#6B7280',
                                    fontWeight: '500',
                                    marginTop: '4px'
                                }}>
                                    Total Solved
                                </div>
                            </div>
                        </div>

                        {/* Custom Legend */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '32px',
                            marginTop: '24px',
                            flexWrap: 'wrap'
                        }}>
                            {[
                                { label: 'Easy', color: colors.easy.bg, count: e },
                                { label: 'Medium', color: colors.medium.bg, count: m },
                                { label: 'Hard', color: colors.hard.bg, count: h }
                            ].map((item, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <div style={{
                                        width: '12px',
                                        height: '12px',
                                        backgroundColor: item.color,
                                        borderRadius: '50%'
                                    }} />
                                    <span style={{
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: '#374151'
                                    }}>
                                        {item.label} ({item.count})
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '48px 24px',
                        textAlign: 'center',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{
                            fontSize: '48px',
                            marginBottom: '16px'
                        }}>📊</div>
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#111827',
                            margin: '0 0 8px 0'
                        }}>
                            No Data Available
                        </h3>
                        <p style={{
                            fontSize: '14px',
                            color: '#6B7280',
                            margin: 0
                        }}>
                            Start solving problems to see your progress here
                        </p>
                    </div>
                )}
            </div>

            {/* Tags Bar Chart */}
            <div style={{
                backgroundColor: '#F9FAFB',
                borderRadius: '20px',
                padding: '24px',
            }}>
                {/* Header */}
                <div style={{
                    marginBottom: '24px',
                    textAlign: 'center'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#111827',
                        margin: '0 0 8px 0'
                    }}>
                        Problems by Types
                    </h2>
                    <p style={{
                        fontSize: '14px',
                        color: '#6B7280',
                        margin: 0
                    }}>
                        Distribution of solved problems across different topics
                    </p>
                </div>

                {/* Chart Section */}
                {bardatarr.length > 0 && bardatarr.some(val => val > 0) ? (
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        {/* Stats Summary */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                            gap: '12px',
                            marginBottom: '24px'
                        }}>
                            {[
                                { label: 'Array', count: arr, color: tagColors.array.border },
                                { label: 'Linked List', count: ll, color: tagColors.linkedList.border },
                                { label: 'Graph', count: gr, color: tagColors.graph.border },
                                { label: 'Dynamic Programming', count: dynamo, color: tagColors.dp.border }
                            ].map((item, index) => (
                                <div key={index} style={{
                                    backgroundColor: '#F9FAFB',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    textAlign: 'center',
                                    border: `2px solid ${item.color}20`
                                }}>
                                    <div style={{
                                        fontSize: '18px',
                                        fontWeight: '700',
                                        color: item.color,
                                        marginBottom: '4px'
                                    }}>
                                        {item.count}
                                    </div>
                                    <div style={{
                                        fontSize: '11px',
                                        color: '#6B7280',
                                        fontWeight: '500'
                                    }}>
                                        {item.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bar Chart */}
                        <div style={{
                            height: '300px',
                            position: 'relative'
                        }}>
                            <Bar data={barChartData} options={barChartOptions} />
                        </div>

                        {/* Total Count */}
                        <div style={{
                            textAlign: 'center',
                            marginTop: '20px',
                            padding: '16px',
                            backgroundColor: '#F3F4F6',
                            borderRadius: '12px'
                        }}>
                            <span style={{
                                fontSize: '14px',
                                color: '#6B7280',
                                fontWeight: '500'
                            }}>
                                Total Problems by Types:
                            </span>
                            <span style={{
                                fontSize: '16px',
                                fontWeight: '700',
                                color: '#111827',
                                marginLeft: '8px'
                            }}>
                                {totalByTags}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '48px 24px',
                        textAlign: 'center',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{
                            fontSize: '48px',
                            marginBottom: '16px'
                        }}>📊</div>
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#111827',
                            margin: '0 0 8px 0'
                        }}>
                            No Data Available
                        </h3>
                        <p style={{
                            fontSize: '14px',
                            color: '#6B7280',
                            margin: 0
                        }}>
                            Start solving problems with different tags to see your progress here
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProgressChart;