import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { InfluxDB, Point, WriteApi } from '@influxdata/influxdb-client';

@Injectable()
export class InfluxDBService implements OnModuleDestroy {
    private writeApi: WriteApi;

    constructor() {
        const token = process.env.INFLUXDB_TOKEN;
        const url = "http://localhost:8086";
        const org = "MPT";
        const bucket = "metrics";

        const influxDB = new InfluxDB({ url, token });
        this.writeApi = influxDB.getWriteApi(org, bucket);

        this.writeApi.useDefaultTags({
            environment: process.env.NODE_ENV,
            service: 'nest-backend'
        });

    }

    writeMetric(point: Point) {
        this.writeApi.writePoint(point);
    }



    async onModuleDestroy() {
        await this.writeApi.close();
    }
}