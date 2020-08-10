import { Request, Response } from "express"; 

import db from "../database/connection";
import convert_hour_to_minutes from "../utils/convert_hour_to_minutes";

interface ScheduleItem {
    week_day: number;
    from: string;
    to: string
}

export default class ClassesController{

    async index(request: Request, response: Response) {
        const filters = request.query;

        if (!filters.week_day || !filters.subject || !filters.time) {
            return response.status(400).json({
                error: "Missing filters to search classes"
            });
        }

        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string;

        const time_in_minutes = convert_hour_to_minutes(time);

        const classes = await db("classes")
            .whereExists(function (){
                this.select("class_schedule.*")
                    .from("class_schedule")
                    .whereRaw("`class_schedule`.`class_id` = `classes`.`id`")
                    .whereRaw("`class_schedule`.`week_day` = ??", [Number(week_day)])
                    .whereRaw("`class_schedule`.`from` <= ??", [Number(time_in_minutes)])
                    .whereRaw("`class_schedule`.`to` > ??", [Number(time_in_minutes)]);
            })
            .where("classes.subject", "=", subject)
            .join("users", "classes.user_id", "=", "users.id")
            .select(["classes.*", "users.*"]);

        return response.json(classes);
    }

    async create (request: Request, response: Response) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body;
    
        const trx = await db.transaction();
    
        try {
            const inserted_users_ids = await trx("users").insert({
                name,
                avatar,
                whatsapp,
                bio
            });
        
            const user_id = inserted_users_ids[0];
        
            const inserted_classes_id = await trx("classes").insert({
                subject,
                cost,
                user_id
            });
        
            const class_id = inserted_classes_id[0];
        
            const class_schedule = schedule.map((schedule_item: ScheduleItem) => {
                return {
                    class_id,
                    week_day: schedule_item.week_day,
                    from: convert_hour_to_minutes(schedule_item.from),
                    to: convert_hour_to_minutes(schedule_item.to)
                };
            });
        
            await trx("class_schedule").insert(class_schedule);
        
            await trx.commit();
        
            return response.status(201).send();
        } catch (err) {
            await trx.rollback();
            console.log(err);
            return response.status(400).json({
                error: "Unexpected error while creating new class"
            });
        }
    
    }
}