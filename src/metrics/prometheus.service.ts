import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import {Counter, Gauge, Histogram, register, Registry} from 'prom-client';
import {OrderRepository, OrderStatus} from "@/repositories/order.repository";

@Injectable()
export class PrometheusService {
    constructor(
        @InjectMetric('http_requests_total') private httpRequestsTotal: Counter,
        @InjectMetric('active_orders') private activeOrders: Gauge,
        @InjectMetric('response_time_seconds') private responseTime: Histogram,
        private orderRepository: OrderRepository,
    ) {}

    trackRequest() {
        this.httpRequestsTotal.inc(); // Увеличиваем количество запросов
    }

    recordResponseTime(time: number) {
        this.responseTime.observe(time); // Фиксируем время ответа
    }

    async updateActiveOrders() {
        const allOrders = await this.orderRepository.findAll({skip: 0, take: 100})
        const activeOrdersCount = allOrders.items.filter(order => order.status === OrderStatus.PROCESSING).length
        this.activeOrders.set(activeOrdersCount); // Обновляем метрику
    }

    async getMetrics(): Promise<string> {
        return register.metrics(); // Возвращает все метрики в текстовом формате
    }

}
