import {Feedback} from "@entities/Feedback.entity";
import {BaseRepository} from "@/repositories/base.repository";
import {Repository} from "typeorm";
import {LogService} from "@services/Log.service";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class FeedbackRepository extends BaseRepository<Feedback, 'feedbackId'> {
    constructor(@InjectRepository(Feedback) repository: Repository<Feedback>, logService: LogService) {
        super(repository, logService, 'feedbackId');
    }
}