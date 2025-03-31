import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import {Counter, Gauge, register, Summary} from 'prom-client';
import {OrderRepository, OrderStatus} from "@/repositories/order.repository";
import {InfluxDBService} from "@/metrics/influxdb.service";
import {Point} from "@influxdata/influxdb-client";

@Injectable()
export class PrometheusService {
    constructor(
        @InjectMetric('http_requests_total') private httpRequestsTotal: Counter,
        @InjectMetric('active_orders') private activeOrders: Gauge,
        @InjectMetric('response_time_seconds') private responseTime: Summary,
        private orderRepository: OrderRepository,
        private influxDBService: InfluxDBService,
    ) {}

    trackRequest(route: string, status: number) {
        this.httpRequestsTotal.inc(); // Увеличиваем количество запросов

        //influxdb:
        const point = new Point('http_requests')
            .tag('route', route)
            .tag('env', process.env.NODE_ENV)
            .tag('status', String(status))
            .intField('count', 1);
        this.influxDBService.writeMetric(point);
    }

    recordResponseTime(time: number) {
        this.responseTime.observe(time); // Фиксируем время ответа

        //influxdb:
        const point = new Point('response_times')
            .floatField('duration', time);
        this.influxDBService.writeMetric(point);
    }

    async updateActiveOrders() {
        const allOrders = await this.orderRepository.findAll({skip: 0, take: 100})
        const activeOrdersCount = allOrders.items.filter(order => order.status === OrderStatus.PROCESSING).length
        this.activeOrders.set(activeOrdersCount); // Обновляем метрику


        //influxdb:
        const point = new Point('orders')
            .tag('status', OrderStatus.PROCESSING)
            .intField('count', activeOrdersCount);
        this.influxDBService.writeMetric(point);
    }

    async getMetrics(): Promise<string> {
        return register.metrics(); // Возвращает все метрики в текстовом формате
    }

}
