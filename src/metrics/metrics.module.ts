import { Module } from '@nestjs/common';
import {
    makeCounterProvider,
    makeGaugeProvider,
    makeSummaryProvider,
    PrometheusModule
} from "@willsoto/nestjs-prometheus";
import {PrometheusService} from "@/metrics/prometheus.service";
import {OrderRepository} from "@/repositories/order.repository";
import {LogService} from "@services/Log.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Order} from "@entities/Order.entity";
import {Log} from "@entities/Log.entity";
import {MetricsController} from "@/metrics/metrics.controller";
import {InfluxDBService} from "@/metrics/influxdb.service";

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
        makeSummaryProvider({ name: 'response_time_seconds', help: 'Response time in seconds', percentiles: [0.5, 0.9, 0.99] }),
        PrometheusService,
        InfluxDBService
    ],
    controllers: [
        MetricsController,
    ],
    exports: [InfluxDBService],
})
export class MetricsModule {}
