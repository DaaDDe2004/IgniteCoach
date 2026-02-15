// Initialize Strength Progress Chart
document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('strengthChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
            datasets: [{
                label: 'Bench Press',
                data: [165, 170, 170, 175, 180, 185],
                borderColor: '#FF6B35',
                backgroundColor: 'rgba(255,107,53,0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Squat',
                data: [225, 235, 235, 245, 250, 255],
                borderColor: '#4ECDC4',
                backgroundColor: 'rgba(78,205,196,0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Deadlift',
                data: [275, 285, 295, 295, 305, 315],
                borderColor: '#45B7D1',
                backgroundColor: 'rgba(69,183,209,0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#A0A0A0',
                        padding: 20,
                        usePointStyle: true
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255,255,255,0.05)'
                    },
                    ticks: {
                        color: '#666'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#666'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
});