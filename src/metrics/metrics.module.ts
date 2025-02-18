import { Module } from '@nestjs/common';
import {
    makeCounterProvider,
    makeGaugeProvider,
    makeHistogramProvider,
    PrometheusModule
} from "@willsoto/nestjs-prometheus";
import {PrometheusService} from "@/metrics/prometheus.service";
import {OrderRepository} from "@/repositories/order.repository";
import {LogService} from "@services/Log.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Order} from "@entities/Order.entity";
import {Log} from "@entities/Log.entity";
import {MetricsController} from "@/metrics/metrics.controller";

@Module({
    imports: [
        PrometheusModule.register(),
        TypeOrmModule.forFeature([Order, Log])
    ],
    providers: [
        OrderRepository,
        LogService,
        makeCounterProvider({ name: 'http_requests_total', help: 'Total number of HTTP requests' }),
        makeGaugeProvider({ name: 'active_orders', help: 'Number of active orders' }),
        makeHistogramProvider({ name: 'response_time_seconds', help: 'Response time in seconds' }),
        PrometheusService
    ],
    controllers: [
        MetricsController,
    ],
})
export class MetricsModule {}
