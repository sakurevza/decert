// src/app/charts/page.tsx

'use client'; // Mark this component as a client component since we'll use ECharts.

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

// Mock Data
const mockData = {
  // 1. DeFi中借贷业务的TVL变化（折线图）
  tvlChanges: [
    { date: '2023-01-01', tvl: 50 },
    { date: '2023-01-02', tvl: 55 },
    { date: '2023-01-03', tvl: 60 },
    { date: '2023-01-04', tvl: 58 },
    { date: '2023-01-05', tvl: 65 },
    { date: '2023-01-06', tvl: 70 },
    { date: '2023-01-07', tvl: 68 },
  ],

  // 2. 不同DEX的交易量比较（柱状图）
  dexTradingVolume: [
    { name: 'Uniswap', volume: 1200 },
    { name: 'Sushiswap', volume: 800 },
    { name: 'PancakeSwap', volume: 1500 },
    { name: 'Curve', volume: 600 },
    { name: 'Aave', volume: 400 }, // Aave is more a lending protocol, but for example
  ],

  // 3. 某个ERC20前10持仓地址的份额比较（饼图）
  erc20HoldersShare: [
    { name: 'Address 1', share: 30 },
    { name: 'Address 2', share: 20 },
    { name: 'Address 3', share: 15 },
    { name: 'Address 4', share: 10 },
    { name: 'Address 5', share: 8 },
    { name: 'Address 6', share: 5 },
    { name: 'Address 7', share: 4 },
    { name: 'Address 8', share: 3 },
    { name: 'Address 9', share: 3 },
    { name: 'Address 10', share: 2 },
  ],

  // 4. 某个代币价格走向（K线图） - 简化数据
  // K线图需要开盘价 (open), 最高价 (high), 最低价 (low), 收盘价 (close), 时间 (time)
  tokenPriceCandlestick: [
    { time: '2023-01-01', open: 100, high: 110, low: 95, close: 105 },
    { time: '2023-01-02', open: 105, high: 115, low: 100, close: 112 },
    { time: '2023-01-03', open: 112, high: 120, low: 108, close: 118 },
    { time: '2023-01-04', open: 118, high: 125, low: 115, close: 122 },
    { time: '2023-01-05', open: 122, high: 128, low: 120, close: 126 },
    { time: '2023-01-06', open: 126, high: 130, low: 124, close: 128 },
    { time: '2023-01-07', open: 128, high: 135, low: 126, close: 132 },
  ],
};

// Helper function to initialize and set up ECharts
const setupChart = (
  containerId: string,
  option: echarts.EChartsOption,
  dependencies: any[] = [] // Add dependencies for re-rendering
) => {
  const chartDom = document.getElementById(containerId);
  if (chartDom) {
    const myChart = echarts.init(chartDom);
    myChart.setOption(option);

    // Resize chart on window resize
    const resizeChart = () => {
      myChart.resize();
    };
    window.addEventListener('resize', resizeChart);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', resizeChart);
      myChart.dispose(); // Dispose the chart instance to free up memory
    };
  }
  return () => {}; // Return a no-op cleanup function if chartDom is not found
};

