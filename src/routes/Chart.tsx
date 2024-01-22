import { useParams, useOutletContext } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import { useQuery } from "react-query";
import ApexChart from "react-apexcharts";

interface ChartProps {
    coinId: string;
}

interface IHistorical {
    time_open: string;
    time_close: string;
    open: number;
    high: number;
    low: number;
    close: string;
    volume: number;
    market_cap: number;
}
function Chart() {
    const { coinId } = useOutletContext<ChartProps>();
    const { isLoading, data } = useQuery<IHistorical[]>(["ohlcv", String(coinId)], () =>
        fetchCoinHistory(String(coinId))
    );
    return (
        <div>
            {isLoading ? (
                "Loading chart..."
            ) : (
                <ApexChart
                    type="line"
                    series={[{ name: "sales", data: data?.map((price) => parseFloat(price.close)) ?? [] }]}
                    options={{
                        chart: {
                            height: 300,
                            width: 500,
                            toolbar: {
                                show: false,
                            },
                            background: "transparent",
                        },
                        grid: { show: false },
                        stroke: {
                            curve: "smooth",
                            width: 6,
                        },
                        yaxis: {
                            show: false,
                        },
                        xaxis: {
                            axisBorder: { show: false },
                            labels: { show: false, datetimeFormatter: { month: "mmm yy" } },
                            axisTicks: { show: false },
                            categories: data?.map((price) =>
                                new Date(parseFloat(price.time_close) * 1000).toUTCString()
                            ),
                            type: "datetime",
                        },
                        fill: {
                            type: "gradient",
                            gradient: { gradientToColors: ["blue"], stops: [0, 100] },
                        },
                        colors: ["red"],
                        tooltip: {
                            y: {
                                formatter: (value) => `$ ${value.toFixed(2)}`,
                            },
                        },
                    }}
                />
            )}
        </div>
    );
}

export default Chart;
