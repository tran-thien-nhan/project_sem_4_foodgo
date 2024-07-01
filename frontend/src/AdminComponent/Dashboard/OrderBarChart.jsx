import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantsAllOrder } from '../../component/State/Restaurant Order/Action';

const OrderBarChart = () => {
    const dispatch = useDispatch();
    const { restaurantOrder, restaurant } = useSelector(store => store);
    const [totalData, setTotalData] = useState([]);
    const jwt = localStorage.getItem('jwt');

    useEffect(() => {
        if (restaurant.usersRestaurant?.id && jwt) {
            dispatch(fetchRestaurantsAllOrder({
                restaurantId: restaurant.usersRestaurant.id,
                jwt: jwt,
            }));
        }
    }, [dispatch, restaurant.usersRestaurant?.id, jwt]);

    useEffect(() => {
        if (restaurantOrder.orders && restaurantOrder.orders.length > 0) {
            const dailyTotal = {};
            const completedOrders = restaurantOrder.orders.filter(order => order.orderStatus === "COMPLETED");
            //restaurantOrder.orders
            completedOrders.forEach(order => {
                const date = new Date(order.createdAt).toLocaleDateString();
                if (!dailyTotal[date]) {
                    dailyTotal[date] = 0;
                }
                dailyTotal[date] += order.totalPrice;
            });

            const chartData = Object.entries(dailyTotal).map(([date, total]) => ({
                x: date,
                y: total / 1_000_000,
            }));

            setTotalData(chartData);
        }
    }, [restaurantOrder.orders]);

    // Find the maximum y value for the y-axis
    let maxYValue = totalData.length > 0 ? Math.max(...totalData.map(item => item.y)) : 0;
    const yAxisValues = maxYValue > 0 ? Array.from({ length: 11 }, (_, i) => Math.round((maxYValue / 10) * i)) : [];

    const handleValueFormat = (value) => {
        return `${value.toLocaleString()} million vnđ`;
    }

    return (
        <BarChart
            series={[
                {
                    data: totalData.map(item => item.y),
                    label: 'Total Revenue (million vnđ)',
                }
            ]}
            height={400}
            xAxis={[
                {
                    data: totalData.map(item => item.x),
                    scaleType: 'band',
                }
            ]}
            yAxis={[
                {
                    ticks: yAxisValues,
                    min: 0,
                    max: maxYValue,
                    scaleType: 'linear',
                    tickFormat: (value) => value.toString(),
                    label: 'million (vnđ)',
                }
            ]}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            tooltip={{
                trigger: 'axis',
                formatter: (params) => {
                    const { name, value } = params[0];
                    return `${name}: ${handleValueFormat(value)}`;
                }
            }}
        />
    );
};

export default OrderBarChart;