const ChartsPage: React.FC = () => {
  const tvlChartRef = useRef<HTMLDivElement>(null);
  const dexVolumeChartRef = useRef<HTMLDivElement>(null);
  const erc20ShareChartRef = useRef<HTMLDivElement>(null);
  const tokenPriceChartRef = useRef<HTMLDivElement>(null);

  // --- Chart 1: DeFi TVL Changes (Line Chart) ---
  useEffect(() => {
    const cleanup = setupChart(
      'tvl-chart',
      {
        title: {
          text: 'DeFi 借贷业务 TVL 变化',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b}<br/>TVL: {c}B',
        },
        xAxis: {
          type: 'category',
          data: mockData.tvlChanges.map(item => item.date),
        },
        yAxis: {
          type: 'value',
          name: 'TVL (Billions)',
          axisLabel: {
            formatter: '{value}B'
          }
        },
        series: [
          {
            data: mockData.tvlChanges.map(item => item.tvl),
            type: 'line',
            smooth: true, // Makes the line smoother
            areaStyle: {
              // Optional: Add some area fill
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(58, 134, 255, 0.3)' },
                { offset: 1, color: 'rgba(58, 134, 255, 0)' },
              ]),
            },
            lineStyle: {
              width: 2,
              color: '#3a86ff'
            },
            itemStyle: {
              color: '#3a86ff'
            }
          },
        ],
      },
      [mockData.tvlChanges] // Re-render if tvlChanges data changes
    );
    return cleanup;
  }, [mockData.tvlChanges]); // Dependency array

  // --- Chart 2: DEX Trading Volume Comparison (Bar Chart) ---
  useEffect(() => {
    const cleanup = setupChart(
      'dex-volume-chart',
      {
        title: {
          text: '不同 DEX 交易量比较',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: '{b}<br/>交易量: {c}M',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: mockData.dexTradingVolume.map(item => item.name),
          axisLabel: {
            interval: 0, // Show all labels
            rotate: 45, // Rotate labels if they overlap
          },
        },
        yAxis: {
          type: 'value',
          name: '交易量 (Millions)',
          axisLabel: {
            formatter: '{value}M'
          }
        },
        series: [
          {
            data: mockData.dexTradingVolume.map(item => item.volume),
            type: 'bar',
            barWidth: '60%',
            itemStyle: {
              color: '#5470c6',
              borderRadius: [5, 5, 0, 0] // Rounded top corners
            },
          },
        ],
      },
      [mockData.dexTradingVolume]
    );
    return cleanup;
  }, [mockData.dexTradingVolume]);

  // --- Chart 3: ERC20 Holder Share Comparison (Pie Chart) ---
  useEffect(() => {
    const cleanup = setupChart(
      'erc20-share-chart',
      {
        title: {
          text: 'ERC20 前 10 持仓地址份额',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}%',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: mockData.erc20HoldersShare.map(item => item.name),
        },
        series: [
          {
            name: '持仓份额',
            type: 'pie',
            radius: '55%',
            center: ['60%', '50%'], // Adjust center to make space for legend
            data: mockData.erc20HoldersShare.map(item => ({
              value: item.share,
              name: item.name,
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            label: {
              formatter: '{b}: {c}%'
            }
          },
        ],
      },
      [mockData.erc20HoldersShare]
    );
    return cleanup;
  }, [mockData.erc20HoldersShare]);

  // --- Chart 4: Token Price Trend (Candlestick Chart) ---
  useEffect(() => {
    const cleanup = setupChart(
      'token-price-chart',
      {
        title: {
          text: '代币价格走向 (K线图)',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          formatter: (params: any) => {
            const data = params[0].data;
            return `
              ${data.time}<br/>
              开盘: ${data.open}<br/>
              最高: ${data.high}<br/>
              最低: ${data.low}<br/>
              收盘: ${data.close}
            `;
          }
        },
        axisPointer: {
          link: [
            {
              xAxisIndex: 'all',
            },
          ],
        },
        grid: [
          {
            left: '10%',
            right: '10%',
            height: '60%',
          },
          {
            left: '10%',
            right: '10%',
            bottom: '30%',
            height: '20%',
          },
        ],
        xAxis: [
          {
            type: 'category',
            data: mockData.tokenPriceCandlestick.map(item => item.time),
            axisLine: { onZero: false },
            splitLine: { show: false },
            min: 'dataMin',
            max: 'dataMax',
            axisPointer: {
              z: 100,
            },
          },
          {
            type: 'category',
            gridIndex: 1,
            data: mockData.tokenPriceCandlestick.map(item => item.time),
            axisLine: { onZero: false },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            min: 'dataMin',
            max: 'dataMax',
          },
        ],
        yAxis: [
          {
            scale: true,
            axisLine: { onZero: false },
            splitArea: {
              show: true,
            },
          },
          {
            scale: true,
            gridIndex: 1,
            splitNumber: 2,
            axisLine: { onZero: false },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
          },
        ],
        dataZoom: [
          {
            type: 'inside',
            start: 50,
            end: 100,
          },
          {
            show: true,
            type: 'slider',
            top: '90%',
            xAxisIndex: [0, 1],
            start: 50,
            end: 100,
          },
        ],
        series: [
          {
            name: 'K线',
            type: 'candlestick',
            data: mockData.tokenPriceCandlestick.map(item => [
              item.open,
              item.close,
              item.low,
              item.high,
            ]),
            itemStyle: {
              color: '#26A69A', // Green for positive change
              color0: '#EF5350', // Red for negative change
              borderColor: '#26A69A',
              borderColor0: '#EF5350',
            },
            tooltip: { // Tooltip for the candlestick series
              formatter: (param: any) => {
                const item = mockData.tokenPriceCandlestick.find(d => d.time === param.axisValue);
                if (!item) return '';
                return `
                  ${item.time}<br/>
                  开盘: ${item.open}<br/>
                  最高: ${item.high}<br/>
                  最低: ${item.low}<br/>
                  收盘: ${item.close}
                `;
              }
            }
          },
          {
            name: 'MA5', // Example Moving Average
            type: 'line',
            smooth: true,
            showSymbol: false,
            data: calculateMovingAverage(mockData.tokenPriceCandlestick.map(item => item.close), 5),
            xAxisIndex: 1,
            yAxisIndex: 1,
            lineStyle: {
              width: 1,
              color: '#5470c6'
            }
          },
          {
            name: 'MA10', // Example Moving Average
            type: 'line',
            smooth: true,
            showSymbol: false,
            data: calculateMovingAverage(mockData.tokenPriceCandlestick.map(item => item.close), 10),
            xAxisIndex: 1,
            yAxisIndex: 1,
            lineStyle: {
              width: 1,
              color: '#fac858'
            }
          },
        ],
      },
      [mockData.tokenPriceCandlestick]
    );
    return cleanup;
  }, [mockData.tokenPriceCandlestick]);

  // Helper function for calculating moving average
  const calculateMovingAverage = (data: number[], windowSize: number): (number | null)[] => {
    const result: (number | null)[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < windowSize - 1) {
        result.push(null);
      } else {
        let sum = 0;
        for (let j = 0; j < windowSize; j++) {
          sum += data[i - j];
        }
        result.push(sum / windowSize);
      }
    }
    return result;
  };


  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">DeFi 数据可视化</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Chart 1: TVL Changes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div id="tvl-chart" ref={tvlChartRef} style={{ width: '100%', height: '400px' }}></div>
        </div>

        {/* Chart 2: DEX Trading Volume */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div id="dex-volume-chart" ref={dexVolumeChartRef} style={{ width: '100%', height: '400px' }}></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Chart 3: ERC20 Holder Share */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div id="erc20-share-chart" ref={erc20ShareChartRef} style={{ width: '100%', height: '400px' }}></div>
        </div>

        {/* Chart 4: Token Price Trend */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div id="token-price-chart" ref={tokenPriceChartRef} style={{ width: '100%', height: '400px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ChartsPage;