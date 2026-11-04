/**
 * KOVA Admin Dashboard - Interactive SVG Transaction Chart
 * High-performance smooth Bezier curve with gradient fill and rich hover tooltips
 */

class KovaChart {
  constructor(containerId, store) {
    this.container = document.getElementById(containerId);
    this.store = store;
    this.currentMetric = this.store.state.chartMetric || 'value';
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();

    // Debounced window resize handler for smooth responsive chart recalculations
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (this.container && this.container.offsetParent !== null) {
          this.render();
        }
      }, 120);
    };

    window.addEventListener('resize', handleResize);

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(handleResize);
      ro.observe(this.container);
    }
  }

  setMetric(metric) {
    this.currentMetric = metric;
    this.store.setChartMetric(metric);
    this.render();
  }

  render() {
    if (!this.container) return;

    const data = this.store.getTransactionChartData(this.currentMetric);
    if (!data || !data.length) {
      this.container.innerHTML = '<div class="empty-state"><p>No chart data available.</p></div>';
      return;
    }

    const width = this.container.clientWidth || 700;
    const isMobile = width < 520;
    const height = isMobile ? 220 : 260;
    const padding = isMobile 
      ? { top: 20, right: 16, bottom: 30, left: 48 }
      : { top: 25, right: 30, bottom: 35, left: 65 };

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Determine max value for Y scale
    const values = data.map(d => d.metricValue);
    let maxVal = Math.max(...values, 10);
    // Add 15% headroom
    maxVal = maxVal * 1.15;

    // Formatters
    const formatY = (v) => {
      if (this.currentMetric === 'volume') {
        return Math.round(v);
      }
      if (v >= 1000000) {
        return '₦' + (v / 1000000).toFixed(1) + 'M';
      }
      if (v >= 1000) {
        return '₦' + (v / 1000).toFixed(0) + 'K';
      }
      return '₦' + Math.round(v);
    };

    // Calculate (x, y) coordinates
    const points = data.map((d, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartW;
      const y = padding.top + chartH - (d.metricValue / maxVal) * chartH;
      return { x, y, ...d };
    });

    // Create smooth Bezier curve path
    const pathD = this.getSmoothPath(points);
    const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

    // Colors according to metric
    let strokeColor = '#10b981';
    let gradientStart = 'rgba(16, 185, 129, 0.4)';
    let gradientEnd = 'rgba(16, 185, 129, 0.0)';

    if (this.currentMetric === 'volume') {
      strokeColor = '#38bdf8';
      gradientStart = 'rgba(56, 189, 248, 0.4)';
      gradientEnd = 'rgba(56, 189, 248, 0.0)';
    } else if (this.currentMetric === 'value') {
      strokeColor = '#818cf8';
      gradientStart = 'rgba(129, 140, 248, 0.4)';
      gradientEnd = 'rgba(129, 140, 248, 0.0)';
    } else if (this.currentMetric === 'revenue') {
      strokeColor = '#a855f7';
      gradientStart = 'rgba(168, 85, 247, 0.4)';
      gradientEnd = 'rgba(168, 85, 247, 0.0)';
    } else if (this.currentMetric === 'profit') {
      strokeColor = '#10b981';
      gradientStart = 'rgba(16, 185, 129, 0.4)';
      gradientEnd = 'rgba(16, 185, 129, 0.0)';
    }

    // Generate grid lines
    const gridTicks = 4;
    let gridLinesHtml = '';
    const labelFontSize = isMobile ? '9.5' : '11';
    for (let i = 0; i <= gridTicks; i++) {
      const val = (maxVal / gridTicks) * i;
      const yPos = padding.top + chartH - (val / maxVal) * chartH;
      gridLinesHtml += `
        <line x1="${padding.left}" y1="${yPos}" x2="${width - padding.right}" y2="${yPos}" stroke="#e2e8f0" stroke-dasharray="4,4" />
        <text x="${padding.left - (isMobile ? 6 : 10)}" y="${yPos + 4}" fill="#64748b" font-size="${labelFontSize}" text-anchor="end" font-family="Plus Jakarta Sans">${formatY(val)}</text>
      `;
    }

    // Generate X axis month labels
    let xLabelsHtml = '';
    points.forEach((p, idx) => {
      // If mobile screen is narrow, skip odd months to prevent label overlap
      if (width < 440 && idx % 2 !== 0 && idx !== points.length - 1) {
        return;
      }
      xLabelsHtml += `
        <text x="${p.x}" y="${height - (isMobile ? 8 : 10)}" fill="#64748b" font-size="${labelFontSize}" font-weight="600" text-anchor="middle" font-family="Plus Jakarta Sans">${p.label}</text>
      `;
    });

    // Generate interactive data dots
    let dotsHtml = '';
    points.forEach((p, index) => {
      dotsHtml += `
        <g class="chart-point" data-index="${index}" style="cursor: pointer;">
          <circle cx="${p.x}" cy="${p.y}" r="12" fill="transparent" />
          <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="#ffffff" stroke="${strokeColor}" stroke-width="2.5" class="dot-core" />
        </g>
      `;
    });

    this.container.innerHTML = `
      <div style="position: relative; width: 100%; height: 100%;">
        <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="overflow: visible;">
          <defs>
            <linearGradient id="chartGrad-${this.currentMetric}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${gradientStart}" />
              <stop offset="100%" stop-color="${gradientEnd}" />
            </linearGradient>
            <filter id="glow-${this.currentMetric}" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="${strokeColor}" flood-opacity="0.45"/>
            </filter>
          </defs>

          <!-- Grid Lines & Y Labels -->
          ${gridLinesHtml}

          <!-- X Labels -->
          ${xLabelsHtml}

          <!-- Gradient Area -->
          <path d="${areaD}" fill="url(#chartGrad-${this.currentMetric})" />

          <!-- Curve Line -->
          <path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="3" stroke-linecap="round" filter="url(#glow-${this.currentMetric})" />

          <!-- Interactive Dots -->
          ${dotsHtml}
        </svg>

        <!-- Hover Tooltip -->
        <div id="chart-tooltip" style="
          position: absolute;
          display: none;
          pointer-events: none;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          font-size: 0.78rem;
          color: #0f172a;
          z-index: 50;
          transition: transform 0.1s ease-out;
        "></div>
      </div>
    `;

    // Attach hover listeners to points
    this.attachEvents(points);
  }

  attachEvents(points) {
    const tooltip = this.container.querySelector('#chart-tooltip');
    const pointEls = this.container.querySelectorAll('.chart-point');

    pointEls.forEach(el => {
      el.addEventListener('mouseenter', (e) => {
        const idx = parseInt(el.getAttribute('data-index'));
        const p = points[idx];
        if (!p || !tooltip) return;

        // Highlight dot
        const core = el.querySelector('.dot-core');
        if (core) {
          core.setAttribute('r', '7');
          core.setAttribute('fill', strokeColor);
        }

        const feePercent = (this.store.data.config.platformFeeRate * 100).toFixed(1) + '%';
        const formattedVal = this.currentMetric === 'volume' 
          ? `${p.volume} transactions`
          : this.store.formatNaira(p.metricValue);

        tooltip.innerHTML = `
          <div style="font-weight: 700; color: #64748b; font-size: 0.72rem; margin-bottom: 3px;">${p.label} 2026</div>
          <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-bottom: 6px;">${formattedVal}</div>
          <div style="border-top: 1px solid #e2e8f0; padding-top: 5px; display: grid; gap: 3px; font-size: 0.72rem;">
            <div style="display: flex; justify-content: space-between; gap: 12px;">
              <span style="color: #64748b;">Volume:</span>
              <span style="font-weight: 600; color: #0f172a;">${p.volume} txs</span>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 12px;">
              <span style="color: #64748b;">Total Value:</span>
              <span style="font-weight: 600; color: #0f172a;">${this.store.formatNaira(p.value)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 12px;">
              <span style="color: #059669;">Fee (${feePercent}):</span>
              <span style="font-weight: 600; color: #059669;">${this.store.formatNaira(p.profit)}</span>
            </div>
          </div>
        `;

        tooltip.style.display = 'block';

        // Position tooltip
        const containerRect = this.container.getBoundingClientRect();
        const left = Math.min(Math.max(p.x - 70, 10), containerRect.width - 170);
        const top = Math.max(p.y - 95, 10);
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
      });

      el.addEventListener('mouseleave', () => {
        const core = el.querySelector('.dot-core');
        if (core) {
          core.setAttribute('r', '4.5');
          core.setAttribute('fill', '#ffffff');
        }
        if (tooltip) tooltip.style.display = 'none';
      });
    });
  }

  // Smooth Bezier line algorithm
  getSmoothPath(points) {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return d;
  }
}

window.KovaChart = KovaChart;
