import { ReminderDto } from "src/core/dto/reminder/reminder.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { ReminderService } from "src/services/reminder.service";
export declare class ReminderController {
    private readonly reminderService;
    constructor(reminderService: ReminderService);
    sendDueReminder(params: ReminderDto): Promise<ApiResponseModel<any>>;
}
